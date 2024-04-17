import "server-only";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";

export async function getActiveRoutines() {
  const session = await getServerAuthSession();

  if (!session?.user) throw new Error('Unauthorized');

  const routines = await api.routine.getActive.query();

  return routines
}

export async function getRoutine(id: number) {
  const routine = await api.routine.get.query({ id });

  if (!routine) throw new Error('Routine not found, routine id: ' + id);

  return routine;
}

export async function getLastCompletedRoutine(id: number) {
  const history = await api.routineHistory.getLastCompletedRoutine.query({ id });

  if (!history) throw new Error('Routine history not found, routine id: ' + id);

  return history;
}