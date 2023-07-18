"use client";

import React from "react";
import SignInButton from "@/components/SignInButton";

const LoginPage = () => {

  return (
    <section className="flex_center p-4 lg:p-6 h-full min-h-full">
      <div className="w-full flex flex-col items-center max-w-md space-y-8">
        <div className="flex flex-col items-center gap-8">Logo</div>
        <h2 className="mt-6 text-center text-clampMd font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>

        <SignInButton className="max-w-sm mx-auto w-full" />
      </div>
    </section>
  );
};

export default LoginPage;
