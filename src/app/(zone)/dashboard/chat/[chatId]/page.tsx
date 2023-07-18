import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { Message, messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { FC } from "react";
import Avatar from "@/images/avatar.png"

interface PageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    // fetch a set range of messages from start to end
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const dbMessages = results.map((message) => JSON.parse(message) as Message);
    const reveredDbMessages = dbMessages.reverse();
    const messages = messageArrayValidator.parse(reveredDbMessages);

    return messages;
  } catch (error) {
    notFound();
  }
}

const ChatIdPage: FC<PageProps> = async ({ params: { chatId } }) => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const currentUser = session.user;

  const [userId1, userId2] = chatId.split("--");

  // current user should only view this chat if one of the id's is theirs
  if (currentUser.id !== userId1 && currentUser.id !== userId2)
    return notFound();

  // determine the other chat partner's id;
  const chatPartnerId = currentUser.id === userId1 ? userId2 : userId1;

  // get the email of the chat partner;
  const chatPartnerResult = await fetchRedis("get", `user:${chatPartnerId}`);
  const chatPartner: User = JSON.parse(chatPartnerResult);

  const initialMessages = await getChatMessages(chatId);

  return (
    <section className="flex-1 flex justify-between flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between p-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative w-8 sm:w-12 h-8 sm:h-12">
            <Image
              fill
              referrerPolicy="no-referrer"
              src={chatPartner.image}
              alt={`${chatPartner.name} profile picture`}
              className="rounded-full"
            />
          </div>

          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </div>

            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages
        initialMessages={initialMessages}
        sessionId={session.user.id}
        sessionImg={session.user.image || Avatar}
        chatPartner={chatPartner}
        chatId={chatId}
      />

      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </section>
  );
};

export default ChatIdPage;

// http://localhost:3000/dashboard/chat/5df19b90-5299-4e6a-b090-12b38beba54d--d7d31b7f-2509-4a51-9034-310ee2182e62
