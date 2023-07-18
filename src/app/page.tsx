import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { useRouter, redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect("/dashboard");
  } else {
    return redirect("/login")
  }
}
