import { unstable_noStore as noStore } from "next/cache";
import React from "react";
import { notFound } from "next/navigation";

import { api } from "~/trpc/server";
import ExerciseList from "./exercise-list";
// export const dynamic = "force-dynamic";

export default async function Routine({ params }: { params: { id: string } }) {
  noStore();
  const routineData = await api.routine.get.query({ id: Number(params.id) });

  if (!routineData) {
    return notFound();
  }

  return (
    <main className="flex flex-col items-center justify-center py-14">
      {routineData.exercises && (
        <ExerciseList exercises={routineData.exercises} />
      )}
    </main>
  );
}
