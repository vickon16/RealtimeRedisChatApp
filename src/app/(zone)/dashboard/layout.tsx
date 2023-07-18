import { Icon, Icons } from '@/components/Icons'
import SignOutButton from '@/components/SignOutButton'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'
import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOption'
import { fetchRedis } from '@/helpers/redis'
import { getFriendsByUserId } from '@/helpers/getFriendsByUserId'
import SidebarChatList from '@/components/SidebarChatList'
import MobileChatLayout from '@/components/MobileChatLayout'
import { SidebarOption } from '@/types/typings'
import Avatar from "@/images/avatar.png";

interface LayoutProps {
  children: ReactNode
}

// Done after the video and optional: add page metadata
export const metadata = {
  title: 'FriendZone | Dashboard',
  description: 'Your dashboard',
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add',
    Icon: 'UserPlus',
  },
]

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user.id)
  console.log('friends', friends)

  const unseenRequestCount = (
    (await fetchRedis(
      'smembers',
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length

  return (
    <section className='w-full flex h-screen'>
      <div className='md:hidden'>
        <MobileChatLayout
          friends={friends}
          session={session}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenRequestCount}
        />
      </div>

      <aside className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white p-4 ">
        <Link href={`/dashboard`} className="flex w-fit shrink-0 items-center">
          <Icons.Logo className="h-8 w-auto text-indigo-500" />
        </Link>

        {friends.length > 0 ? <div className="text-sm font-semibold leading-6 text-gray-400">
          Your Chats
        </div> : null}

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-col gap-y-7">
            {friends.length > 0 ? <li>
              <SidebarChatList friends={friends} sessionId={session.user.id} />
            </li> : null}
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </div>
            </li>
          </ul>

          <ul role="list" className="mt-2 gap-y-1 flex flex-col flex-1">
            {sidebarOptions.map((option) => {
              const Icon = Icons[option.Icon];
              return (
                <li key={option.id}>
                  <Link
                    href={option.href}
                    className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  >
                    <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex_center h-6 w-6 shrink-0 rounded-lg border text-[0.625rem] font-medium bg-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="truncate">{option.name}</span>
                  </Link>
                </li>
              );
            })}

            <li>
              <FriendRequestSidebarOptions sessionId={session?.user.id} initialUnseenRequestCount={unseenRequestCount} />
            </li>

            <li className="mt-auto flex flex-col">
              <div className="flex-1 flex items-center gap-x-3 p-2 text-sm font-semibold leading-6 text-gray-900">
                <div className="relative h-8 w-8 bg-gray-50">
                  <Image
                    src={session?.user?.image || Avatar}
                    alt="Your profile image"
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                  />
                </div>

                <span className="sr-only">Your profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session?.user.name}</span>
                  <span className="text-xs text-zinc-400 font-light" aria-hidden="true">
                    {session?.user.email}
                  </span>
                </div>
              </div>
              <SignOutButton />
            </li>
          </ul>
        </nav>
      </aside>

      <aside className="w-full max-h-screen container py-16 md:py-12">{children}</aside>
    </section>
  )
}

export default Layout
