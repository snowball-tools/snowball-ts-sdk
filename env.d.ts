import { NEXT_PUBLIC_APP_VERSION } from "@/helpers/env";
declare namespace NodeJS {
  interface ProcessEnv {
    LIT_RELAY_API_KEY: string;
  }
}
