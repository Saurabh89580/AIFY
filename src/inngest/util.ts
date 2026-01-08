import { Node,Connection } from "@/generated/prisma";
import toposort from "toposort";
import { inngest } from "./client";
import { createId } from "@paralleldrive/cuid2";

export const topologicalSort=(
    nodes:Node[],
    connections:Connection[],
): Node[]=>{
     //if no connections, return nodes as is
    if(connections.length===0){
        return nodes;
    }  
    // create edges from connections
    const edges: [string, string][] = connections.map((conn) => [
        conn.fromNodeId,
        conn.toNodeId,
    ]);
    //add nodes with no connections as self edgest to ensure they are included
    const ConectedNodeIds=new Set<string>();
    for(const conn of connections){
        ConectedNodeIds.add(conn.fromNodeId);
        ConectedNodeIds.add(conn.toNodeId);
    }
    for (const node of nodes) {
        if (!ConectedNodeIds.has(node.id)) {
            edges.push([node.id, node.id]);
        }
    }
    // perform topological sort
    let sortedNodeIds:string[];
    try {
        sortedNodeIds = toposort(edges);
        //remove duplicate from self edges
        sortedNodeIds = [...new Set(sortedNodeIds)];
    } catch (error) {
        if(error instanceof Error && error.message.includes("Cyclic dependency")){
            throw new Error("Cyclic dependency detected in nodes connections");       
        }
        throw error;
    }
    //map sorted ids back to nodes
    const nodeMap=new Map(nodes.map((n)=>[n.id,n]));
    return sortedNodeIds.map((id)=>nodeMap.get(id)!).filter(Boolean);
};

export const sendWorkflowExecution=async(data: {
    workflowId:string;
    [key:string]: any;
}) =>{
    return inngest.send({
        name:"workflows/execute.workflow",
        data,
        id:createId(),
    })
}