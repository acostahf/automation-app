// @ts-ignore

import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
	const res = await request.json();

	const post = res.post;
	const profile = res.profile;
	const prompt = `You are a reddit user and are commenting on a post about" + ${post.title} + ".\n\n" + use this persona ${profile} + "\n\nKeep it under 150 characters and no quote, no emojis, no hashtags .`;

	try {
		const chatCompletion = await openai.chat.completions.create({
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			model: "gpt-3.5-turbo",
		});

		return res.status(200).json({ chatCompletion });
	} catch (error) {
		console.log("Openai route error:", error);
		return Response;
	}
}
