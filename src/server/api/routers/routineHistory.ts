import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const routineHistoryRouter = createTRPCRouter({

  setCompleted: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.routineHistory.create({
        data: {
          routineId: input.id,
          difficulty: 0
        }
      })
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(({ ctx, input }) => {
      return ctx.db.routineHistory.findFirst({
        where: {
          routineId: input.id,
        },
        orderBy: {
          completedAt: 'desc'
        }
      });
    }),

});
