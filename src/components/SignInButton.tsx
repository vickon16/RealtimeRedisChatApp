"use client"

import { useState } from 'react'
import Button from './ui/Button'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import GoogleSvg from '@/data/GoogleSvg'

const SignInButton = ({className} : {className : string}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const signInWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
    } catch(error) {
      toast.error("Error signing into your account")
    }
  }

  return <Button onClick={signInWithGoogle} isLoading={isLoading} className={className}>
    {!isLoading && <GoogleSvg />}
    Sign in
  </Button>
}

export default SignInButton