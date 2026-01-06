import { createLoader } from "nuqs/server";
import { credentialsParams } from "@/features/credentials/params";

export const CredentialsParamsLoader = createLoader(credentialsParams);