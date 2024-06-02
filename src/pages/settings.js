import React from "react";
import Menu from "../components/Menu";

function Settings({ currentUser }) {
	const daysToCatchUp = 7;

	// find user's goal date
	const goalDate = new Date(currentUser?.goalDate);

	// find user's goal weight
	const goalWeight = currentUser?.goalWeight;

	return (
		<div className="m-4 flex max-w-md flex-col items-center justify-between h-screen">
			<div className="flex flex-col">
				<h1 className="text-5xl font-bold mb-8">Settings</h1>
				<span>Day to catch up: {daysToCatchUp}</span>
				<span>Weight loss goal: {goalWeight}</span>
				<span>Goal date: {goalDate.toLocaleDateString()} </span>
			</div>
			<Menu />
		</div>
	);
}

export default Settings;
