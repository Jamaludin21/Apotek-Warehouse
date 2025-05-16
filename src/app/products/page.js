import { withAuth } from "@/lib/withAuth";
import ProductContent from "./productsContent";

export default function ProductPage() {
  return withAuth((session) => <ProductContent user={session} />);
}
