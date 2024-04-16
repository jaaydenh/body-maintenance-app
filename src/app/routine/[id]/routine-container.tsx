"use client";

import React, { useState } from "react";
import Link from "next/link";

import ExerciseList from "./exercise-list";
import { type Exercise } from "~/app/types";

interface ExerciseListProps {
  id: number;
  name: string;
  exercises: Exercise[];
}

const RoutineContainer: React.FC<ExerciseListProps> = ({
  id,
  name,
  exercises,
}) => {
  const [status, setStatus] = useState("notStarted");

  async function handleStatusChange(nextStatus: string) {
    setStatus(nextStatus);
  }

  return (
    <>
      {status === "completed" && (
        <div className="flex flex-col items-center justify-center">
          <h1 className="mt-20 text-2xl font-bold">You completed {name}!</h1>
          <Link href="/">
            <button className="mt-20 inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50  ">
              Return to routines
            </button>
          </Link>
        </div>
      )}
      {exercises && status !== "completed" && (
        <ExerciseList
          routineId={id}
          exercises={exercises}
          status={status}
          handleStatusChange={handleStatusChange}
        />
      )}
    </>
  );
};

export default RoutineContainer;
