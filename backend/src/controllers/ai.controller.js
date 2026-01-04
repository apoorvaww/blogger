import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const summarize = asyncHandler(async (req, res, next) => {
  try {
    const { content } = req.body;

    const COLLECTION_NAME = "blog_summaries";

    if (!content) {
      throw new ApiError(400, "No content recieved");
    }
    if (content === "") {
      return res
        .status(200)
        .json(
          new ApiResponse(200, "Blog content is empty. Nothing to summarize")
        );
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 100,
      chunkOverlap: 50,
    });

    const chunks = await splitter.createDocuments([content]);

    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINGFACE_API_KEY,
      model: "sentence-transformers/all-MiniLM-L6-v2",
      provider: "hf-inference",
    });

    const vectorDBClient = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });

    await QdrantVectorStore.fromDocuments(chunks, embeddings, {
      vectorDBClient,
      collectionName: COLLECTION_NAME,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        vectorDBClient,
        collectionName: COLLECTION_NAME,
      }
    );

    const retriever = vectorStore.asRetriever({ k: 4 });

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0,
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const prompt = PromptTemplate.fromTemplate(
      `You are a helpful AI assistant whose task is to summarize blog content.
You have been given the full text of a blog post as your primary source of information.

Your goal is to generate a clear, concise, and accurate summary of the blog content.

The length of the summary depends upon the length of the blog content provided. If the blog is about 8 to 10 paragraphs, then provide the summary in about 8 to 10 lines. And if the blog about 5 to 6 paragraphs, provide summary in about 5 to 6 lines. If the blog is about 3 to 4 paragraphs long, provide summary in 3 to 4 lines.

======================
BEHAVIOR RULES
======================

1. **Be a summarizer, not a chatbot**
   - Do NOT simulate a conversation.
   - Do NOT ask questions or use casual chat phrases.
   - Focus only on producing a well-structured summary.

2. **Prioritize the blog content**
   - Use the provided blog text as the main source.
   - Capture the core ideas, arguments, and conclusions from the blog.

3. **Use general knowledge only when necessary**
   - If the blog references a concept without explanation, you may briefly clarify it using general knowledge.
   - Do NOT introduce new opinions or unrelated information.

4. **Clearly distinguish sources**
   - If the summary relies purely on the blog, summarize directly.
   - If clarification is added, explicitly indicate it.
     *Example:* “The blog explains…, and in general, this refers to…”

5. **Be concise and neutral**
   - Avoid marketing language, exaggeration, or personal opinions.
   - Keep the tone factual, clear, and easy to read.

======================
OUTPUT GUIDELINES
======================
- Use short paragraphs or bullet points where appropriate.
- Highlight:
  - Main topic
  - Key points
  - Final takeaway or conclusion
- Do reference the reader, the author, or the act of summarizing.

======================
BLOG CONTENT
======================
{context}
======================
SUMMARY
======================
(Provide a concise, well-structured summary following the rules above.)

        `
    );

    const chain = RunnableSequence.from([
      {
        context: retriever.pipe((docs) =>
          docs.map((doc) => doc.pageContent).join("\n\n")
        ),
      },
      prompt,
      llm,
      new StringOutputParser(),
    ]);

    const query =
      typeof content === "string" ? content : JSON.stringify(content);

    const result = await chain.invoke(query);

    // const result = await chain.invoke({content});

    if (!result) {
      throw new ApiError(400, "Response couldn't be generated.");
    }

    return res.status(200).json(new ApiResponse(200, { result }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiResponse(500, { error: error }));
  }
});

export { summarize };
