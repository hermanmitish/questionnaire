import fs from "fs/promises";
import * as neo4j from "neo4j-driver";
export const revalidate = 0;
export async function GET() {
  const uri = process.env.NEO4J_URI;
  const user = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;

  if (!uri || !user || !password) {
    console.error("Missing Neo4j connection settings");
    return new Response("Missing Neo4j connection settings", { status: 500 });
  }

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (u1:User)
      OPTIONAL MATCH (u1)-[r:PERFORMS|UTILIZES|BELONGS_TO]->(x)<-[s:PERFORMS|UTILIZES|BELONGS_TO]-(u2:User)
      WHERE u1 <> u2 OR u2 IS NULL
      RETURN u1, r, x, s, u2`
    );

    const records = result.records.map((record) => ({
      u1: record.get("u1")?.properties,
      r: record.get("r")?.type,
      x: record.get("x")?.properties,
      s: record.get("s")?.type,
      u2: record.get("u2")?.properties,
    }));

    // Save response to the local json file
    fs.writeFile("./data.json", JSON.stringify(records, null, 2));

    return new Response(JSON.stringify(records, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error accessing Neo4j", error);
    return new Response("Error accessing Neo4j", { status: 500 });
  } finally {
    await session.close();
    driver.close();
  }
}
