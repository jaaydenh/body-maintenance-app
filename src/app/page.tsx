import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

import Header from "./_components/Header";
import Subscribe from "./_components/Subscribe";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();
  const routines = session?.user ? await api.routine.getActive.query() : null;

  if (session?.user && !routines?.length) {
    redirect("/onboarding");
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <Header />
      {!session?.user && <SignIn />}
      {session?.user && (
        <div className="container flex flex-col items-center gap-12 px-4 py-14">
          <h1 className="font-extrabold tracking-tight sm:text-[2rem] lg:text-xl">
            Today&apos;s Routines
          </h1>
          {routines?.map((routine) => (
            <Link
              key={routine.id}
              href={`/routine/${routine.id}`}
              className="rounded-md bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {routine.name} -{" "}
              {routine.scheduledAt.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}{" "}
              - {routine.duration / 60} min
            </Link>
          ))}
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            {session ? "Sign out" : "Sign in"}
          </Link>
        </div>
      )}
    </main>
  );
}

async function SignIn() {
  const session = await getServerAuthSession();
  return (
    <div className="mx container mx-auto flex flex-col items-center justify-center gap-12 px-8 py-12 text-center">
      <h1 className="text-3xl font-bold leading-none sm:text-[5rem]">
        Maintain your body for longevity
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
          <p className="text-lg">
            AI enhanced personalization that uses your feedback to optimize
            mobility, stability and strength
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
          <p className="text-lg">
            Rebuild and maintain your body sustainably and live pain free for
            your entire life
          </p>
        </div>
      </div>
      <Subscribe />
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-white">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            {session ? "Sign out" : "Sign in"}
          </Link>
        </div>
      </div>
    </div>
  );
}
