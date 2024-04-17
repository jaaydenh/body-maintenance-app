import { unstable_noStore as noStore } from "next/cache";
import React from "react";
import { notFound } from "next/navigation";

import RoutineContainer from "./routine-container";
import { type RoutineExercise } from "~/app/types";
import { getRoutine } from "~/server/queries";
// export const dynamic = "force-dynamic";

type Routine = {
  id: number;
  name: string;
  duration: number;
  exercises: RoutineExercise[];
};

export default async function Routine({ params }: { params: { id: string } }) {
  noStore();
  const routineData: Routine = await getRoutine(Number(params.id));

  const exercises = routineData?.exercises.map((exercise) => exercise.exercise);

  if (!routineData) {
    return notFound();
  }

  return (
    <main className="flex flex-col items-center justify-center py-6">
      {exercises && (
        <RoutineContainer
          exercises={exercises}
          name={routineData.name}
          id={routineData.id}
        />
      )}
    </main>
  );
}
