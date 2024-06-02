import React, { useState } from "react";
import supabase from "../config/supabaseClient";
import Menu from "../components/Menu";

function Settings({ currentUser }) {
	const [daysToCatchUp, setDaysToCatchUp] = useState(
		currentUser?.daysToCatchUp
	);
	const [goalWeight, setGoalWeight] = useState(currentUser?.goalWeight);
	const [goalDate, setGoalDate] = useState(
		new Date(currentUser?.goalDate).toISOString().split("T")[0]
	);
	const [formError, setFormError] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const { error } = await supabase
				.from("users")
				.update([
					{
						daysToCatchUp,
						goalWeight,
						goalDate,
					},
				])
				.eq("id", currentUser.id);

			if (error) {
				setFormError("Could not update settings");
				setSuccessMessage(null);
				console.log(error);
			} else {
				setFormError(null);
				setSuccessMessage(`🙌🏻 Successfully updated!`);
			}
		} catch (error) {
			setSuccessMessage(null);
			setFormError("Could not update settings");
			console.error("Error updating settings:", error);
		}
	};

	return (
		<div className="m-4 flex max-w-md flex-col items-center justify-between h-screen">
			<div className="flex flex-col">
				<h1 className="text-5xl font-bold mb-8">Settings</h1>
				<form onSubmit={handleSubmit}>
					<div className="my-2 flex items-center gap-2">
						<label htmlFor="daysToCatchUp">Days to catch up</label>
						<input
							type="number"
							id="daysToCatchUp"
							value={daysToCatchUp}
							onChange={(e) => setDaysToCatchUp(e.target.value)}
							className="border-2 border-gray-300 rounded-md p-2 w-full"
						/>
					</div>
					<div className="my-2 flex items-center gap-2">
						<label htmlFor="goalWeight">Goal Weight</label>
						<input
							type="number"
							id="goalWeight"
							value={goalWeight}
							onChange={(e) => setGoalWeight(e.target.value)}
							className="border-2 border-gray-300 rounded-md p-2 w-full"
						/>
					</div>
					<div>
						<label htmlFor="goalDate">Goal Date</label>
						<input
							type="date"
							id="goalDate"
							value={goalDate}
							onChange={(e) =>
								setGoalDate(
									new Date(e.target.value).toISOString().split("T")[0]
								)
							}
							className="border-2 border-gray-300 rounded-md p-2 w-full"
						/>
					</div>
					<button
						type="submit"
						className="p-4 bg-black text-white font-semibold mt-2 w-full"
					>
						Update
					</button>
				</form>

				{formError && <p>{formError}</p>}
				{successMessage && <p>{successMessage}</p>}
			</div>
			<Menu />
		</div>
	);
}

export default Settings;
