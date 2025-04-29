import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Search, Filter, ArrowUpDown } from "lucide-react";
import Link from "next/link";

export function JobViewLoader() {
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
          <Link href="/dashboard/jobs/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Job
            </Button>
          </Link>
        </div>

        {/* Filters and Search (disabled but visible) */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jobs by title, company, or skills..."
              className="pl-8"
              disabled
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="w-[130px]" disabled>
              <Filter className="mr-2 h-4 w-4" />
              <span>Status</span>
            </Button>
            <Button variant="outline" className="w-[160px]" disabled>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <span>Sort by</span>
            </Button>
          </div>
        </div>

        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 gap-4">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-[250px]" />
                      <Skeleton className="h-4 w-[180px]" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-18 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Skeleton className="h-5 w-[140px]" />
                      <Skeleton className="h-5 w-[100px]" />
                      <Skeleton className="h-5 w-[160px]" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Skeleton className="h-5 w-[120px]" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-[100px]" />
                    <Skeleton className="h-9 w-[100px]" />
                  </div>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
