import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import * as Sentry from "@sentry/nextjs";
import { warn } from "console";

const googleAI = createGoogleGenerativeAI();
const Openai = createOpenAI();
const Anthropic = createAnthropic();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s");
    Sentry.logger.info('User triggered test log', { log_source: 'sentry_test' })
    console.warn("Executing AI Task for event:", event.id);
    console.error("This is a test error log for Sentry integration");
    const { steps: geministeps } = await step.ai.wrap(
      "Generate Text with AI",
      generateText,
      {
        model: googleAI("gemini-2.5-flash"),
        system: "You are a helpful assistant",
        prompt: "what is 2+2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );
    const { steps: openaisteps } = await step.ai.wrap(
      "Generate Text with AI",
      generateText,
      {
        model: Openai("gpt-4-turbo"),
        system: "You are a helpful assistant",
        prompt: "what is 2+2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );
    const { steps: anthropicsteps } = await step.ai.wrap(
      "Generate Text with AI",
      generateText,
      {
        model: Anthropic("claude-2"),
        system: "You are a helpful assistant",
        prompt: "what is 2+2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );
    return { steps: { geministeps, openaisteps, anthropicsteps } };
  }
);
