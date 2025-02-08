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

export async function summarizeReadme(readmeContent: string, openAiKey: string) {
  console.log('A. Starting summarizeReadme');
  console.log('B. OpenAI API Key exists:', !!openAiKey);
  
  try {
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0,
      maxTokens: 500,
      openAIApiKey: openAiKey
    }).bind({
      functions: [functionSchema],
      function_call: { name: "summarize_repo" }
    });

    const chain = prompt.pipe(model);
    console.log('C. Chain created successfully');
    
    const result = await chain.invoke({
      readme_content: readmeContent
    });
    console.log('D. Chain invocation result:', result);
    
    // Parse the function call arguments to get structured output
    if (!result.additional_kwargs.function_call) {
      throw new Error('Failed to get function call result');
    }

    // Extract just the parsed response
    const parsedResponse = JSON.parse(result.additional_kwargs.function_call.arguments);
    console.log('E. Parsed response:', parsedResponse);
    
    return parsedResponse;
  } catch (error) {
    console.error('F. Error in summarizeReadme:', error);
    throw error;
  }
} 