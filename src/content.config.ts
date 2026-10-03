import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const agents = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/agents" }),
	schema: z.object({
		name: z.string(),
		function: z.string(),
		problem: z.string(),
		solution: z.string(),
		nerve: z.string(),
		cardCopy: z.string(),
		openingFraming: z.string(),
		lockedSubject: z.string(),
	}),
});

export const collections = { agents };
