'use server'

import { api } from "~/trpc/server";

export async function createRoutines(form: any) {
  console.log('createRountines: ', form)
  await api.routine.create.mutate();
}