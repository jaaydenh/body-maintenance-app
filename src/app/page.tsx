import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CircleCheckBig } from "lucide-react";

import Subscribe from "@/components/Subscribe";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

type RoutineHistory = {
  id: bigint;
  routineId: number;
  completedAt: Date;
  difficulty: number;
};

type Routine = {
  id: number;
  name: string;
  duration: number;
  histories: RoutineHistory[] | null;
};

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();
  const routineData: Routine[] | null = session?.user
    ? await api.routine.getActive.query()
    : null;

  if (session?.user && !routineData?.length) {
    redirect("/onboarding");
  }

  const today = new Date();

  return (
    <main className="flex flex-col">
      {!session?.user && <SignIn />}
      {session?.user && (
        <div className="flex flex-col items-center gap-12 py-14">
          <h1 className="font-extrabold tracking-tight sm:text-[2rem] lg:text-xl">
            Today&apos;s Routines
          </h1>
          {routineData?.map((routine) => (
            <Link
              key={routine.id}
              href={`/routine/${routine.id}`}
              className="flex flex-col rounded-md bg-white/10 pt-3 font-semibold no-underline hover:bg-white/20"
            >
              <div className="mb-3 flex min-w-80 flex-row">
                {routine.histories &&
                  routine.histories[0]?.completedAt.setHours(0, 0, 0, 0) ==
                    today.setHours(0, 0, 0, 0) && (
                    <CircleCheckBig className="relative -left-2 -top-5 h-6 w-6 text-green-400" />
                  )}
                <div className="ml-8">{routine.name}</div>
                <div className="ml-auto mr-6">{routine.duration / 60} min</div>
              </div>
              <div className="rounded-b-md bg-stone-500/30 p-1 pl-2 text-xs font-normal">
                {routine.histories?.map((_history, index: number) => (
                  <span
                    key={index}
                    className="top-1/2 mt-1 inline-block h-3 w-3 rounded-full bg-green-400"
                  ></span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

async function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center gap-12 px-8 py-12 text-center">
      <h1 className="text-3xl font-bold leading-none sm:text-[5rem]">
        Maintain your body for longevity
      </h1>
      <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
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
    </div>
  );
}
