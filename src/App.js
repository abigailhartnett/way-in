import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import supabase from "./config/supabaseClient";
import Home from "./pages/home";
import Journal from "./pages/journal";
import AddDataEntry from "./pages/addDataEntry";
import Settings from "./pages/settings";
import Data from "./pages/data";

function App() {
	const [fetchError, setFetchError] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);
	const [journalEntries, setJournalEntries] = useState(null);
	const [users, setUsers] = useState(null);

	useEffect(() => {
		const fetchJournalEntries = async () => {
			const { data, error } = await supabase.from("journal").select();

			if (error) {
				setFetchError("Could not fetch data");
				setJournalEntries(null);
				console.log(fetchError, error);
			}
			if (data) {
				setJournalEntries(data);
				setFetchError(null);
			}
		};

		fetchJournalEntries();

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

	useEffect(() => {
		const user = users?.find((user) => user.userName === "abigailHartnett");
		setCurrentUser(user);
	}, [users]);

	if (!journalEntries || !users) {
		return <div>Loading...</div>;
	}

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<Home journalEntries={journalEntries} currentUser={currentUser} />
					}
				/>
				<Route
					path="/journal"
					element={
						<Journal
							journalEntries={journalEntries}
							setJournalEntries={setJournalEntries}
							currentUser={currentUser}
						/>
					}
				/>
				<Route
					path="/data/new-entry"
					element={
						<AddDataEntry
							currentUser={currentUser}
							journalEntries={journalEntries}
							setJournalEntries={setJournalEntries}
						/>
					}
				/>
				<Route
					path="/settings"
					element={
						<Settings
							currentUser={currentUser}
							journalEntries={journalEntries}
							setJournalEntries={setJournalEntries}
						/>
					}
				/>
				<Route
					path="/data"
					element={
						<Data
							currentUser={currentUser}
							journalEntries={journalEntries}
							setJournalEntries={setJournalEntries}
						/>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
