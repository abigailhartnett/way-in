import { useEffect, useState } from "react";

export const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState({
		height: window.innerHeight,
		width: window.innerWidth,
	});

	useEffect(() => {
		const windowSizeHandler = () => {
			setWindowSize([window.innerWidth, window.innerHeight]);
		};
		window.addEventListener("resize", windowSizeHandler);

		return () => {
			window.removeEventListener("resize", windowSizeHandler);
		};
	}, []);

	return windowSize;
};

export default useWindowSize;