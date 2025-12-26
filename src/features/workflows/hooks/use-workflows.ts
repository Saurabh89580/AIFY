import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsparams } from "./use-workflows-params";

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params]=useWorkflowsparams();

    return useSuspenseQuery(trpc.workflow.getMany.queryOptions(params));
    
}

export const useCreateWorkflow = () => {
    const queryClient=useQueryClient();
    const trpc=useTRPC();

    return useMutation(trpc.workflow.create.mutationOptions({
        onSuccess:(data) => {
            toast.success(`Workflow ${data.name} created successfully`);
            queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions({}));
        },
        onError: (error) => {
            toast.error(`Failed to create workflow: ${error.message}`);
        }
    }));
};