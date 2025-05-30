import { getSession } from "../../lib/session";
import ClientLayout from "../../components/client/clientLayout";

export default async function PanelLayout({ children }) {
  const session = getSession();

  return <ClientLayout session={session}>{children}</ClientLayout>;
}
