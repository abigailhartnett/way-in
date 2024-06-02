import React from "react";
import Menu from "../components/Menu";

function Data({ journalEntries, currentUser }) {
	// find user's starting weight
	const startingWeight = currentUser?.startingWeight;

	// find user's current progress -- move into hook
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

	// estimated weight loss
	const estimatedWeightLoss =
		Math.round((startingWeight - averageWeightRounded) * 100) / 100;

	return (
		<div className="m-4 max-w-md flex flex-col items-center justify-between h-screen">
			<div>
				<h1 className="text-5xl font-bold mb-8">Statistics</h1>
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
			<Menu />
		</div>
	);
}

export default Data;
