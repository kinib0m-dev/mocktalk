"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface ResourceCardProps {
  resource?: {
    id: string;
    title: string;
    description: string;
    category: string;
    type: string;
    icon: React.ReactNode;
    url: string;
    isFeatured?: boolean | null;
  };
  featured?: boolean;
  isLoading?: boolean;
}

export function ResourceCard({
  resource,
  featured = false,
  isLoading = false,
}: ResourceCardProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "article":
        return "Article";
      case "video":
        return "Video";
      case "guide":
        return "Guide";
      case "template":
        return "Template";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "article":
        return "bg-blue-100 text-blue-800";
      case "video":
        return "bg-red-100 text-red-800";
      case "guide":
        return "bg-green-100 text-green-800";
      case "template":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/40 transition-all flex flex-col h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
        <CardFooter className="pt-0 mt-auto">
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (!resource) return null;

  return (
    <Card
      className={`overflow-hidden transition-all flex flex-col h-full ${featured ? "border-primary/30 shadow-sm" : "border-border/40 hover:border-primary/30 hover:shadow-sm"}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold flex gap-2 items-center">
            {resource.icon}
            <span className="group-hover:text-primary transition-colors">
              {resource.title}
            </span>
          </CardTitle>
          <Badge className={getTypeColor(resource.type)} variant="outline">
            {getTypeLabel(resource.type)}
          </Badge>
        </div>
        {resource.isFeatured && (
          <Badge className="bg-primary/10 text-primary mt-2 w-fit">
            Featured
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <CardDescription className="text-sm text-muted-foreground">
          {resource.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0 mt-auto">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-full justify-between"
        >
          <Link href={`${resource.url}?id=${resource.id}`}>
            <span>View Resource</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
