import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
	const res = await request.json();

	const post = res.post;
	const profile = res.profile;
	console.log("OpenAI Endpoint Hit:", post.title, profile);

	try {
		// const response = await fetch(
		// 	"https://api.openai.com/v1/chat/completions",
		// 	{
		// 		method: "POST",
		// 		headers: {
		// 			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		// 			"Content-Type": "application/json",
		// 		},
		// 		body: JSON.stringify({
		// 			prompt:
		// 				"You are a reddit user and are commenting on a post about" +
		// 				post.title +
		// 				".\n\n" +
		// 				profile.prompt +
		// 				"\n\nKeep it under 150 characters and no quotes.",
		// 			max_tokens: 150,
		// 		}),
		// 	}
		// );

		// const data = await response.json();
		// console.log(data);
		const chatCompletion = await openai.chat.completions.create({
			messages: [
				{
					role: "user",
					content: `You are a reddit user and are commenting on a post about" + ${post.title} + ".\n\n" + ${profile.prompt} + "\n\nKeep it under 150 characters and no quotes.`,
				},
			],
			model: "gpt-3.5-turbo",
		});

		return Response.json({ chatCompletion });
	} catch (error) {
		console.log(error);
		return Response;
	}
}
