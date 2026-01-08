import type { NodeExecutor } from "@/features/executions/types"
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import Handlebars from "handlebars"
import { slackChannel } from "@/inngest/channels/slack";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
    const jsonString= JSON.stringify(context,null,2);
    const safeString=new Handlebars.SafeString(jsonString);

    return safeString;
});

type SlackData={
    variableName?:string;
    webhookUrl?:string;
    content?:string;
};

export const slackExecutor: NodeExecutor<SlackData> = async ({ 
    data,
    nodeId,
    context, 
    step, 
    publish,
}) => {
    await publish(
        slackChannel().status({
            nodeId,
            status: "loading",
        }),
    );

    if (!data.content) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Slack node: Message Content is required");
    }

    const rawContent=Handlebars.compile(data.content)(context);
    const content = decode(rawContent);

    try{
        
        const result= await step.run("Slack-webhook",async ()=>{

            if (!data.webhookUrl) {
                await publish(
                    slackChannel().status({
                        nodeId,
                        status: "error",
                    }),
                );
                throw new NonRetriableError("Slack node: Webhook URL is required");
            }
            await ky.post(data.webhookUrl, {
                json: {
                    text:content,
                }
            });

            if (!data.variableName) {
                await publish(
                    slackChannel().status({
                        nodeId,
                        status: "error",
                    }),
                );
                throw new NonRetriableError("Slack node: Variable name is required");
            }

            return {
                ...context,
                [data.variableName]: {
                    messagecontent: content.slice(0,2000),
                }
            }
        });

         await publish(
            slackChannel().status({
                nodeId,
                status: "success",
            }),
         );
            return result;
    }catch(error){
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            }),
         );
         throw error;
    }
};