import { apiFetch } from "@lib/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, credential } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
      });
    }

    const response = await apiFetch("/api/auth/biometric/authenticate/verify", {
      method: "POST",
      body: JSON.stringify({ userId, credential, deviceId: "web-device" }),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.success) {
      return new Response(
        JSON.stringify({ error: "Biometric verification failed" }),
        {
          status: response.status,
        }
      );
    }
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error verifying biometric authentication:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
