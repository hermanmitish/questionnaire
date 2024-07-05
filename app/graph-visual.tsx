import { useEffect, useRef, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
import SpriteText from "three-spritetext";
import { TrackballControls } from "three-stdlib";
import data from "./data.json";

type Data = {
  u1: { name: string };
  r: string;
  x: { name: string };
  s: string;
  u2: { name: string };
}[];

type ExtractRefGenericType<T> = T extends React.MutableRefObject<infer U>
  ? U
  : never;
type GraphForce = ExtractRefGenericType<
  Parameters<typeof ForceGraph3D>["0"]["ref"]
>;

function getType(action?: string) {
  if (action === "BELONGS_TO") return "Community";
  if (action === "PERFORMS") return "Action";
  if (action === "UTILIZES") return "Resource";
}

type DataState = {
  nodes: any[];
  links: any[];
};
export default function GraphVisual({ height }: { height?: number }) {
  const [graphData, setGraphData] = useState<DataState>({
    nodes: [],
    links: [],
  });
  const fgRef = useRef<GraphForce>();

  useEffect(() => {
    let textMap = new Map();
    let angle = 0; // Start angle

    const fetchData = async () => {
      // const res = await fetch("/api/result");
      // const data: Data = await res.json();
      const nodes = new Map();
      const links: { source: string; target: string; name: string }[] = [];

      (data as Data).forEach(({ u1, r, x, s, u2 }) => {
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

      // go through all User type nodes and find the latest one by created_at property. Mark it with latest: true
      const userNodes = Array.from(nodes.entries()).filter(
        ([, node]) => node.group === "User"
      );
      for (const [id, node] of userNodes) {
        const latest = userNodes.every(
          ([, otherNode]) =>
            node === otherNode ||
            new Date(node.created_at) > new Date(otherNode.created_at)
        );
        nodes.set(id, { ...node, latest });
      }
      const newData = {
        nodes: Array.from(nodes.entries()).map(([id, group]) => ({
          id,
          ...group,
        })),
        links: links,
      };

      setGraphData((prev) => {
        if (
          prev.nodes.length === newData.nodes.length &&
          prev.links.length === newData.links.length
        ) {
          console.log("Same data");
          return prev;
        }
        console.log("New data");
        return newData;
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds

    const rotateCamera = () => {
      if (!fgRef.current) return;
      const fg = fgRef.current as GraphForce;
      if (!fg) return;
      const scene = fg.scene();
      const nodeSet = new Set();
      const deleteSet = new Set();
      scene.traverse((node) => {
        const data = (node as any)?.__data;
        if ("geometry" in node && data && data.id) {
          nodeSet.add(data.id);
          if (!textMap.get(data.id)) {
            const sprite = new SpriteText(data.id); // Assuming 'id' is what you want to display
            sprite.color = data.color || "black";
            sprite.textHeight = 8;

            scene.add(sprite); // Add the sprite text to each node
            sprite.position.set(
              node.position.x + 10,
              node.position.y + 10,
              node.position.z + 10
            );
            textMap.set(data.id, sprite);
          } else {
            // just update the position
            const sprite = textMap.get(data.id);
            if (sprite) {
              sprite.position.set(
                node.position.x + 10,
                node.position.y + 10,
                node.position.z + 10
              );
            }
          }
        }
        if ("_text" in node) {
          if (!nodeSet.has(node._text)) {
            const id = node._text;
            deleteSet.add(id);
            console.log("Clearing text", id);
          }
        }
      });

      deleteSet.forEach((id) => {
        const sprite = textMap.get(id);
        if (sprite) {
          scene.remove(sprite);
          textMap.delete(id);
        }
      });

      const distance = 500; // Distance from the center
      const speed = 0.001; // Rotation speed

      const controls = fgRef.current.controls() as TrackballControls; // Get controls instance
      if (!controls) return;

      // Update camera position
      controls.object.position.x = distance * Math.sin(angle);
      controls.object.position.z = distance * Math.cos(angle);
      controls.update(); // Required if controls.enableDamping or controls.autoRotate are set to true

      angle += speed;
      angle %= Math.PI * 2; // Normalize the angle

      requestAnimationFrame(rotateCamera); // Repeat this each frame
    };

    rotateCamera();
    return () => {
      clearInterval(interval);
      textMap.forEach((sprite) => {
        if (sprite.parent) sprite.parent.remove(sprite);
      });
      textMap.clear();
    };
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
      ref={fgRef}
      linkWidth={2}
      nodeRelSize={10}
      nodeOpacity={0.5}
      backgroundColor="black"
      height={height || undefined}
    />
  );
}
