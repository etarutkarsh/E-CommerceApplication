import React, { lazy, Suspense } from "react";
import LandingHeader from "../components/landing/LandingHeader";
import HeroSection from "../components/landing/HeroSection";
const Footer = lazy(() => import("../components/landing/Footer"));
import FullPageLoader from "../components/loaders/FullPageLoader";
const InfiniteProducts = lazy(() =>
  import("../components/landing/InfiniteProducts")
);

export default function LandingPage() {
  return (
    <>
      <LandingHeader />

      <HeroSection />

      <Suspense fallback={<FullPageLoader />}>
        <InfiniteProducts />
      </Suspense>

      <Footer />
    </>
  );
}
