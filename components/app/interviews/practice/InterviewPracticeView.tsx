"use client";

import { vapi } from "@/lib/utils/vapi.sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, Phone, PhoneOff, LoaderCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  createFeedback,
  interviewer,
} from "@/lib/interviews/interview.actions";

// Call status enum
enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

// Message type
interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

// Props type
interface InterviewPracticeProps {
  interview: ExtendedInterview;
  questions: InterviewQuestion[];
}

export function InterviewPracticeView({
  interview,
  questions,
}: InterviewPracticeProps) {
  const router = useRouter();

  // State management
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Auto-scroll reference with proper typing
  const messagesEndRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      node.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Memoize the handleGenerateFeedback function with useCallback
  const handleGenerateFeedback = useCallback(
    async (messages: SavedMessage[]) => {
      try {
        if (!interview.id) {
          router.push("/");
          return;
        }

        setLoading(true);

        const { success, feedbackId } = await createFeedback({
          interviewId: interview.id,
          transcript: messages,
          questions: questions,
        });

        if (success && feedbackId) {
          console.log("Feedback generated successfully");
          router.push(`/interviews/${interview.id}/feedback`);
        } else {
          console.error("Error generating feedback");
          router.push("/");
        }
      } catch (error) {
        console.error("Error in handleGenerateFeedback:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    },
    [interview.id, router, questions]
  );

  // Set up event listeners for the call
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => console.log("Error: ", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  // Generate feedback when the call is finished
  useEffect(() => {
    if (callStatus === CallStatus.FINISHED && messages.length > 0) {
      console.log("Call finished, generating feedback");

      const timer = setTimeout(() => {
        handleGenerateFeedback(messages);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [callStatus, messages, handleGenerateFeedback]);

  // Start the interview call
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    let formattedQuestions = "";
    if (interview && questions) {
      const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

      formattedQuestions = sortedQuestions
        .map(
          (q, index) =>
            `${index + 1}. [${q.type.toUpperCase().replace("_", " ")}] ${q.content}`
        )
        .join("\n");
    }

    await vapi.start(interviewer, {
      variableValues: {
        questions: formattedQuestions,
        interviewTitle: interview.title,
        companyName: interview.company,
        position: interview.position,
      },
    });
  };

  // Manually end the call
  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  // Get status label and color
  const getStatusInfo = () => {
    switch (callStatus) {
      case CallStatus.INACTIVE:
        return {
          label: "Ready to start",
          color: "bg-slate-100 text-slate-800",
        };
      case CallStatus.CONNECTING:
        return { label: "Connecting...", color: "bg-amber-100 text-amber-800" };
      case CallStatus.ACTIVE:
        return {
          label: isSpeaking ? "Interviewer speaking" : "Interview in progress",
          color: "bg-green-100 text-green-800",
        };
      case CallStatus.FINISHED:
        return {
          label: loading ? "Generating feedback..." : "Interview completed",
          color: "bg-blue-100 text-blue-800",
        };
      default:
        return { label: "Unknown", color: "bg-slate-100 text-slate-800" };
    }
  };

  const statusInfo = getStatusInfo();
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Interview header */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {interview.title}
              </CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-sm">
                  {interview.company}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {interview.position}
                </Badge>
                <Badge className={cn("text-sm", statusInfo.color)}>
                  {statusInfo.label}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Interview conversation */}
      <Card className="mb-6 border-2">
        <CardContent className="p-0">
          {messages.length > 0 ? (
            <ScrollArea className="h-[400px] p-4">
              <div className="flex flex-col gap-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3 p-3 rounded-lg",
                      message.role === "assistant"
                        ? "bg-slate-100"
                        : "bg-primary/10 ml-auto"
                    )}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/images/interviewer-avatar.png"
                          alt="Interviewer"
                        />
                        <AvatarFallback>IR</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "prose prose-sm max-w-none",
                        message.role === "assistant"
                          ? "text-slate-800"
                          : "text-slate-700"
                      )}
                    >
                      {message.content}
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/images/user-avatar.png" alt="You" />
                        <AvatarFallback>YOU</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div className="mb-4">
                <Phone className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-medium text-slate-700 mb-2">
                  Ready to start your interview
                </h3>
                <p className="max-w-md mx-auto">
                  Click the &quot;Start Interview&quot; button below to begin
                  your practice interview for {interview.position} at{" "}
                  {interview.company}.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t p-4 flex justify-center">
          {callStatus !== CallStatus.ACTIVE ? (
            <Button
              size="lg"
              onClick={handleCall}
              disabled={
                callStatus === CallStatus.CONNECTING ||
                (callStatus === CallStatus.FINISHED && loading)
              }
              className={cn(
                "w-60 font-medium",
                callStatus === CallStatus.CONNECTING && "opacity-80"
              )}
            >
              {callStatus === CallStatus.CONNECTING ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : callStatus === CallStatus.FINISHED && loading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Generating Feedback...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Interview
                </>
              )}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="destructive"
              onClick={handleDisconnect}
              className="w-60 font-medium"
            >
              <PhoneOff className="mr-2 h-4 w-4" />
              End Interview
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Question list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-medium">
            Interview Questions ({questions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {questions
              .sort((a, b) => a.order - b.order)
              .map((question, index) => (
                <div key={question.id} className="p-3 rounded-md border">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {question.type.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      Question {index + 1}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{question.content}</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
