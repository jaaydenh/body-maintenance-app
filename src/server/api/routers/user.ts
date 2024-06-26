import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { email: input.email },
      });
    }),

});
