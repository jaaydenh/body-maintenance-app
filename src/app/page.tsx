import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {!session && <SignIn />}
      {session && (
        <div className="container flex flex-col items-center gap-12 px-4 py-14">
          <h1 className="font-extrabold tracking-tight sm:text-[5rem] lg:text-xl">
            Today's Program
          </h1>
          <Link
            href={"/routine"}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            Routine
          </Link>
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
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Body <span className="text-[hsl(280,100%,70%)]">Maintenance</span>
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
          <h3 className="text-2xl font-bold">What</h3>
          <div className="text-lg">What is body maintenance.</div>
        </div>
        <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
          <h3 className="text-2xl font-bold">Why</h3>
          <div className="text-lg">Why body maintenance.</div>
        </div>
      </div>
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
