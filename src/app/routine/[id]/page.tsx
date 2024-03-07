import { unstable_noStore as noStore } from "next/cache";
import React from "react";
import { api } from "~/trpc/server";
import ExerciseList from "./exercise-list";
// export const dynamic = "force-dynamic";

export default async function Routine({ params }: { params: { id: string } }) {
  noStore();
  const routine = await api.routine.get.query({ id: Number(params.id) });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {routine?.exercises && <ExerciseList exercises={routine?.exercises} />}
    </main>
  );
}
