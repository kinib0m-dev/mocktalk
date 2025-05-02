import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function BillingLoader() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Billing & Credits
          </h1>
          <p className="text-muted-foreground">
            Manage your interview credits and purchase history
          </p>
        </div>

        {/* Credits Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="loading">
          <TabsList className="mb-4">
            <TabsTrigger value="loading">Purchase Credits</TabsTrigger>
            <TabsTrigger value="loading2">Payment History</TabsTrigger>
          </TabsList>

          {/* Purchase Credits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <Skeleton className="h-8 w-16 mx-auto mb-1" />
                      <Skeleton className="h-4 w-24 mx-auto" />
                    </div>
                    <div className="space-y-2">
                      {Array(3)
                        .fill(0)
                        .map((_, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 flex-1" />
                          </div>
                        ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
