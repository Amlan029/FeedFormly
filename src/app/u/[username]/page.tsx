"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { messageSchema } from "@/schemas/messageSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCompletion } from '@ai-sdk/react'

import {
  Form,
  FormControl,
  FormDescription,
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


const specialChar = '||';

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";
const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};



const page = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };
  const messageContent = form.watch("content");
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-message", {
        //code to get username from params
        username: params.username,
        content: data.content,
      });
      toast.success(`Success: ${response.data.message}`);
      form.reset({ ...form.getValues(), content: "" });
      // router.replace("sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

  if (axiosError.response?.status === 403) {
    // graceful handling
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
  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    }
  };
  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="w-full flex  flex-col justify-center p-5 items-center">
        <h1 className="text-3xl font-bold tracking-tight lg:text-5xl text-center">
          Public Profile Link
        </h1>
      </div>
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
                  Send Annonymous message to @{params.username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your annonymous message"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                You can <span>@mention</span> other users and organizations.
              </FormDescription> */}
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
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
