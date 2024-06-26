'use server'

import { Resend } from "resend";
import { z } from 'zod'
import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";
import { getLastCompletedRoutine } from "~/server/queries";

import { type FORM_STATE } from "@/components/CreateTaskMultiStepFormContainer";

const MORNING_MOBILITY = {
  name: 'Morning Mobility', routineLength: 5, exercises: [
    {
      id: 6,
      index: 2,
    },
    {
      id: 7,
      index: 1,
    },
    {
      id: 8,
      index: 6,
    },
    {
      id: 11,
      index: 5,
    },
    {
      id: 12,
      index: 3,
    }
  ]
}

const DESK_PREHAB = {
  name: 'Desk Prehab', routineLength: 5, exercises: [
    {
      id: 1,
      index: 1,
    },
    {
      id: 2,
      index: 2,
    },
  ]
}

const HIP_OPENER = {
  name: 'Hip Opener', routineLength: 5, exercises: [
    {
      id: 4,
      index: 1,
    },
    {
      id: 5,
      index: 2,
    },
  ]
}

export async function createRoutines(form: typeof FORM_STATE) {
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

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  email: z.string().email(),
})

export async function createContact(prevState: { message: string }, formData: FormData) {
  const parse = schema.safeParse({
    email: formData.get('email'),
  })

  if (!parse.success) {
    return {
      message: 'Invalid email address'
    }
  }

  try {
    await resend.contacts.create({
      email: parse.data.email,
      unsubscribed: false,
      audienceId: "f0d026be-bc3a-4775-b0a9-2b9a9831adea",
    });

    revalidatePath('/')
    return { message: 'Subscribed Successfully' }
  } catch (error) {
    console.log(error);
    return { message: 'Failed to subscribe' }
  }
}

export async function setRoutineCompleted(id: number) {
  if (typeof id !== 'number') {
    throw new Error();
  }

  const today = new Date();

  const mostRecentRoutine = await getLastCompletedRoutine(id);

  if (
    mostRecentRoutine?.completedAt.setHours(0, 0, 0, 0) !==
    today.setHours(0, 0, 0, 0)
  ) {
    await api.routineHistory.setCompleted.mutate({
      id: Number(id),
    });
  }
}

export async function checkEmailExists(prevState: { message: string, exists: boolean | null }, formData: FormData) {
  const parse = schema.safeParse({
    email: formData.get('email'),
  })

  if (!parse.success) {
    return {
      message: 'Invalid email address',
      exists: null
    }
  }

  try {
    const result = await api.user.get.query({ email: parse.data.email })
    if (result) {
      return { message: '', exists: true }
    } else {
      return { message: '', exists: false }
    }
  } catch (error) {
    console.log(error);
    return { message: 'Failed to check if email exists', exists: null }
  }
}