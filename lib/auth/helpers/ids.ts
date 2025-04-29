import { db } from "@/db";
import { interviews, jobDescriptions, resources } from "@/db/schema";

// Function to fetch all interview IDs
export const getAllInterviewIds = async (): Promise<string[]> => {
  const interviewResults = await db
    .select({ id: interviews.id })
    .from(interviews);
  return interviewResults.map((interview) => interview.id);
};

// Function to fetch all job IDs
export const getAllJobIds = async (): Promise<string[]> => {
  const jobResults = await db
    .select({ id: jobDescriptions.id })
    .from(jobDescriptions);
  return jobResults.map((job) => job.id);
};

// Function to fetch all resource slugs (URLs in this case)
export const getAllResourceSlugs = async (): Promise<string[]> => {
  const resourceResults = await db
    .select({ url: resources.url })
    .from(resources);
  return resourceResults.map((resource) => resource.url);
};
