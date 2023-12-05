"use client";
import React, { useState } from "react";

const AutomateSwitch: React.FC = () => {
	const [status, setStatus] = useState<number>(0);

	const handleSwitchToggle = () => {
		const newStatus = status === 0 ? 1 : 0;
		setStatus(newStatus);

		// Make the API call to the webhook with the new status
		fetch(process.env.NEXT_PUBLIC_MAKE_AUTO_TRIGGER as string, {
			method: "POST",
			body: JSON.stringify({ status: newStatus }),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				// Handle the response if needed
			})
			.catch((error) => {
				// Handle the error if needed
			});
	};

	return (
		<div>
			<h1 className="text-3xl pb-4">Automate Comments</h1>
			<label>
				<input
					type="checkbox"
					checked={status === 1}
					onChange={handleSwitchToggle}
				/>{" "}
				Switch On / Off
			</label>
		</div>
	);
};

export default AutomateSwitch;
