"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { messageSchema } from "@/schemas/messageSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// ✅ Helper: clean and parse Gemini response into separate messages
const parseStringMessages = (messageString: string): string[] => {
  if (!messageString) return [];

  const cleaned = messageString
    .replace(/^Here[\s\S]*?:/i, "") // remove Gemini's intro like "Here are three..."
    .trim();

  if (cleaned.includes("||")) {
    return cleaned
      .split("||")
      .map((msg) => msg.trim())
      .filter(Boolean);
  }

  // fallback: split by numbered lists if Gemini uses "1. ", "2. ", etc.
  return cleaned
    .split(/\d+\.\s+/)
    .map((msg) => msg.trim())
    .filter(Boolean);
};

const Page = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  // ✅ your form setup (unchanged)
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const messageContent = form.watch("content");

  // ✅ Suggest Messages: calls your Gemini backend
  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/suggest-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "" }),
      });

      if (!res.ok) throw new Error("Failed to fetch suggestions");

      const text = await res.text();
      const parsed = parseStringMessages(text);

      if (parsed.length === 0) {
        toast.error("No suggestions returned from Gemini");
      } else {
        setSuggestedMessages(parsed);
      }
    } catch (err) {
      console.error("Suggestion fetch error:", err);
      setError("Failed to load suggestions");
    } finally {
      setIsSuggestLoading(false);
    }
  };

  // ✅ Send message form submission
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-message", {
        username: params.username,
        content: data.content,
      });
      toast.success(`Success: ${response.data.message}`);
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.status === 403) {
        toast.error("This user is not accepting messages right now.");
      } else {
        const errorMSG =
          axiosError.response?.data?.message || "Failed to send message";
        toast.error(errorMSG);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ On-click to fill message from suggestions
  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="w-full flex flex-col justify-center p-5 items-center">
        <h1 className="text-3xl font-bold tracking-tight lg:text-5xl text-center">
          Public Profile Link
        </h1>
      </div>

      {/* ✅ your form (unchanged) */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Send Anonymous message to @{params.username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your anonymous message"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={!messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* ✅ Suggested Messages Section */}
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? "Loading..." : "Suggest Messages"}
          </Button>
          <p>Click on any message below to select it.</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error && <p className="text-red-500">{error}</p>}

            {suggestedMessages.length > 0 ? (
              suggestedMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 text-left"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                Click "Suggest Messages" to get ideas.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
