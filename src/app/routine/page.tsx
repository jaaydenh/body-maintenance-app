import React from "react";
import { api } from "~/trpc/server";
import ExerciseList from "./exercise-list";

export default async function Routine() {
  const exercises = await api.exercise.getAll.query();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <ExerciseList exercises={exercises} />
    </main>
  );
}
