import { inngest } from '@/inngest/client';
import { createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { TRPCError } from '@trpc/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const appRouter = createTRPCRouter({
  testAI: protectedProcedure.mutation(async () => {
    // throw new TRPCError({code:"BAD_REQUEST", message:"something went wrong"});
    await inngest.send({
      name: 'execute/ai',
    });
    return { success: true, message: "Event Sent" };
  }),
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "sur@getMaxListeners.com",
      },
    });
    return { success: true, message: "Event Sent" };
  }),
});
export type AppRouter = typeof appRouter;