"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useOfferParser } from "@/hooks/use-offer-parser";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clipboard,
  Loader2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { NewJobForm } from "./NewJobForm";

export function NewJobView() {
  const [activeTab, setActiveTab] = useState("paste");
  const [isProcessed, setIsProcessed] = useState(false);
  const [rawJobOffer, setRawJobOffer] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Hook with the API Call
  const {
    parseJobDescription,
    isLoading: isProcessing,
    error: parsingError,
  } = useOfferParser();

  // Initial form values
  const initialFormValues: JobFormValues = {
    title: "",
    company: "",
    description: "",
    skills: [],
    responsibilities: [],
    requirements: [],
    sourceUrl: "",
    rawContent: "",
  };

  // Parsed job data state
  const [parsedJobData, setParsedJobData] =
    useState<JobFormValues>(initialFormValues);

  // Use effect to handle errors from the parsing hook
  useEffect(() => {
    if (parsingError) {
      setError(parsingError);
    }
  }, [parsingError]);

  const handleProcessJobOffer = async () => {
    if (!rawJobOffer.trim()) {
      setError("Please paste a job description first");
      return;
    }

    setError(null);

    try {
      // Use the custom hook to parse the job description
      const parsedData = await parseJobDescription(rawJobOffer);

      // Update parsed job data
      const formattedData = {
        ...initialFormValues,
        ...parsedData,
        rawContent: rawJobOffer,
      };

      setParsedJobData(formattedData);
      setIsProcessed(true);
      setActiveTab("edit");
    } catch (err) {
      console.error("Error processing job description:", err);

      // Error is now handled by the useEffect watching parsingError

      // In case of error, enable manual editing anyway with the raw content
      setParsedJobData({
        ...initialFormValues,
        rawContent: rawJobOffer,
      });
      setIsProcessed(true);
      setActiveTab("edit");
    }
  };

  // Handle the paste functionality
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRawJobOffer(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  // Determine if the error is related to rate limiting
  const isRateLimitError = error?.includes("Rate limit exceeded");

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/jobs">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Job</h1>
            <p className="text-muted-foreground">
              Paste a job offer to create a new job.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            {isRateLimitError ? (
              <Clock className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{isRateLimitError ? "Rate Limit" : "Error"}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste" disabled={isProcessed}>
              Paste Job Offer
            </TabsTrigger>
            <TabsTrigger
              value="edit"
              disabled={!isProcessed && activeTab === "paste"}
            >
              Edit Details
            </TabsTrigger>
          </TabsList>

          {/* Paste Job Offer Tab */}
          <TabsContent value="paste">
            <Card>
              <CardHeader>
                <CardTitle>Paste Job Offer</CardTitle>
                <CardDescription>
                  Paste a job offer from LinkedIn or another job board to
                  automatically extract key information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Paste job offer here..."
                    className="min-h-[300px]"
                    value={rawJobOffer}
                    onChange={(e) => setRawJobOffer(e.target.value)}
                    disabled={isProcessing}
                  />

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={handlePasteFromClipboard}
                      className="flex items-center gap-2"
                      disabled={isProcessing}
                    >
                      <Clipboard className="h-4 w-4" />
                      Paste from Clipboard
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setRawJobOffer("")}
                  disabled={isProcessing}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleProcessJobOffer}
                  disabled={
                    !rawJobOffer.trim() || isProcessing || isRateLimitError
                  }
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isProcessed ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Processed
                    </>
                  ) : (
                    "Process Job Offer"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Edit Details Tab */}
          <TabsContent value="edit">
            <NewJobForm
              initialData={parsedJobData}
              onBackClick={() => setActiveTab("paste")}
              rawJobOffer={rawJobOffer}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
