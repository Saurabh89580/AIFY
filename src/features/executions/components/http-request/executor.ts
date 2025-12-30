import type { NodeExecutor } from "@/features/executions/types"
import { NonRetriableError } from "inngest";
import ky , {type Options as KyOptions} from "ky";

type HttpRequestData={
    endpoint?:string;
    method?:"GET" | "POST" | "PUT" | "PATCH"| "DELETE";
    body?:string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({ 
    data,
    nodeId, 
    context, 
    step 
}) => {

    if(!data.endpoint){
        throw new NonRetriableError(`HTTP Request node ${nodeId} is missing an endpoint`);
    }

    const result=await step.run("http-request",async () => {
        const endpoints=data.endpoint!;
        const method=data.method || "GET";

        const options:KyOptions={method};

        if(["POST","PUT","PATCH"].includes(method) && data.body){
            options.body=data.body;
        }
        const response=await ky(endpoints,options);
        const contentType=response.headers.get("content-type");
        const responseData=contentType?.includes("application/json")
        ? await response.json()
        : await response.text(); 
        return {
            ...context,
            httpRequestExecutor:{
                status:response.status,
                statusText:response.statusText,
                data:responseData,
            }
        }
    });

    return result;
};