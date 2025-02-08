import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

// Define schema for structured output
const responseSchema = z.object({
  summary: z.string().describe("A concise summary of the GitHub repository"),
  cool_facts: z.array(z.string()).describe("Interesting facts about the repository")
});

const parser = StructuredOutputParser.fromZodSchema(responseSchema);

// Update prompt to include format instructions
const prompt = PromptTemplate.fromTemplate(
  `Summarize this github repository from this readme file content.
  {format_instructions}
  README Content: {readme_content}`
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
    });

    // Create chain with structured output
    const chain = prompt.pipe(model).pipe(parser);
    console.log('C. Chain created successfully');
    
    const result = await chain.invoke({
      readme_content: readmeContent,
      format_instructions: parser.getFormatInstructions()
    });
    console.log('D. Chain invocation result:', result);
    
    // Result is already parsed into the correct structure
    return result;
  } catch (error) {
    console.error('F. Error in summarizeReadme:', error);
    throw error;
  }
} 