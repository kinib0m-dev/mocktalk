"use client";

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
import { ArrowUpDown, FileText, Search } from "lucide-react";
import { EmptyState } from "../EmptyState";
import { InterviewCard } from "./InterviewCard";
import { useMemo, useState } from "react";

interface InterviewViewProps {
  interviews: ExtendedInterview[];
}

export function InterviewView({ interviews }: InterviewViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [companyFilter, setCompanyFilter] = useState<string>("all");

  // Get unique companies for the filter dropdown
  const companies = useMemo(() => {
    const uniqueCompanies = new Set<string>();

    interviews.forEach((interview) => {
      if (interview.company) {
        uniqueCompanies.add(interview.company);
      }
    });

    return Array.from(uniqueCompanies).sort();
  }, [interviews]);

  // Filter interviews based on search query and company filter
  const filteredInterviews = useMemo(() => {
    let filtered = interviews;

    // Filter by company if not "all"
    if (companyFilter !== "all") {
      filtered = filtered.filter(
        (interview) => interview.company === companyFilter
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (interview) =>
          interview.title.toLowerCase().includes(query) ||
          (interview.company &&
            interview.company.toLowerCase().includes(query)) ||
          (interview.position &&
            interview.position.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [interviews, searchQuery, companyFilter]);

  // Sort filtered interviews
  const sortedInterviews = useMemo(() => {
    return [...filteredInterviews].sort((a, b) => {
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
          // Handle null company values
          const companyA = a.company || "";
          const companyB = b.company || "";
          return companyA.localeCompare(companyB);
        default:
          return 0;
      }
    });
  }, [filteredInterviews, sortOption]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Interviews</h1>
          <p className="text-muted-foreground">
            View and manage your interview practice sessions. To create a new
            interview practice session, click the generate one from a job offer.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search interviews by title, company, or position..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Company Filter */}
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Options */}
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
        {interviews.length === 0 ? (
          <EmptyState
            text="interviews"
            button="Create a new interview"
            disabled={true}
          />
        ) : sortedInterviews.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No matching interviews
              </h3>
              <p className="text-muted-foreground mb-4">
                No interviews match your search criteria. Try a different search
                term or filter.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
                {companyFilter !== "all" && (
                  <Button
                    variant="outline"
                    onClick={() => setCompanyFilter("all")}
                  >
                    Clear Company Filter
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sortedInterviews.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
