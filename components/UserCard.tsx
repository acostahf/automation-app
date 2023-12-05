import React, { useState } from "react";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
	Textarea,
} from "@nextui-org/react";

export default function UserCard({ selectedPost }) {
	const [loading, setLoading] = useState(false);
	const [notification, setNotification] = useState("");
	const [selectedPersona, setSelectedPersona] = useState(null);
	const [comment, setComment] = useState("");

	const personas = [
		{
			id: 1,
			description: "Idiot: Unintentionally Flagrant/Nonsensical...",
		},
		{ id: 2, description: "Funny: Intentionally Flagrant/Nonsensical..." },
		{ id: 3, description: "Troll: Intentionally Flagrant/Nonsensical..." },
		{ id: 4, description: "Troll: Intentionally Flagrant/Nonsensical..." },
		{ id: 5, description: "Troll: Intentionally Flagrant/Nonsensical..." },
		{ id: 6, description: "Troll: Intentionally Flagrant/Nonsensical..." },
		// Add other personas here...
	];

	const handleSubmit = async () => {
		setLoading(true);
		if (!selectedPost || selectedPersona === null) {
			console.error("No post selected or persona not chosen");
			setNotification("No post selected or persona not chosen");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(
				process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL as string,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...selectedPost.post,
						persona: personas[selectedPersona - 1].description,
						comment: comment,
					}),
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			setLoading(false);
			console.log("Webhook response:", data);
			setNotification(data.link);
		} catch (error) {
			setLoading(false);
			console.error("Error calling webhook:", error);
			setNotification("Error Submitting Comment");
		}
	};

	return (
		<Card className="w-full min-w-[340px]">
			<CardHeader className="justify-between flex flex-col items-start gap-4">
				<Textarea
					label="Comment"
					placeholder="Enter your comment here"
					className="max-w-xs"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>
				<div className="flex flex-col gap-1 items-start justify-center">
					<h3>Choose a Persona:</h3>
					<div className="flex gap-2">
						{personas.map((persona) => (
							<div key={persona.id} className="flex flex-col items-center">
								<div
									className={`h-6 w-6 rounded-full border-2 cursor-pointer ${
										selectedPersona === persona.id
											? "border-primary bg-primary"
											: "border-default"
									}`}
									onClick={() => setSelectedPersona(persona.id)}
								/>
								<div>{persona.id}</div>
							</div>
						))}
					</div>
					<h5 className="text-small tracking-tight text-default-400">
						{notification ? notification : ""}
					</h5>
				</div>
			</CardHeader>
			<CardBody className="px-3 py-0 text-small text-default-400">
				{/* You can display the selected persona description here if needed */}
			</CardBody>
			<CardFooter className="gap-3">
				<Button
					color="primary"
					radius="full"
					size="sm"
					variant="solid"
					onPress={handleSubmit}
					isDisabled={loading}
				>
					{loading ? "loading..." : "Comment"}
				</Button>
			</CardFooter>
		</Card>
	);
}
