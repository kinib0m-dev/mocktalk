"use client";
import { useState } from "react";

interface ParseJobResult {
  title: string;
  company: string;
  description: string;
  skills: string[];
  responsibilities: string[];
  requirements: string[];
}

interface RateLimitError {
  error: string;
  limit?: number;
  remaining?: number;
  reset?: number;
}

export function useOfferParser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseJobDescription = async (text: string): Promise<ParseJobResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/parse-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData: RateLimitError = await response.json();

        // Format rate limit errors with more helpful information
        if (response.status === 429) {
          const resetTime = errorData.reset
            ? new Date(errorData.reset).toLocaleTimeString()
            : "soon";

          throw new Error(
            `Rate limit exceeded. You can try again at ${resetTime}.`
          );
        }

        throw new Error(errorData.error || "Failed to parse job description");
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);

      // Return an empty structure if parsing fails
      return {
        title: "",
        company: "",
        description: "",
        skills: [],
        responsibilities: [],
        requirements: [],
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    parseJobDescription,
    isLoading,
    error,
  };
}
