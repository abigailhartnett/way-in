import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import supabase from "./config/supabaseClient";
import Home from "./pages/home";
import Data from "./pages/data";

function App() {
	const [fetchError, setFetchError] = useState(null);

	const [journalEntry, setJournalEntry] = useState(null);
	const [users, setUsers] = useState(null);

	useEffect(() => {
		const fetchJournalEntry = async () => {
			const { data, error } = await supabase.from("journal").select();

			if (error) {
				setFetchError("Could not fetch data");
				setJournalEntry(null);
				console.log(fetchError, error);
			}
			if (data) {
				setJournalEntry(data);
				setFetchError(null);
			}
		};

		fetchJournalEntry();

		const fetchUsers = async () => {
			const { data, error } = await supabase.from("users").select();

			if (error) {
				setFetchError("Could not fetch data");
				setUsers(null);
				console.log(fetchError, error);
			}
			if (data) {
				setUsers(data);
				setFetchError(null);
			}
		};

		fetchUsers();
	}, [fetchError, setFetchError]);

	if (!journalEntry || !users) {
		return <div>Loading...</div>;
	}

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={<Home journalEntry={journalEntry} users={users} />}
				/>
				<Route
					path="/data"
					element={
						<Data
							journalEntry={journalEntry}
							setJournalEntry={setJournalEntry}
						/>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
