/* eslint-disable react/no-unescaped-entities */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GraphVisual from "./graph-visual";

export function Answers() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Roots of resilience: Answers</CardTitle>
          <CardDescription>
            Here you can see how your answers link you with the other
            respondents based on shared "Actions", "Resources", and
            "Communities". It is the outline of the community that would
            mobilize resources, take actions and create resilience in the times
            of turmoil.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4"></CardContent>
      </Card>
      <GraphVisual />
    </main>
  );
}
