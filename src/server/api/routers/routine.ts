import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

const exerciseSchema = z.object({
  id: z.number(),
  index: z.number(),
})

export const routineRouter = createTRPCRouter({
  createInitial: protectedProcedure
    .input(z.object({ name: z.string(), routineLength: z.number().min(5), exercises: z.array(exerciseSchema) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.routine.create({
        data: {
          name: input.name,
          scheduledAt: '2024-02-19T16:25:10.398Z',
          duration: input.routineLength * 60,
          owner: { connect: { id: ctx.session.user.id } },
          exercises: {
            create: input.exercises.map(exercise => ({
              index: exercise.index,
              exercise: {
                connect: {
                  id: exercise.id
                }
              }
            }))
          }
        },
      });
    }),

  getActive: protectedProcedure.query(({ ctx }) => {
    return ctx.db.routine.findMany({
      orderBy: { scheduledAt: "asc" },
      where: { owner: { id: ctx.session.user.id } },
      select: {
        id: true,
        name: true,
        duration: true,
        histories: {
          select: {
            routineId: true,
            completedAt: true,
            difficulty: true,
          },
          orderBy: {
            completedAt: 'desc'
          }
        }
      }
    });
  }),

  getHistory: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(({ ctx, input }) => {
      return ctx.db.routine.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          duration: true,
          histories: true
        }
      });
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(({ ctx, input }) => {
      return ctx.db.routine.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          duration: true,
          exercises: {
            select: {
              index: true,
              exercise: true
            },
            orderBy: {
              index: 'asc'
            }
          }
        }
      });
    }),
});
