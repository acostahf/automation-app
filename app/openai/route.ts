import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
	const res = await request.json();

	const post = res.post;
	const profile = res.profile;
	const prompt = `I need you to comment on Reddit post. You should act as you are me the user. Here is the post." + ${post.title} + ${post?.selftext} + ".\n\n" + use this persona ${profile} + "\n\nKeep it under 150 characters and no quote, no emojis, no hashtags .`;

	try {
		const chatCompletion = await openai.chat.completions.create({
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			model: "gpt-4",
		});
		// @ts-ignore
		return Response.json({ chatCompletion });
	} catch (error) {
		console.log("Openai route error:", error);
		return Response;
	}
}
