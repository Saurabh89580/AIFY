import { useTRPC } from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import { useExecutionsParams } from "./use-executions-params";

//Hook to fetch credentials with suspense

export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionsParams();

  return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
};

//Hook ro fetch a single credential using suspense

export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};