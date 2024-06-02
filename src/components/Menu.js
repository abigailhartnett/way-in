import React from "react";
import { useNavigate } from "react-router-dom";

function Menu() {
	const navigate = useNavigate();

	return (
		<div className="w-full flex justify-between py-8 items-center">
			<button
				className="bg-black rounded-full h-fit p-4"
				onClick={() => navigate("/settings")}
			>
				<span
					class="material-symbols-outlined bg-transparent h-fit w-fit"
					alt="Go to journal"
				>
					settings
				</span>
			</button>
			<button
				className="bg-black rounded-full h-fit p-4"
				onClick={() => navigate("/data")}
			>
				<span
					class="material-symbols-outlined bg-transparent h-fit w-fit"
					alt="Go to data page"
				>
					bar_chart
				</span>
			</button>
			<button
				className="bg-black rounded-full h-fit p-6"
				onClick={() => navigate("/")}
			>
				<span
					class="material-symbols-outlined bg-transparent h-fit w-fit"
					alt="Go to home"
				>
					home
				</span>
			</button>
			<button
				className="bg-black rounded-full h-fit p-4"
				onClick={() => navigate("/journal")}
			>
				<span
					class="material-symbols-outlined bg-transparent h-fit w-fit"
					alt="Go to journal"
				>
					book
				</span>
			</button>
			<button
				className="bg-black p-4 rounded-full"
				onClick={() => navigate("/data/new-entry")}
			>
				<span class="material-symbols-outlined bg-transparent" alt="Add entry">
					add
				</span>
			</button>
		</div>
	);
}

export default Menu;
