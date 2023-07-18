import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { AxiosError } from "axios";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // check if the body object is validated by zod
    const { id: idToDeny } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });

    // clean up friend request from current user
    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny);

    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response(error.message || "Invalid request payload", { status: 422 });

    if (error instanceof AxiosError)
      return new Response(error.response?.data || error.message, {
        status: 422,
      });

    return new Response("Invalid Request", {status : 400})
  }
}
