'use server'

import { api } from "~/trpc/server";

import { type FORM_STATE } from "../_components/CreateTaskMultiStepFormContainer";

const MORNING_MOBILITY = {
  name: 'Morning Mobility', routineLength: 5, exercises: [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    }
  ]
}

const DESK_PREHAB = {
  name: 'Desk Prehab', routineLength: 5, exercises: [
    {
      id: 1,
    },
    {
      id: 2,
    },
  ]
}

const HIP_OPENER = {
  name: 'Hip Opener', routineLength: 5, exercises: [
    {
      id: 4,
    },
    {
      id: 5,
    },
  ]
}

export async function createRoutines(form: typeof FORM_STATE) {
  console.log('createRountines: ', form)
  const routineCount = form.steps.routineCount.value.routineCount;
  if (routineCount === 1) {
    await api.routine.createInitial.mutate(MORNING_MOBILITY)
  }
  if (routineCount === 2) {
    await api.routine.createInitial.mutate(MORNING_MOBILITY)
    await api.routine.createInitial.mutate(DESK_PREHAB)
  }
  if (routineCount >= 3) {
    await api.routine.createInitial.mutate(MORNING_MOBILITY)
    await api.routine.createInitial.mutate(DESK_PREHAB)
    await api.routine.createInitial.mutate(HIP_OPENER)
  }
}