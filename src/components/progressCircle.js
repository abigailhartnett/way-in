import React from "react";

const ProgressCircle = ({ progress }) => {
	const radius = 110;
	const strokeWidth = 10;
	const normalizedRadius = radius - strokeWidth * 2;
	const circumference = normalizedRadius * 2 * Math.PI;
	const strokeDashoffset = circumference - (progress / 100) * circumference;

	return /*#__PURE__*/ React.createElement(
		"svg",
		{
			height: radius * 2,
			width: radius * 2,
		},
		/*#__PURE__*/ React.createElement("circle", {
			stroke: "#f1f1f1",
			fill: "transparent",
			strokeWidth: strokeWidth,
			r: normalizedRadius,
			cx: radius,
			cy: radius,
		}),
		/*#__PURE__*/ React.createElement("circle", {
			stroke: "#007aff",
			fill: "transparent",
			strokeWidth: strokeWidth,
			strokeDasharray: circumference + " " + circumference,
			style: {
				strokeDashoffset,
			},
			r: normalizedRadius,
			cx: radius,
			cy: radius,
		})
	);
};

export default ProgressCircle;
