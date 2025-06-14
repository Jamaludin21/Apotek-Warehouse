import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";

export default async function Home() {
  const sessionToken = cookies().get("session")?.value;
  const session = sessionToken ? verifySession(sessionToken) : null;

  if (!session) {
    redirect("/auth/login");
  } else redirect("/panel/overview");
}
