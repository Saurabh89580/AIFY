import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsparams } from "./use-workflows-params";

//Hook to fetch workflows with suspense

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params]=useWorkflowsparams();

    return useSuspenseQuery(trpc.workflow.getMany.queryOptions(params));
    
}

//Hook to create a new workflow

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

//Hook to remove workflow 

export const useRemoveWorkflow = () => {
    const trpc=useTRPC();
    const queryClient=useQueryClient();


    return useMutation(trpc.workflow.remove.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} removed successfully`);
            queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions({}));
            queryClient.invalidateQueries(trpc.workflow.getOne.queryFilter({id:data.id}));
        }
    })
)
}