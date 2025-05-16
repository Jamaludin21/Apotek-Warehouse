import { getSession } from "./auth";
import { redirect } from "next/navigation";

export async function withAuth(renderPage) {
  const session = await getSession();
  if (!session) redirect("/login");
  return renderPage(session);
}
