import React, { useState } from "react";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
	Textarea,
} from "@nextui-org/react";
import { Profile } from "@/types/index";

export default function UserCard({
	selectedPost,
	profiles,
}: {
	selectedPost: any;
	profiles: Profile[];
}) {
	const [loading, setLoading] = useState(false);
	const [notification, setNotification] = useState("");
	const [selectedPersona, setSelectedPersona] = useState(null as any);
	const [comment, setComment] = useState("");

	const handleAISubmit = async () => {
		setLoading(true);
		if (!selectedPost || selectedPersona === null) {
			setNotification("No post selected or persona not chosen");
			setLoading(false);
			return;
		}

		try {
			const res = await fetch("/openai", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					post: selectedPost.post,
					profile: selectedPersona.prompt as string,
				}),
			});
			const data = await res.json();
			setComment(data.chatCompletion.choices[0].message.content);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.error("Error calling webhook:", error);
			setNotification("Error Submitting Comment");
		}
	};

	const handleSubmit = async () => {
		setLoading(true);
		if (!selectedPost || selectedPersona === null) {
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
						profile: selectedPersona.name as string,
						persona: selectedPersona.prompt as string,
						comment: comment,
					}),
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			setNotification(data.link);
			setLoading(false);
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
					// className="max-w-xs"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>
				<div className="flex flex-col gap-1 items-start justify-center">
					<div>
						<h3>Choose a Profile:</h3>
						<h2>{selectedPersona ? selectedPersona?.name : "none"}</h2>
					</div>
					<div className="flex gap-2">
						{profiles.map((item, index) => (
							<div key={index} className="flex flex-col items-center">
								<div
									className={`h-6 w-6 rounded-full border-2 cursor-pointer ${
										selectedPersona?.name === item?.name
											? "border-primary bg-primary"
											: "border-default"
									}`}
									onClick={() => setSelectedPersona(item)}
								/>
								<div>{index + 1}</div>
							</div>
						))}
					</div>
					<h5 className="text-small tracking-tight text-default-400">
						{notification ? notification : ""}
					</h5>
				</div>
			</CardHeader>
			<CardBody className="px-3 py-0 text-small text-default-400"></CardBody>
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
				<Button
					color="primary"
					radius="full"
					size="sm"
					variant="solid"
					onPress={handleAISubmit}
					isDisabled={loading}
				>
					{loading ? "loading..." : "Generate Comment"}
				</Button>
			</CardFooter>
		</Card>
	);
}
