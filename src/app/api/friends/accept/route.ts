import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { AxiosError } from "axios";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // check if the body object is validated by zod
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) return new Response("Unauthorized", { status: 401 });

    // verify both users are already friends
    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );
    if (isAlreadyFriends)
      return new Response("Already Friends", { status: 400 });

    //check if the currentUser has a friend request, before he can accept
    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFriendRequest)
      return new Response("No friend request", { status: 400 });

    const [userRaw, friendRaw] = (await Promise.all([
      fetchRedis("get", `user:${session.user.id}`),
      fetchRedis("get", `user:${idToAdd}`),
    ])) as [string, string];

    const user = JSON.parse(userRaw) as User;
    const friend = JSON.parse(friendRaw) as User;

    // notify added user

    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${idToAdd}:friends`), "new_friend", user
      ),
      pusherServer.trigger(
        toPusherKey(`user:${session.user.id}:friends`), "new_friend", friend
      ),

      // add new user to currentUser friends list
      db.sadd(`user:${session.user.id}:friends`, idToAdd),

      // add current user to new user friends list
      db.sadd(`user:${idToAdd}:friends`, session.user.id),

      // clean up friend request from current user
      db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd),
    ]);

    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response(error.message || "Invalid request payload", {
        status: 422,
      });

    if (error instanceof AxiosError)
      return new Response(error.response?.data || error.message, {
        status: 422,
      });

    return new Response("Invalid Request", { status: 400 });
  }
}
