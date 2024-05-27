"use client";

import dynamic from "next/dynamic";
const GraphVisual = dynamic(() => import("../graph-visual"), { ssr: false });

export default function Home() {
  return (
    <>
      <GraphVisual />
    </>
  );
}
