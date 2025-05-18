import { withAuth } from "@/lib/withAuth";
import UsersContent from "./usersContent";

export default function UsersPage() {
  return withAuth((session) => <UsersContent user={session} />);
}
