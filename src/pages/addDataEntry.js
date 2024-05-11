import React, { useState } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

function AddDataEntry({ journalEntries, currentUser }) {
	const navigate = useNavigate();
	const [formError, setFormError] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [deficitEntry, setDeficitEntry] = useState(0);
	const [dateLogged, setDateLogged] = useState(
		new Date().toISOString().split("T")[0]
	);

	// find user's most recent weight entry
	// Note: consider moving to top level, since this is shared?
	// Or create a "userdata" context to store this information
	const dateEntries = journalEntries.map((entry) => entry.dateLogged);
	const mostRecentDate = dateEntries.sort().reverse()[0];
	const mostRecentWeight = journalEntries.find(
		(entry) => entry.dateLogged === mostRecentDate
	).weightEntry;

	const [weightEntry, setWeightEntry] = useState(mostRecentWeight);

	console.log(weightEntry);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!dateLogged || !weightEntry || deficitEntry === null) {
			setFormError("Please fill out all fields");
			return;
		}

		try {
			const { error } = await supabase.from("journal").insert([
				{
					deficitEntry,
					dateLogged,
					weightEntry,
					userName: currentUser.userName,
				},
			]);

			if (error) {
				setFormError("Could not add entry");
				setSuccessMessage(null);
				console.log(error);
			} else {
				setFormError(null);
				setSuccessMessage(`🙌🏻 Added entry for ${dateLogged}!`);

				// Reset form
				setDateLogged(new Date().toISOString().split("T")[0]);
				setWeightEntry(mostRecentWeight);
				setDeficitEntry(0);
			}
		} catch (error) {
			setSuccessMessage(null);
			setFormError("Could not add entry");
			console.error("Error adding entry:", error);
		}
	};

	if (!journalEntries || !currentUser) {
		return <div>Loading...</div>;
	}

	return (
		<div className="m-4 max-w-md">
			{/* Note: Lay all this out with grid */}
			<h1 className="mb-8 text-2xl font-bold">Add Data Entry</h1>
			<form onSubmit={handleSubmit}>
				<div className="my-2 flex items-center gap-2">
					<label htmlFor="dateLogged">Date</label>
					<input
						type="date"
						id="dateLogged"
						value={dateLogged}
						onChange={(e) => setDateLogged(e.target.value)}
						className="border-2 border-gray-300 rounded-md p-2 w-full"
					/>
				</div>
				<div className="my-2 flex items-center gap-2">
					<label htmlFor="weightEntry">Weight</label>
					<input
						type="number"
						id="weightEntry"
						value={weightEntry}
						onChange={(e) => setWeightEntry(e.target.value)}
						className="border-2 border-gray-300 rounded-md p-2 w-full"
					/>
				</div>
				<div className="my-2 flex items-center gap-2">
					<label htmlFor="deficitEntry">DeficitEntry</label>
					<input
						type="number"
						id="deficitEntry"
						value={deficitEntry}
						onChange={(e) => setDeficitEntry(e.target.value)}
						className="border-2 border-gray-300 rounded-md p-2 w-full"
					/>
				</div>
				<div>
					{formError && <p className="text-red-500">{formError}</p>}
					{successMessage && <p>{successMessage}</p>}
				</div>
				<button className="p-4 bg-black text-white font-semibold mt-2 w-full">
					Submit
				</button>
			</form>
			<button
				className="p-4 bg-gray-300 font-semibold mt-4 w-full"
				onClick={() => navigate("/")}
			>
				Back
			</button>
		</div>
	);
}

export default AddDataEntry;
