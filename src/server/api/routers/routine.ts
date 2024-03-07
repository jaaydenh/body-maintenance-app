import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const routineRouter = createTRPCRouter({
  create: protectedProcedure
    // .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx }) => {
      return ctx.db.routine.create({
        data: {
          name: 'Test Routine',
          scheduledAt: '',
          owner: { connect: { id: ctx.session.user.id } },
          exercises: {
            connect: [
              {
                id: 1,
              },
              {
                id: 2,
              },
              {
                id: 3,
              }
            ]
          }
        },
      });
    }),

  getActive: protectedProcedure.query(({ ctx }) => {
    return ctx.db.routine.findMany({
      orderBy: { scheduledAt: "asc" },
      where: { owner: { id: ctx.session.user.id } },
    });
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(({ ctx, input }) => {
      return ctx.db.routine.findUnique({
        where: { id: input.id },
        include: {
          exercises: true
        }
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
