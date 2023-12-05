import { Skeleton } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

const subreddits = ["AskReddit", "Camping", "BackPacking"]; // Add your list of 20 subreddits here

interface RedditPost {
	title: string;
	author: string;
	created_utc: number;
	name: string;
	subReddit: string;
}

interface RedditPostProps {
	selectedPost: { index: number; post: RedditPost } | null;
	setSelectedPost: (value: { index: number; post: RedditPost }) => void;
	sourceType: "subreddit" | "userActivity";
	sourceName: string; // subreddit name or username
}

const RedditPost: React.FC<RedditPostProps> = ({
	selectedPost,
	setSelectedPost,
	sourceType,
	sourceName,
}) => {
	const [posts, setPosts] = useState<RedditPost[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchPosts = async () => {
		setLoading(true);
		setPosts([]);
		let url;
		if (sourceType !== "userActivity") {
			try {
				const fetchedPosts = await Promise.all(
					subreddits.map(async (subreddit) => {
						const response = await fetch(
							`https://www.reddit.com/r/${subreddit}/new.json?limit=3`
						);
						const data = await response.json();
						return data.data.children.map((child) => child.data); // Return an array of posts for each subreddit
					})
				);
				const mergedPosts = fetchedPosts.flatMap((post) => post); // Flatten the array of arrays into a single array
				setPosts(mergedPosts);
				setLoading(false);
			} catch (error) {
				setLoading(false);
				console.error("Error fetching posts:", error);
				return;
			}
		} else {
			// url = `https://www.reddit.com/user/Particular-Cap6132/comments`;
			// try {
			// 	const response = await fetch(url);
			// 	const data = await response.json();
			// 	const newPosts = data.data.children.map((child: any) => ({
			// 		title: child.data.title,
			// 		author: child.data.author,
			// 		created_utc: child.data.created_utc,
			// 		name: child.data.name,
			// 		subReddit: child.data.subreddit,
			// 	}));
			// 	setPosts(newPosts);
			// 	setLoading(false);
			// } catch (error) {
			// 	setLoading(false);
			// 	console.error("Error fetching posts:", error);
			// }
		}
	};

	useEffect(() => {
		fetchPosts();
	}, [sourceType, sourceName]);

	return (
		<div className="w-full max-w-[396px]">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl pb-4">
					{sourceType === "subreddit" ? "New Posts" : "User Activity"}
				</h1>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={fetchPosts}
				>
					Refresh
				</button>
			</div>
			{loading ? (
				<div className="space-y-3 mt-3">
					<Skeleton className="w-[396px] rounded-lg">
						<div className="h-3 w-[396px] rounded-lg bg-default-200"></div>
					</Skeleton>
					<Skeleton className="w-4/5 rounded-lg">
						<div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
					</Skeleton>
					<Skeleton className="w-2/5 rounded-lg">
						<div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
					</Skeleton>
				</div>
			) : (
				posts.map((post, index) => (
					<div
						key={post.created_utc}
						onClick={() => setSelectedPost({ index, post })}
						className={
							selectedPost?.index === index
								? "mb-2 p-2 max-w-l border-2 border-blue-500 rounded-lg"
								: "mb-2 p-2 max-w-l border-2 border-gray-100/70 rounded-lg"
						}
					>
						<h2>{post.title}</h2>
						<p className="text-gray-400">SubReddit: {post.subreddit}</p>
					</div>
				))
			)}
		</div>
	);
};

export default RedditPost;
