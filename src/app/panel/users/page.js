import { withAuth } from "@/lib/withAuth";
import UsersContent from "./usersContent";
import prisma from "@/lib/prisma";
import { mappedDataConstructor } from "@/utils/mappedDataHelper";
import { columnUsersConfig } from "@/utils/columnHelper";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const formattedUsers = mappedDataConstructor(users, columnUsersConfig);
  if (!users) return;
  return withAuth((session) => (
    <UsersContent session={session} formattedUsers={formattedUsers} />
  ));
}
