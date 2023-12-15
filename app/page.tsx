"use client";
import UserCard from "@/components/UserCard";
import RedditPost from "@/components/RedditPost";
import { use, useState } from "react";
import AutomateSwitch from "@/components/AutomateSwitch";
import supabase from "@/supabaseClient";
import { useEffect } from "react";
import { Profile } from "@/types/index";

export default function Home() {
	const [selectedPost, setSelectedPost] = useState([] as any);
	const [profiles, setProfiles] = useState([] as any);

	const handleSelectedPost = (post: any) => {
		setSelectedPost(post);
	};

	const fetchData = async () => {
		try {
			let { data, error } = await supabase.from("personas").select("*");
			setProfiles(data as Profile[]);
		} catch (error) {
			console.log(error);
			alert(error);
		}

		// handle data and error
	};
	useEffect(() => {
		fetchData();
	}, []);
	return (
		<section className="w-full flex flex-col md:flex-row items-start justify-center gap-4 py-8 md:py-10">
			<RedditPost
				setSelectedPost={handleSelectedPost}
				selectedPost={selectedPost}
			/>

			<div className="flex gap-3 flex-col w-full max-w-3xl">
				<UserCard selectedPost={selectedPost} profiles={profiles} />
				<AutomateSwitch />
			</div>
		</section>
	);
}
