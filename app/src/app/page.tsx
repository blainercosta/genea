import { LandingPage } from "@/components/screens";
import { AuthRedirect } from "@/components/landing";

/**
 * Home page - Server Component for SEO
 *
 * The landing page content is always rendered server-side for SEO indexing.
 * AuthRedirect handles client-side redirect for logged-in users after hydration.
 */
export default function Home() {
  return (
    <>
      <AuthRedirect />
      <LandingPage />
    </>
  );
}
