import { withAuth } from "@/lib/withAuth";
import DashboardContent from "./dashboardContent";

export default function DashboardPage() {
  return withAuth((session) => <DashboardContent user={session} />);
}
