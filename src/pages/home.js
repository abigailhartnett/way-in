import React, { useState, useEffect, useMemo } from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import Menu from "../components/Menu";

function Home({ journalEntries, currentUser }) {
	const [isLoading, setIsLoading] = useState(true);
	const [thisWeek, setThisWeek] = useState([]);
	const [thisWeeksEntries, setThisWeeksEntries] = useState([]);
	const [currentDay, setCurrentDay] = useState(new Date());

	const daysToCatchUp = currentUser?.daysToCatchUp;

	const windowSize = useWindowSize();

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

	//

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

	//

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

	// estimated weight loss
	const estimatedWeightLoss =
		Math.round((startingWeight - averageWeightRounded) * 100) / 100;

	//

	const thisWeeksDeficit = thisWeeksEntries
		.map((entry) => entry.deficitEntry)
		.reduce((acc, curr) => {
			return acc + curr;
		}, 0);

	// find user's progress in lb for this week (based on calorie deficit)
	const lostThisWeek = Math.round((thisWeeksDeficit * 100) / 3500) / 100;

	// find user's progressProjection
	const progressProjection = Math.round(
		(totalCaloriesToLose / totalDaysToLose) * daysSinceStart
	);

	// find user's current progress -- move into hook
	const currentProgress = journalEntries
		.map((entry) => entry.deficitEntry)
		.reduce((acc, curr) => {
			return acc + curr;
		}, 0);

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

	console.log(windowSize);

	return (
		<div
			className="m-4 max-w-md flex flex-col items-center justify-between"
			style={{ height: `${windowSize.height}px` }}
		>
			<div>
				<div className="text-center">
					<p>Today's goal</p>
					<h1 className="text-5xl font-bold">{dailyProgressToCatchUpByDate}</h1>
					<p>calorie deficit</p>
				</div>
				<div className="flex mt-8 gap-8">
					<div className="text-center">
						<p>Lost this week</p>
						<p className="font-semibold">{lostThisWeek} lb</p>
					</div>
					<div className="text-center">
						<p>Total lost</p>
						<div className="flex gap-1 justify-center">
							<p className="font-semibold">{estimatedWeightLoss}</p>
							<p>lb</p>
						</div>
					</div>
				</div>
			</div>
			<Menu />
		</div>
	);
}

export default Home;
