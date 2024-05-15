"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Answers } from "./answers";
import { FormComponent } from "./form";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen items-start justify-center p-4 lg:p-24">
        <Tabs defaultValue="form" className="w-[350px]">
          <TabsList className="w-full">
            <TabsTrigger value="form" className="w-full">
              Form
            </TabsTrigger>
            <TabsTrigger value="answers" className="w-full">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="form">
            <FormComponent />
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
