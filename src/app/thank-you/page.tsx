import { Suspense } from "react";
import ThankYou from "../../components/ThankYou";

export default function PageWrapper() {
  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  );
}
