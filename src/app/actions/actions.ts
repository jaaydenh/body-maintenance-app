'use server'

import { api } from "~/trpc/server";

import { type FORM_STATE } from "../_components/CreateTaskMultiStepFormContainer";

export async function createRoutines(form: typeof FORM_STATE) {
  console.log('createRountines: ', form)
  await api.routine.create.mutate();
}