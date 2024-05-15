"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Answers() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Roots of resilience: Answers</CardTitle>
          <CardDescription>
            Here you can see the answers to the questionnaire.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4"></CardContent>
      </Card>
    </main>
  );
}
