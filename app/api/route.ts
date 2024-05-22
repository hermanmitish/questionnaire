export async function POST(request: Request) {
  const body = await request.json();
  const url =
    "http://ec2-54-154-175-231.eu-west-1.compute.amazonaws.com:5000/process";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response;
  } catch (e) {
    return new Response("Error", {
      headers: { "content-type": "application/json" },
    });
  }
}
