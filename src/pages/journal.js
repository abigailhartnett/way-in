import React, { useState } from "react";
import supabase from "../config/supabaseClient";
import { useWindowSize } from "../hooks/useWindowSize";
import Menu from "../components/Menu";

function Data({ journalEntries, setJournalEntries, currentUser }) {
	// const [formError, setFormError] = useState(null);
	// const [successMessage, setSuccessMessage] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [weightEntry, setWeightEntry] = useState("");
	const [deficitEntry, setDeficitEntry] = useState("");
	const [dateLogged, setDateLogged] = useState(
		new Date().toISOString().split("T")[0]
	);

	const windowSize = useWindowSize();

	const fetchEntries = async () => {
		const { data, error } = await supabase
			.from("journal")
			.select("*")
			.order("dateLogged", { ascending: false });

		if (error) {
			console.error("Error fetching journal entries:", error);
		} else {
			setJournalEntries(data);
		}
	};

	const handleSubmit = async (e, id) => {
		e.preventDefault();

		try {
			const { error } = await supabase
				.from("journal")
				.update({
					deficitEntry,
					dateLogged,
					weightEntry,
					userName: currentUser.userName,
				})
				.eq("id", id);

			if (error) {
				// setFormError("Could not update settings");
				// setSuccessMessage(null);
				console.log(error);
			} else {
				// setFormError(null);
				// setSuccessMessage(`🙌🏻 Successfully updated!`);
				setEditingId(null);
			}
		} catch (error) {
			// setSuccessMessage(null);
			// setFormError("Could not update settings");
			console.error("Error updating settings:", error);
		}

		fetchEntries();
	};

	const sortedEntries = journalEntries.sort((a, b) => {
		const dateA = new Date(a.dateLogged);
		const dateB = new Date(b.dateLogged);

		return dateB - dateA;
	});

	const startEditing = (entry) => {
		setDateLogged(new Date(entry.dateLogged).toISOString().split("T")[0]);
		setWeightEntry(entry.weightEntry);
		setDeficitEntry(entry.deficitEntry);
		setEditingId(entry.id);
	};

	const loggedEntries = () => {
		return sortedEntries.map((entry) => {
			const isEditing = editingId === entry.id;

			return isEditing ? (
				<form
					onSubmit={(e) => handleSubmit(e, entry.id)}
					key={entry.id}
					className="flex justify-between items-center border-b border-t-0 border-r-0 border-l-0 solid border-black py-2 gap-2"
				>
					<div className="w-full flex justify-center gap-8">
						<input
							label="Date logged"
							type="date"
							id="dateLogged"
							value={dateLogged}
							onChange={(e) =>
								setDateLogged(
									new Date(e.target.value).toISOString().split("T")[0]
								)
							}
							className="text-sm w-20"
						/>
						<input
							label="Weight"
							type="number"
							id="weightEntry"
							value={weightEntry}
							onChange={(e) => setWeightEntry(e.target.value)}
							className="text-sm w-20"
						/>
						<input
							label="Deficit"
							type="number"
							id="deficitEntry"
							value={deficitEntry}
							onChange={(e) => setDeficitEntry(e.target.value)}
							className="text-sm w-20"
						/>
					</div>
					<button type="submit" className="text-sm">
						<span class="material-symbols-outlined">check</span>
					</button>
				</form>
			) : (
				<div
					key={entry.id}
					className="flex w-full justify-between items-center border-b border-t-0 border-r-0 border-l-0 solid border-black py-2 gap-2"
				>
					<div className="w-18 text-sm">
						{new Date(entry?.dateLogged).toISOString().split("T")[0]}
					</div>
					<div className="w-18 text-sm">{entry?.weightEntry}</div>
					<div className="w-18">{entry?.deficitEntry}</div>
					<button onClick={() => startEditing(entry)}>
						<span class="material-symbols-outlined">stylus</span>
					</button>
				</div>
			);
		});
	};

	return (
		<div
			className="m-4 w-full flex max-w-lg flex-col items-center justify-between"
			style={{ height: `${windowSize.height}px` }}
		>
			<div className="w-full">
				<h1 className="text-5xl font-bold mb-8 text-center">Journal</h1>
				<div className="flex justify-between w-full">
					<div className="font-semibold">Date</div>
					<div className="font-semibold">Weigh in</div>
					<div className="font-semibold">Deficit</div>
				</div>
				<div className="w-full overflow-y-scroll">{loggedEntries()}</div>
			</div>
			<Menu />
		</div>
	);
}

export default Data;
