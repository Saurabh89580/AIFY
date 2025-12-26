"use client";

import { EntityContainer, EntityHeader } from '@/components/entity-components';
import { useCreateWorkflow, useSuspenseWorkflows } from '../hooks/use-workflows';
import { create } from 'domain';
import { use } from 'react';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { useRouter } from 'next/navigation';

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();

    return (
        <div className="flex-1 flex justify-center items-center ">
            <p> 
                {JSON.stringify(workflows.data,null,2)}
            </p>
        </div>
    );
};

export const WorkflowsHeader=({disabled}:{disabled?:boolean}) => {
    const createWorkflow=useCreateWorkflow();
    const router=useRouter();
    const {handleError, modal}=useUpgradeModal();

    const handleCreate=()=>{
        createWorkflow.mutate(undefined,{
            onSuccess:(data)=>{
                router.push(`/workflows/${data.id}`);
            },
            onError:(error)=>{
                handleError(error);
            }
        });
    }
    return (
        <>
        {modal}
        <EntityHeader
        title="workflows"
        description="crate and manage your workflows"
        onNew={handleCreate}
        newButtonLabel="Create workflow"
        disabled={disabled} 
        isCreating={createWorkflow.isPending}
        />
        </>
    );
};

export const WorkflowsContainer=({children}:{children: React.ReactNode})=>{
    return (
        <EntityContainer 
        header={<WorkflowsHeader/>} 
        search={<></>}
        pagination={<></>}
        >
            {children}
        </EntityContainer>
    );
}