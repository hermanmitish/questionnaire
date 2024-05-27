"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { Answers } from "./answers";
import { FormComponent } from "./form";

export default function Home() {
  const [tab, setTab] = useState("form");
  return (
    <>
      <main className="flex min-h-screen items-start justify-center p-4 lg:p-24">
        <Tabs
          defaultValue="form"
          className="w-[350px]"
          value={tab}
          onValueChange={setTab}
        >
          <TabsList className="w-full">
            <TabsTrigger value="form" className="w-full">
              Form
            </TabsTrigger>
            <TabsTrigger value="answers" className="w-full">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="form">
            <FormComponent {...{ tab, setTab }} />
          </TabsContent>
          <TabsContent value="answers">
            <Answers />
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
    </>
  );
}
