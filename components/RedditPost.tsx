"use cleint";
import React, { useEffect, useState } from "react";

interface RedditPost {
	title: string;
	author: string;
	created_utc: number;
	name: string;
}

interface RedditPostProps {
	selectedPost: { index: number; post: RedditPost } | null;
	setSelectedPost: (value: { index: number; post: RedditPost }) => void;
}

const RedditPost: React.FC<RedditPostProps> = ({
	selectedPost,
	setSelectedPost,
}) => {
	const [posts, setPosts] = useState<RedditPost[]>([]);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await fetch(
					"https://www.reddit.com/r/AskReddit/new.json"
				);
				const data = await response.json();
				const newPosts = data.data.children.map((child: any) => ({
					title: child.data.title,
					author: child.data.author,
					created_utc: child.data.created_utc,
					name: child.data.name,
				}));
				setPosts(newPosts);
			} catch (error) {
				console.error("Error fetching posts:", error);
			}
		};

		fetchPosts();
	}, []);

	return (
		<div>
			<h1 className="text-3xl pb-4">New Posts</h1>
			{posts.map((post, index) => (
				<div
					className={
						selectedPost?.index === index
							? "mb-2 p-2 max-w-l border-2 border-blue-500 rounded-lg"
							: "mb-2 p-2 max-w-l border-2 border-gray-100/70 rounded-lg"
					}
					key={post.created_utc}
					onClick={() => setSelectedPost({ index, post })}
				>
					<h2>{post.title}</h2>
					<p className="text-gray-400">Author: {post.author}</p>
				</div>
			))}
		</div>
	);
};

export default RedditPost;
