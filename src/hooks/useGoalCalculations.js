import React from "react";

export const useFindMostRecentWeight = (journalEntries) => {
	const mostRecentJournalEntries = journalEntries
		.filter((entry) => entry.dateLogged)
		.sort((a, b) => new Date(b.dateLogged) - new Date(a.dateLogged))
		.slice(0, 7);

	return mostRecentJournalEntries;
};

export const useFindBMI = (currentUser, weight) => {
	// Enter projected weight for BMI safety check
	// Enter most recent weight for current BMI calculation
	// Enter starting weight for starting BMI calculation

	const height = currentUser?.feet * 12 + currentUser?.inches;
	const bmi = (weight / (height * height)) * 703;
	return bmi;
};

export const useCalcNextGoal = (currentUser, weightToLose) => {
	// weightToLose (user will input--suggested at 5 and restricted to max 5)
	// use projectedBMI to trigger warnings if too low

	const startingWeight = useFindMostRecentWeight({ journalEntries }); // change to 7-day average?
	const projectedWeight = startingWeight - weightToLose;
	const projectedBMI = useFindBMI(currentUser, projectedWeight); // trigger warning if too low

	return { projectedBMI, projectedWeight };
};
