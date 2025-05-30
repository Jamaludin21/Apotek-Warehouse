import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "./session";

export async function withAuth(renderPage) {
  const sessionToken = cookies().get("session")?.value;
  const session = sessionToken ? verifySession(sessionToken) : null;

  if (!session) {
    return redirect("/auth/login");
  }

  return renderPage(session);
}
