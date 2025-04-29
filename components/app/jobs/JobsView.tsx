"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Search, FileText, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { JobCard } from "./JobCard";
import { EmptyState } from "../EmptyState";

interface JobsViewProps {
  jobs: JobOffer[];
}

export function JobsView({ jobs }: JobsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  // Filter jobs based on search query
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;

    const query = searchQuery.toLowerCase();
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        (job.company || "").toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        (job.skills || []).some((skill) => skill.toLowerCase().includes(query))
    );
  }, [jobs, searchQuery]);

  // Sort filtered jobs
  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "company":
          return (a.company || "").localeCompare(b.company || "");
        default:
          return 0;
      }
    });
  }, [filteredJobs, sortOption]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Jobs</h1>
            <p className="text-muted-foreground">
              Manage your saved job offers or add new job offers.
            </p>
          </div>
          <Link href="/jobs/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Job
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jobs by title, company, or skills..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value as SortOption)}
            >
              <SelectTrigger className="w-[160px]">
                <ArrowUpDown className="mr-1 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Job Cards or Empty State */}
        {jobs.length === 0 ? (
          <EmptyState text="job offers" button="Add a job offer" />
        ) : sortedJobs.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No matching jobs</h3>
              <p className="text-muted-foreground mb-4">
                No jobs match your search criteria. Try a different search term.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sortedJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
