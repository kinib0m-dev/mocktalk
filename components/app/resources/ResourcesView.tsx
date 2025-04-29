// components/app/resources/ResourcesView.tsx
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  BookOpen,
  Video,
  FileText,
  Briefcase,
  Users,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResources } from "@/hooks/use-resources";
import { ResourceCard } from "./ResourcesCard";

// Resource categories
const CATEGORIES = [
  { id: "all", label: "All Resources" },
  { id: "guides", label: "Interview Guides" },
  { id: "questions", label: "Practice Questions" },
  { id: "frameworks", label: "Answer Frameworks" },
  { id: "industry", label: "Industry Specific" },
  { id: "career", label: "Career Development" },
  { id: "templates", label: "Templates" },
];

// Resource types for filtering
const RESOURCE_TYPES = [
  { id: "article", label: "Articles", icon: <FileText className="h-4 w-4" /> },
  { id: "video", label: "Videos", icon: <Video className="h-4 w-4" /> },
  { id: "guide", label: "Guides", icon: <BookOpen className="h-4 w-4" /> },
  {
    id: "template",
    label: "Templates",
    icon: <FileText className="h-4 w-4" />,
  },
];

// Icon mapping
export const getResourceIcon = (iconName: string) => {
  switch (iconName) {
    case "Users":
      return <Users className="h-5 w-5 text-primary" />;
    case "Code":
      return <Code className="h-5 w-5 text-primary" />;
    case "FileText":
      return <FileText className="h-5 w-5 text-primary" />;
    case "Briefcase":
      return <Briefcase className="h-5 w-5 text-primary" />;
    case "Video":
      return <Video className="h-5 w-5 text-primary" />;
    case "BookOpen":
    default:
      return <BookOpen className="h-5 w-5 text-primary" />;
  }
};

export function ResourcesView() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Use the resources hook
  const { getAllResources, getFeaturedResources } = useResources();

  // Fetch all resources
  const { data: allResources, isLoading } = getAllResources();

  // Fetch featured resources separately
  const { data: featuredResources } = getFeaturedResources();

  // Toggle resource type filter
  const toggleResourceType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  // Filter resources on client side
  const filteredResources = useMemo(() => {
    if (!allResources) return [];

    return allResources.filter((resource) => {
      // Filter by category
      if (activeCategory !== "all" && resource.category !== activeCategory) {
        return false;
      }

      // Filter by type
      if (selectedTypes.length > 0 && !selectedTypes.includes(resource.type)) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [allResources, activeCategory, selectedTypes, searchQuery]);

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

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {RESOURCE_TYPES.map((type) => (
              <Button
                key={type.id}
                variant={
                  selectedTypes.includes(type.id) ? "default" : "outline"
                }
                size="sm"
                className="gap-2"
                onClick={() => toggleResourceType(type.id)}
              >
                {type.icon}
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Resources Section */}
        {searchQuery === "" &&
          activeCategory === "all" &&
          selectedTypes.length === 0 &&
          featuredResources &&
          featuredResources.length > 0 && (
            <Card className="mb-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Featured Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={{
                        id: resource.id,
                        title: resource.title,
                        description: resource.description,
                        category: resource.category,
                        type: resource.type,
                        icon: getResourceIcon(resource.iconName),
                        url: resource.url,
                        isFeatured: resource.isFeatured ?? false,
                      }}
                      featured={resource.isFeatured ?? false}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Main Content Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4 flex flex-nowrap overflow-x-auto">
            {CATEGORIES.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="space-y-4"
            >
              {isLoading ? (
                // Loading state
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ResourceCard key={i} isLoading={true} />
                  ))}
                </div>
              ) : filteredResources.length > 0 ? (
                // Resources found
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={{
                        id: resource.id,
                        title: resource.title,
                        description: resource.description,
                        category: resource.category,
                        type: resource.type,
                        icon: getResourceIcon(resource.iconName),
                        url: resource.url,
                        isFeatured: resource.isFeatured ?? false,
                      }}
                      featured={resource.isFeatured ?? false}
                    />
                  ))}
                </div>
              ) : (
                // No resources found
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No resources found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      No resources match your search criteria. Try different
                      search terms or filters.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedTypes([]);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
