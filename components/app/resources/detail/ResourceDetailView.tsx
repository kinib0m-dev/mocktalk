"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getResourceIcon } from "../ResourcesView";
import { ArrowLeft, Bookmark, BookOpen, Share } from "lucide-react";
import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useState } from "react";
import { useResources } from "@/hooks/use-resources";
import { ResourceCard } from "../ResourcesCard";
import remarkGfm from "remark-gfm";

interface ResourceDetailViewProps {
  resource: any; // Using any for now, but should be properly typed
  tags: string[];
  relatedResources: any[]; // Using any for now, but should be properly typed
}

export function ResourceDetailView({
  resource,
  tags,
  relatedResources,
}: ResourceDetailViewProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { bookmarkResource, removeBookmark } = useResources();

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

  const handleBookmark = () => {
    if (isBookmarked) {
      removeBookmark.mutate({ resourceId: resource.id });
      setIsBookmarked(false);
      toast.success("Removed from bookmarks");
    } else {
      bookmarkResource.mutate({ resourceId: resource.id });
      setIsBookmarked(true);
      toast.success("Added to bookmarks");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      {/* Back navigation */}
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/resources">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </Link>
      </Button>

      {/* Resource header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge className={getTypeColor(resource.type)}>
            {getTypeLabel(resource.type)}
          </Badge>
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Main content card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {getResourceIcon(resource.iconName)}
              <span className="font-medium">{resource.title}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleBookmark}>
                <Bookmark
                  className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-primary" : ""}`}
                />
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {resource.content || ""}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Related resources section */}
      {relatedResources && relatedResources.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Related Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedResources.map((related) => (
              <ResourceCard
                key={related.id}
                resource={{
                  ...related,
                  icon: getResourceIcon(related.iconName),
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
