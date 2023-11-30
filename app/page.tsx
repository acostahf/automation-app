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

export default function Home() {
	const [selectedPost, setSelectedPost] = useState({
		index: null,
		post: null,
	});
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center"></div>

			<div className="flex gap-3">
				<UserCard selectedPost={selectedPost} />
			</div>

			<div className="mt-8">
				<RedditPost
					setSelectedPost={setSelectedPost}
					selectedPost={selectedPost}
				/>
			</div>
		</section>
	);
}
