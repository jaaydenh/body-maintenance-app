"use client";

import { type Session } from "next-auth";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { getServerAuthSession } from "~/server/auth";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}
export async function CSPostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <PostHogProvider client={posthog}>
      {/* <PostHogAuthWrapper session={session}>{children}</PostHogAuthWrapper> */}
      {children}
    </PostHogProvider>
  );
}

// function PostHogAuthWrapper({
//   children,
//   session,
// }: {
//   children: React.ReactNode;
//   session?: Session | null;
// }) {
//   useEffect(() => {
//     if (session?.user) {
//       posthog.identify(session.user.id, {
//         email: session.user.email,
//         name: session.user.name,
//       });
//     } else if (!session?.user) {
//       posthog.reset();
//     }
//   }, [session]);

//   return children;
// }
//
