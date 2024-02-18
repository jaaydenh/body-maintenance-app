// import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

export const exerciseRouter = createTRPCRouter({

    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.db.exercise.findMany({
            orderBy: { id: "asc" },
        });
    }),

    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
});
