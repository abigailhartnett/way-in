import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Home({ journalEntry, currentUser }) {
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

		const getThisWeeksEntries = () => {
			const thisWeeksEntries = thisWeek
				.map((date) => {
					return journalEntry.find((entry) => entry.dateLogged === date);
				})
				.filter(Boolean);

			setThisWeeksEntries(thisWeeksEntries);
		};

		getThisWeeksEntries();

		setIsLoading(false);
	}, [currentDay, thisWeek, journalEntry]);

	// find user's starting weight
	const startingWeight = currentUser?.startingWeight;

	// find user's most recent weight entry
	const dateEntries = journalEntry.map((entry) => entry.dateLogged);
	const mostRecentDate = dateEntries.sort().reverse()[0];
	const mostRecentWeight = journalEntry.find(
		(entry) => entry.dateLogged === mostRecentDate
	).weightEntry;

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
	const currentProgress = journalEntry
		.map((entry) => entry.deficitEntry)
		.reduce((acc, curr) => {
			return acc + curr;
		}, 0);

	// find user's current progress in lbs (based on calorie deficit)
	const currentProgressLbs = Math.round((currentProgress * 100) / 3500) / 100;

	// find user's estimated lbs lost (based on calorie deficit)
	const estimatedLbsLost =
		Math.round((startingWeight - currentProgressLbs) * 100) / 100;

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

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="mt-2">
			<div className="text-center">
				<p className="mb-2">{lostThisWeek} lb lost this week</p>
				<h1 className="text-5xl font-bold">{thisWeeksDeficit}</h1>
				<p>Behind by {offTargetBy} calories</p>
				<p className="mt-2">
					<span>{dailyProgressToCatchUpByDate} </span>
					calories to catch up in {daysToCatchUp} days
				</p>
			</div>
			<div className="flex justify-center gap-10 mt-4">
				<div>
					<p>weigh in</p>
					<div className="flex gap-1 justify-center">
						<p className="font-semibold">{mostRecentWeight}</p>
						<p>lb</p>
					</div>
				</div>
				<div>
					<p>projected weight</p>
					<div className="flex gap-1 justify-center">
						<p className="font-semibold">{estimatedLbsLost}</p>
						<p>lb</p>
					</div>
				</div>
			</div>
			<button
				className="p-4 bg-black text-white font-semibold mt-4 w-full"
				onClick={() => navigate("/data/new-entry")}
			>
				Log an entry
			</button>
		</div>
	);
}

export default Home;
