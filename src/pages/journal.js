import React from "react";
import Menu from "../components/Menu";

function Data({ journalEntries }) {
	const sortedEntries = journalEntries.sort((a, b) => {
		const dateA = new Date(a.dateLogged);
		const dateB = new Date(b.dateLogged);

		return dateB - dateA;
	});

	const logEntries = () => {
		return sortedEntries.map((entry) => (
			<div
				key={entry.id}
				className="flex justify-between border-b border-t-0 border-r-0 border-l-0 solid border-black py-2 w-full"
			>
				<div>{entry.dateLogged}</div>
				<div>{entry.weightEntry}</div>
				<div>{entry.deficitEntry}</div>
			</div>
		));
	};

	return (
		<div className="m-4 flex max-w-md flex-col items-center justify-between h-screen">
			<h1 className="text-5xl font-bold mb-8">Journal</h1>
			<div className="flex justify-between w-full">
				<div className="font-semibold">Date</div>
				<div className="font-semibold">Weigh in</div>
				<div className="font-semibold">Deficit</div>
			</div>
			<div className="w-full  overflow-y-scroll">{logEntries()}</div>
			<Menu />
		</div>
	);
}

export default Data;
