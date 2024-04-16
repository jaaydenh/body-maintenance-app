import { postRouter } from "~/server/api/routers/post";
import { exerciseRouter } from "~/server/api/routers/exercise";
import { routineRouter } from "~/server/api/routers/routine";
import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { routineHistoryRouter } from "./routers/routineHistory";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    post: postRouter,
    exercise: exerciseRouter,
    routine: routineRouter,
    user: userRouter,
    routineHistory: routineHistoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
