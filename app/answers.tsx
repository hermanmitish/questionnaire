/* eslint-disable react/no-unescaped-entities */
"use client";

import {
  Card,
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
            respondents in a community based on shared "Actions", "Resources",
            and "Communities".
          </CardDescription>
        </CardHeader>
      </Card>
      <GraphVisual />
    </main>
  );
}
