"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const formSchema = z.object({
  user: z.string().min(2),
  answer: z.string(),
  ukraine: z.string(),
});

export function FormComponent({
  tab,
  setTab,
}: {
  tab?: string;
  setTab?: (v: string) => void;
}) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      answer: "",
      ukraine: "",
    },
  });
  const [submitting, setSubmitting] = useState(false);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (true) {
      toast({
        title: "We are sorry!",
        description:
          "We are not accepting new answers at the moment. Please, contact us at herman.mitish@gmail.com for more information on this project.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("Submitted: ", values);
    // submit that json to the /api endpoint
    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        toast({
          title: "Thank you!",
          description: "We received your answers and they will be shared soon.",
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: "Something went wrong: " + res.statusText,
          variant: "destructive",
        });
      }
    } catch (e) {
      onFail(e);
    }
    setSubmitting(false);
    setTab?.("answers");
  }
  function onFail(e: any) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(e);
    toast({
      title: "Error",
      description: "Something went wrong: " + e,
      variant: "destructive",
    });
  }
  const disabled = true;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Card className="w-[350px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onFail)}
            className="space-y-4"
          >
            <CardHeader>
              <CardTitle>Roots of resilience: Questionnaire</CardTitle>
              <CardDescription>
                We are no longer accepting new answers at the moment. Please,
                contact us at herman.mitish@gmail.com for more information on
                this project. <br />
                ---
                <br /> Please, share with us and the community your thoughts on
                how could resilience be built. All fields are optional.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your name or pseudonym</FormLabel>
                    <FormControl>
                      <Input {...field} required disabled={disabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Share an experience where you collaborated with others and
                      helped your community in times of turmoil? What was your
                      role?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What did you do? Please, describe in few sentences."
                        rows={8}
                        disabled={disabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="reset"
                variant="outline"
                onClick={() => {
                  form.reset();
                }}
                disabled={submitting || disabled}
              >
                Clear
              </Button>
              <Button type="submit" disabled={submitting || disabled}>
                Send
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
}
