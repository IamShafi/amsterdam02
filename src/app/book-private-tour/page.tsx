import { Suspense } from "react";
import BookPrivateTour from "../../components/BookPrivateTour";

export default function PageWrapper() {
  return (
    <Suspense>
      <BookPrivateTour />
    </Suspense>
  );
}
