import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Search } from "lucide-react";

export function ResourcesLoader() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">
            Explore guides, templates, and tips to enhance your interview skills
            and career development.
          </p>
        </div>

        {/* Search and Filters - Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources..."
              className="pl-8"
              disabled
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-9 w-24" />
              ))}
          </div>
        </div>

        {/* Featured Resources Section - Skeleton */}
        <Card className="mb-2">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-5 w-24 mt-2" />
                    </CardHeader>
                    <CardContent className="pb-2">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs - Skeleton */}
        <Tabs defaultValue="loading">
          <TabsList className="mb-4">
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-10 w-32" />
              ))}
          </TabsList>

          <TabsContent value="loading" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
