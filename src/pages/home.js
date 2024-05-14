import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Home({ journalEntries, currentUser }) {
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(true);
	const [thisWeek, setThisWeek] = useState([]);
	const [thisWeeksEntries, setThisWeeksEntries] = useState([]);
	const [currentDay, setCurrentDay] = useState(new Date());

	const [daysToCatchUp] = useState(7);

	useMemo(() => {
		setCurrentDay(new Date());
	}, []);

	// const today = `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1).toString().padStart(2, "0")}-${currentDay.getDate().toString().padStart(2, "0")}`;

	useEffect(() => {
		function getThisWeek() {
			const dayOfTheWeek = currentDay.getDay();
			const difference = dayOfTheWeek === 0 ? -6 : -(dayOfTheWeek - 1);
			const dates = [];

			for (let i = difference; i <= 0; i++) {
				const newDate = new Date(
					currentDay.getFullYear(),
					currentDay.getMonth(),
					currentDay.getDate() + i
				);
				const formattedDate = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, "0")}-${newDate.getDate().toString().padStart(2, "0")}`;
				dates.push(formattedDate);
			}

			setThisWeek(dates);
		}

		getThisWeek();
	}, [currentDay]);

	useEffect(() => {
		const getThisWeeksEntries = () => {
			const thisWeeksEntries = thisWeek
				.map((date) => {
					return journalEntries.find((entry) => entry.dateLogged === date);
				})
				.filter(Boolean);

			setThisWeeksEntries(thisWeeksEntries);
		};

		getThisWeeksEntries();

		setIsLoading(false);
	}, [thisWeek, journalEntries]);

	// find user's starting weight
	const startingWeight = currentUser?.startingWeight;

	// find user's most recent weight entry

	const mostRecentJournalEntries = journalEntries
		.filter((entry) => entry.dateLogged)
		.sort((a, b) => new Date(b.dateLogged) - new Date(a.dateLogged))
		.slice(0, 7);

	const averageWeight =
		mostRecentJournalEntries
			.slice(0, 7)
			.map((entry) => entry.weightEntry)
			.reduce((acc, curr) => acc + curr, 0) / mostRecentJournalEntries.length;

	const averageWeightRounded = Math.round(averageWeight * 100) / 100;
	// find user's goal weight
	const goalWeight = currentUser?.goalWeight;

	// fid user's start date
	const startDate = new Date(currentUser?.startDate);

	// find user's goal date
	const goalDate = new Date(currentUser?.goalDate);

	// find user's total days to lose
	const totalDaysToLose = Math.round(
		(goalDate - startDate) / (1000 * 60 * 60 * 24)
	);

	// find user's days since starting--not including today
	const daysSinceStart = Math.round(
		(currentDay - startDate) / (1000 * 60 * 60 * 24) - 1
	);

	// find user's days left to lose
	// const daysLeft = Math.round((goalDate - currentDay) / (1000 * 60 * 60 * 24));

	// find user's total calories to lose based on their goal weight
	const totalCaloriesToLose =
		Math.round((startingWeight - goalWeight) * 3500 * 100) / 100;

	// find user's ideal daily deficit
	const idealDailyDeficit = Math.round(totalCaloriesToLose / totalDaysToLose);

	// find user's progressProjection
	const progressProjection = Math.round(
		(totalCaloriesToLose / totalDaysToLose) * daysSinceStart
	);

	// find user's current progress
	const currentProgress = journalEntries
		.map((entry) => entry.deficitEntry)
		.reduce((acc, curr) => {
			return acc + curr;
		}, 0);

	// find user's current progress in lbs (based on calorie deficit)
	const currentProgressLbs = Math.round((currentProgress * 100) / 3500) / 100;

	// find user's projected lbs lost (based on calorie deficit)
	const projectedLbsLost =
		Math.round((startingWeight - currentProgressLbs) * 100) / 100;

	// estimated weight loss
	const estimatedWeightLoss =
		Math.round((startingWeight - averageWeightRounded) * 100) / 100;

	const thisWeeksDeficit = thisWeeksEntries
		.map((entry) => entry.deficitEntry)
		.reduce((acc, curr) => {
			return acc + curr;
		}, 0);

	// find user's progress in lb for this week (based on calorie deficit)
	const lostThisWeek = Math.round((thisWeeksDeficit * 100) / 3500) / 100;

	// find difference between current progress and progress projection
	// negative number means "behind" and positive number means "ahead"
	const offTargetBy = progressProjection - currentProgress;

	// calculate user's calories to catch up (over the next 7 days) by
	// subtracting total deficit from total calories that should have been lost that day
	// and dividing by 7
	const dailyProgressToCatchUpByDate = Math.round(
		offTargetBy / daysToCatchUp + idealDailyDeficit
	);

	const sortedEntries = journalEntries.sort((a, b) => {
		const dateA = new Date(a.dateLogged);
		const dateB = new Date(b.dateLogged);

		return dateB - dateA;
	});

	const logEntries = () => {
		return sortedEntries.map((entry) => (
			<div
				key={entry.id}
				className="flex justify-between border-b border-t-0 border-r-0 border-l-0 solid border-black py-2"
			>
				<div>{entry.dateLogged}</div>
				<div>{entry.weightEntry}</div>
				<div>{entry.deficitEntry}</div>
			</div>
		));
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="m-4 max-w-md">
			<div className="flex justify-between">
				<div>
					<div>
						<p className="mb-2">{lostThisWeek} lb lost this week</p>
						<h1 className="text-5xl font-bold">{thisWeeksDeficit}</h1>
						<p>Behind by {offTargetBy} calories</p>
						<p className="mt-2">
							<span>{dailyProgressToCatchUpByDate} </span>
							calories to catch up in {daysToCatchUp} days
						</p>
					</div>
				</div>
				<div>
					<div>Weight statistics</div>
					<div className="flex gap-2 justify-between">
						<p>projected</p>
						<div className="flex gap-1 justify-center">
							<p className="font-semibold">{projectedLbsLost}</p>
							<p>lb</p>
						</div>
					</div>
					<div className="flex gap-2 justify-between">
						<p>average</p>
						<div className="flex gap-1 justify-center">
							<p className="font-semibold">{averageWeightRounded}</p>
							<p>lb</p>
						</div>
					</div>
					<div className="flex gap-2 justify-between">
						<p>estimated loss</p>
						<div className="flex gap-1 justify-center">
							<p className="font-semibold">{estimatedWeightLoss}</p>
							<p>lb</p>
						</div>
					</div>
				</div>
			</div>
			<button
				className="p-4 bg-black text-white font-semibold my-4"
				onClick={() => navigate("/data/new-entry")}
			>
				Log an entry
			</button>
			<div className="flex justify-between">
				<div className="font-semibold">Date</div>
				<div className="font-semibold">Weigh in</div>
				<div className="font-semibold">Deficit</div>
			</div>
			<div>{logEntries()}</div>
		</div>
	);
}

export default Home;
