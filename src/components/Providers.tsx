"use client"

import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { Toaster } from 'react-hot-toast'

const Providers = ({children} : {children: React.ReactNode} ) => {
  return (
    <SessionProvider>
        {children}
        <Toaster position='top-right' reverseOrder={false} />
    </SessionProvider>
  )
}

export default Providers