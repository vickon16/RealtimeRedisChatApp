import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
// import { pusherServer } from '@/lib/pusher'
// import { toPusherKey } from '@/lib/utils'
import { Message, messageValidator } from '@/lib/validations/message'
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json()
    const session = await getServerSession(authOptions)

    if (!session) return new Response('Unauthorized', { status: 401 })

    const [userId1, userId2] = chatId.split('--')

    // check if the currentUser is included in one of the chatIds
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response('Unauthorized', { status: 401 })
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1

    // retrieve all the friends of the current user
    const friendList = (await fetchRedis('smembers', `user:${session.user.id}:friends`)) as string[]
    // check if the friendId is included.
    const isFriend = friendList.includes(friendId)

    if(!isFriend) return new Response('Unauthorized', { status: 401 })

    // the currentUser is the sender, we could get his details.
    const rawSender = (await fetchRedis('get',`user:${session.user.id}`))
    const sender = JSON.parse(rawSender) as User

    const timestamp = Date.now()

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      receiverId : friendId,
      text,
      timestamp,
    }

    const message = messageValidator.parse(messageData)

    // notify all connected chat room clients

    // this trigger is for the realtime in direct messages (DM)
    await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming-message', message)

    // this trigger is for pop notification, hence the reason why we need the sender details
    await pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), 'new_message', {
      ...message,
      senderImg: sender.image,
      senderName: sender.name
    })

    // all valid, send the message
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp, // tells redis to sort by timestamp
      member: JSON.stringify(message),
    })

    return new Response('OK', {status : 200})
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}
