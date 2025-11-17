import { Suspense } from "react";
import Booking from "../../components/Booking";

export default function PageWrapper() {
  return (
    <Suspense>
      <Booking />
    </Suspense>
  );
}
