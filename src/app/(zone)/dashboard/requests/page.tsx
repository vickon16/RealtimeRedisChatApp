import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

const RequestsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  // ids of people who sent current user friend requests
  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis("get", `user:${senderId}`));
      const senderObject = JSON.parse(sender) as User
      return { senderId : senderObject.id, senderEmail: senderObject.email };
    })
  );

  return (
    <section className="p-10 px-4">
      <h1 className="font-bold text-clampBase mb-8">Friend Requests</h1>

      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </section>
  );
};

export default RequestsPage;
