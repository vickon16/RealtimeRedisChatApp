"use client";

import { ButtonHTMLAttributes, FC, useState } from "react";
import Button from "./ui/Button";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{}

const SignOutButton : FC<SignOutButtonProps> = ({className}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signOutWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      toast.error("Error signing out")
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <Button onClick={signOutWithGoogle} isLoading={isLoading} variant="ghost" className={className}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;
