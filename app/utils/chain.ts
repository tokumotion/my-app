import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Define schema for structured output
const responseSchema = z.object({
  summary: z.string().describe("A concise summary of the GitHub repository"),
  cool_facts: z.array(z.string()).describe("Interesting facts about the repository")
});

const functionSchema = {
  name: "summarize_repo",
  description: "Summarizes a GitHub repository from its README content",
  parameters: zodToJsonSchema(responseSchema)
};

const prompt = PromptTemplate.fromTemplate(
  `Summarize this github repository from this readme file content:
  {readme_content}`
);

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  maxTokens: 500
});

export async function summarizeReadme(readmeContent: string) {
  console.log('A. Starting summarizeReadme');
  console.log('B. OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
  
  try {
    const chain = prompt.pipe(model);
    console.log('C. Chain created successfully');
    
    const result = await chain.invoke({
      readme_content: readmeContent
    });
    console.log('D. Chain invocation result:', result);
    
    return result;
  } catch (error) {
    console.error('E. Error in summarizeReadme:', error);
    throw error;
  }
} 