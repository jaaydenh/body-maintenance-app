'use server'

import { Resend } from "resend";
import { z } from 'zod'
import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

import { type FORM_STATE } from "@/components/CreateTaskMultiStepFormContainer";

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