import { useEffect, useState } from "react";
import { ForceGraph3D } from "react-force-graph";

type Data = {
  u1: { name: string };
  r: string;
  x: { name: string };
  s: string;
  u2: { name: string };
}[];

function getType(action?: string) {
  if (action === "BELONGS_TO") return "Community";
  if (action === "PERFORMS") return "Action";
  if (action === "UTILIZES") return "Resource";
}
export default function GraphVisual() {
  const [graphData, setGraphData] = useState({
    nodes: [] as any[],
    links: [] as any[],
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/result");
      const data: Data = await res.json();
      const nodes = new Map();
      const links: { source: string; target: string; name: string }[] = [];

      console.log(data);
      data.forEach(({ u1, r, x, s, u2 }) => {
        if (!u1) return;
        nodes.set(u1.name, { ...u1, group: "User" });
        if (u2) nodes.set(u2.name, { ...u2, group: "User" });
        if (x) nodes.set(x?.name, { ...x, group: getType(r || s) });

        if (u1 && x && r) {
          links.push({ source: u1?.name, target: x?.name, name: r || "" });
        }
        if (x && u2 && s) {
          links.push({ source: x?.name, target: u2?.name, name: s || "" });
        }
      });

      setGraphData({
        nodes: Array.from(nodes.entries()).map(([id, group]) => ({
          id,
          ...group,
        })),
        links: links,
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <ForceGraph3D
      graphData={graphData}
      nodeLabel="id"
      nodeAutoColorBy="group"
      linkDirectionalParticles="value"
      linkAutoColorBy="name"
      linkLabel="name"
      linkColor="#000000"
    />
  );
}
