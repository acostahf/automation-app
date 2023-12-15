import {
	Button,
	ScrollShadow,
	Skeleton,
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import supabase from "@/supabaseClient";
import { type } from "os";

interface RedditPost {
	title: string;
	author: string;
	created_utc: number;
	name: string;
	subreddit: string;
	selftext: string;
	num_comments: number;
}

interface RedditPostProps {
	selectedPost: any;
	setSelectedPost: React.Dispatch<
		React.SetStateAction<{ index: number; post: RedditPost } | null>
	>;
}

type Subreddit = {
	id: number;
	name: string;
};

const RedditPost: React.FC<RedditPostProps> = ({
	selectedPost,
	setSelectedPost,
}) => {
	const [posts, setPosts] = useState<RedditPost[]>([]);
	const [loading, setLoading] = useState(false);
	const [subreddits, setSubreddits] = useState<Subreddit[]>([]);

	const fetchSubreddits = async () => {
		try {
			let { data, error } = await supabase.from("subreddits").select("*");
			setSubreddits(data as any);
		} catch (error) {
			console.log(error);
			alert(error);
		}
	};
	const fetchPosts = async () => {
		setLoading(true);
		setPosts([]);
		let url;

		try {
			const fetchedPosts = await Promise.all(
				subreddits.map(async (subreddit) => {
					const response = await fetch(
						`https://www.reddit.com/r/${subreddit?.name}/new.json?limit=10`
					);
					const data = await response.json();
					return data.data.children.map((child: any) => child.data); // Return an array of posts for each subreddit
				})
			);
			const mergedPosts = fetchedPosts.flatMap((post) => post); // Flatten the array of arrays into a single array
			setPosts(mergedPosts);
			console.log(mergedPosts);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.error("Error fetching posts:", error);
			return;
		}
	};

	useEffect(() => {
		fetchPosts();
	}, [subreddits]);

	useEffect(() => {
		fetchSubreddits();
	}, []);

	return (
		<div className="w-full max-w-lg">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl pb-4">New Posts</h1>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={fetchPosts}
				>
					Refresh
				</button>
			</div>
			{loading ? (
				<div className="space-y-3 mt-3 w-full">
					<Skeleton className="w-full max-w-lg rounded-lg">
						<div className="h-3 w-full max-w-lg rounded-lg bg-default-200"></div>
					</Skeleton>
					<Skeleton className="w-4/5 rounded-lg">
						<div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
					</Skeleton>
					<Skeleton className="w-2/5 rounded-lg">
						<div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
					</Skeleton>
				</div>
			) : (
				<ScrollShadow className="w-full h-screen">
					{posts.map((post, index) => (
						<div
							key={post.created_utc}
							onClick={() => setSelectedPost({ index, post })}
							className={` cursor-pointer
							${
								selectedPost?.index === index
									? "mb-2 p-2 max-w-l bg-blue-500 rounded-lg hover:bg-blue-400"
									: "mb-2 p-2 max-w-l  bg-gray-800 rounded-lg hover:bg-gray-900"
							}
									`}
						>
							<h2>{post.title}</h2>
							<p
								className={
									selectedPost?.index === index
										? "text-white"
										: "text-gray-400"
								}
							>
								SubReddit: {post.subreddit}
							</p>
							<p
								className={
									selectedPost?.index === index
										? "text-white"
										: "text-gray-400"
								}
							>
								Comments: {post.num_comments}
							</p>
							{post.selftext ? (
								<Popover placement="bottom" showArrow={true}>
									<PopoverTrigger>
										<Button>View More</Button>
									</PopoverTrigger>
									<PopoverContent>
										<div className="px-1 py-2 max-w-lg">
											<div className="text-base font-bold">
												{post.title}
											</div>
											<div className="text-small">{post.selftext}</div>
										</div>
									</PopoverContent>
								</Popover>
							) : null}
						</div>
					))}
				</ScrollShadow>
			)}
		</div>
	);
};

export default RedditPost;
