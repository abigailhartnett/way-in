import React from "react";
import ProgressCircle from "./progressCircle";

const ProgressChart = ({ progress, children }) => {
	return (
		<div className="relative">
			<ProgressCircle progress={progress} />
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				{children}
			</div>
		</div>
	);
};

export default ProgressChart;
