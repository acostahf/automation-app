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
import Selector from "@/components/Selector";

//TODO: add assets to db
const assets = [
	{
		label: "Video 1",
		link: "https://vimeo.com/892325499/2f602cad45?share=copy",
	},
	{
		label: "Video 2",
		link: "https://vimeo.com/892325521/8ca150d10d?share=copy",
	},
	{
		label: "Video 3",
		link: "https://vimeo.com/892325552/b74cbf2409?share=copy",
	},
	{
		label: "Video 4",
		link: "https://vimeo.com/892325574/11b89427b4?share=copy",
	},
	{
		label: "Video 5",
		link: "https://vimeo.com/892325599/e34b60dbfb?share=copy",
	},
	{
		label: "Video 6",
		link: "https://vimeo.com/892325450/b203074f1a?share=copy",
	},
	{
		label: "Video 7",
		link: "https://vimeo.com/892325797/991593ed86?share=copy",
	},
	{
		label: "full",
		link: "https://vimeo.com/892325192/a09b70dc39?share=copy",
	},
];

export default function UserCard({
	selectedPost,
	profiles,
}: {
	selectedPost: any;
	profiles: Profile[];
}) {
	const [loading, setLoading] = useState(false);
	const [aiLoading, setAILoading] = useState(false);
	const [notification, setNotification] = useState("");
	const [selectedPersona, setSelectedPersona] = useState(null as any);
	const [comment, setComment] = useState("") as any;
	const [asset, setAsset] = useState([] as any);

	const handleAISubmit = async () => {
		setAILoading(true);
		setComment("");
		if (!selectedPost || selectedPersona === null) {
			setNotification("No post selected or persona not chosen");
			setAILoading(false);
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
			setAILoading(false);
		} catch (error) {
			setAILoading(false);
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

		if (comment === "") {
			setNotification("Comment cannot be empty");
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

	const addAssetToComment = (asset: string) => {
		setComment((prev: string) => prev + " " + asset);
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
				<div className="flex flex-col gap-1 items-start justify-center w-full">
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
					<h3>Add a asset</h3>

					<Selector data={assets} handleSelect={addAssetToComment} />

					{/* <div className="flex gap-2">
						{assets.map((item, index) => (
							<div key={index} className="flex flex-col items-center">
								<div>{index + 1}</div>
								<div
									className={`h-6 w-6 rounded-full border-2 cursor-pointer ${
										asset === item
											? "border-primary bg-primary"
											: "border-default"
									}`}
									onClick={() => addAssetToComment(item)}
								/>
							</div>
						))}
					</div> */}
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
					color="secondary"
					radius="full"
					size="sm"
					variant="solid"
					onPress={handleAISubmit}
					isDisabled={aiLoading}
				>
					{aiLoading ? "loading..." : "Generate Comment"}
				</Button>
			</CardFooter>
		</Card>
	);
}
