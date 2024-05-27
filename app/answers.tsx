/* eslint-disable react/no-unescaped-entities */
"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GraphVisual from "./graph-visual";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

export function Answers() {
  // Detect if mobile or desktop
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Card className="w-[350px] z-50">
        <CardHeader>
          <CardTitle>Roots of resilience: Answers</CardTitle>
          <CardDescription>
            Here you can see how your answers link you with the other
            respondents based on shared "Actions", "Resources", and
            "Communities". It is the outline of the community that would
            mobilize resources, take actions and create resilience in the times
            of turmoil.
            <Button asChild variant="outline" className=" mt-2">
              <Link href="/graph">Fullscreen</Link>
            </Button>
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="absolute">
        <GraphVisual height={isMobile ? 400 : undefined} />
      </div>
    </main>
  );
}
