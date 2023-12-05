"use client";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import UserCard from "@/components/UserCard";
import RedditPost from "@/components/RedditPost";
import { useState } from "react";
import AutomateSwitch from "@/components/AutomateSwitch";

export default function Home() {
	const [selectedPost, setSelectedPost] = useState({
		index: null,
		post: null,
	});
	return (
		<section className="flex flex-row items-start justify-center gap-4 py-8 md:py-10">
			<div className="mt-8">
				<RedditPost
					setSelectedPost={setSelectedPost}
					selectedPost={selectedPost}
					sourceType="AskReddit"
					sourceName="Particular-Cap6132"
				/>
			</div>
			<div className="flex gap-3 flex-col">
				<UserCard selectedPost={selectedPost} />
				<AutomateSwitch />
			</div>
			<div className="mt-8">
				<RedditPost
					setSelectedPost={setSelectedPost}
					selectedPost={selectedPost}
					sourceType="userActivity"
					sourceName="Particular-Cap6132"
				/>
			</div>
		</section>
	);
}
