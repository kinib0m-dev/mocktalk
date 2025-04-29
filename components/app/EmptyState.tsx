import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, FileText } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  text: string;
  button: string;
  disabled?: boolean;
}

export function EmptyState({
  text,
  button,
  disabled = false,
}: EmptyStateProps) {
  return (
    <Card className="p-12 border-dashed">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <FileText className="h-8 w-8 text-primary" />
        </div>

        <h3 className="text-xl font-semibold mb-3">No {text} yet</h3>

        <p className="text-muted-foreground max-w-md mb-8">
          You haven&apos;t added any {text} yet. Add your first job to start
          practicing for interviews and tracking your progress.
        </p>

        <div className="space-y-4">
          <Link href={disabled ? "/jobs" : "/jobs/new"}>
            <Button size="lg" className="px-8">
              <PlusCircle className="mr-2 h-5 w-5" />
              {button}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
