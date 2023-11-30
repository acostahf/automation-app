"use client";
import React, { useState } from "react";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Avatar,
	Button,
} from "@nextui-org/react";

export default function UserCard({ selectedPost }) {
	const [loading, setLoading] = useState(false);
	const idiot = `Idiot: Unintentionally Flagrant/Nonsensical (Cunningham’s Law Trigger)
    Neither from a place of malice or support, the idiot is a seemingly neutral persona.
    With no regard for the consequences or successes of their actions, their commentary is seemingly throw-away.
    They typically do something for the sake of doing it. This particular character will try, say, do anything and everything because it popped in their head. 
    Online, this behavior typically makes bold statements without basis or standing, will repeatedly comment and engage because it sounds right, and often are the trigger for Cunningham’s law. 
    They’re active on camping and outdoor forums, asking basic questions that anyone can answer/should know.
    They’re easily influenced by social media and think of publications like The Onion are factual news organizations.
    
    Both the initial poster and the reposter, this persona is likely to believe anything they see and hear on the internet is true. They are often misled by the content they consume and frequently post and repost with commentary that validates the content they share. Neither argumentative nor confrontational, this poster will likely engage and respond from a genuine belief that the content they validate is true/real. The threshold of fantasy doesn’t exist, and everything is perceived to be real/treated as such. `;

	const handleSubmit = async (persona: string) => {
		setLoading(true);
		if (!selectedPost) {
			console.error("No post selected");
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
					body: JSON.stringify({ ...selectedPost.post, persona: persona }), // Assuming selectedPost contains the post object
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			setLoading(false);
			console.log("Webhook response:", data);
		} catch (error) {
			setLoading(false);
			console.error("Error calling webhook:", error);
		}
	};

	return (
		<Card className="max-w-[340px]">
			<CardHeader className="justify-between">
				<div className="flex gap-5">
					<Avatar
						isBordered
						radius="full"
						size="md"
						src="/avatars/avatar-1.png"
					/>
					<div className="flex flex-col gap-1 items-start justify-center">
						<h4 className="text-small font-semibold leading-none text-default-600">
							Persona 1
						</h4>
						{/* <h5 className="text-small tracking-tight text-default-400">
							@zoeylang
						</h5> */}
					</div>
				</div>
			</CardHeader>
			<CardBody className="px-3 py-0 text-small text-default-400"></CardBody>
			<CardFooter className="gap-3">
				<Button
					color="primary"
					radius="full"
					size="sm"
					variant={"solid"}
					onPress={() => handleSubmit(idiot)}
					isDisabled={loading}
				>
					{loading ? "loading..." : "Comment"}
				</Button>
				{/* <div className="flex gap-1">
					<p className="font-semibold text-default-400 text-small">4</p>
					<p className=" text-default-400 text-small">Following</p>
				</div>
				<div className="flex gap-1">
					<p className="font-semibold text-default-400 text-small">
						97.1K
					</p>
					<p className="text-default-400 text-small">Followers</p>
				</div> */}
			</CardFooter>
		</Card>
	);
}
