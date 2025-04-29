import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { jobParserSchema } from "@/lib/utils/zodSchemas";
import { gemini } from "@/lib/utils/google";
import { parserOfferRatelimit } from "@/lib/utils/ratelimit";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    // Security: Verify content type
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content type must be application/json" },
        { status: 415 }
      );
    }

    // Get IP for rate limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

    // Apply rate limiting
    const { success, limit, reset, remaining } =
      await parserOfferRatelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          error: "Too many requests",
          limit,
          remaining: 0,
          reset,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Parse and validate the request body
    const body = await req.json();
    const { text } = body;

    // Validate required parameters
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text parameter is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate text length to prevent abuse
    if (text.length > 10000) {
      return NextResponse.json(
        { error: "Text is too long. Maximum length is 10000 characters." },
        { status: 400 }
      );
    }

    // Process the job description parsing
    const { object: parsedResult } = await generateObject({
      model: gemini("gemini-1.5-flash-001"),
      schema: jobParserSchema,
      temperature: 0.1,
      maxTokens: 800,
      messages: [
        {
          role: "system",
          content:
            "You're a helpful assistant that extracts structured information from job descriptions.",
        },
        {
          role: "user",
          content: `Extract the job title, company name, a 1–2 sentence description, required skills, responsibilities, and requirements from the following job description. Respond as a JSON object.\n\n${text}`,
        },
      ],
    });

    // Return successful response with rate limit headers
    return NextResponse.json(
      { result: parsedResult },
      {
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Error parsing job offer:", error);
    return NextResponse.json(
      { error: "Failed to parse job offer" },
      { status: 500 }
    );
  }
}
