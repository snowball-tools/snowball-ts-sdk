import { makeRequest } from "./httpClient";
import { Method } from "axios";

export async function validateSnowballAPIKey(apiKey: string): Promise<boolean> {
  const config = {
    method: "GET" as Method,
    url: "https://apikey.snowballtools.xyz/valid_key/",
    
    params: {
      apiKey,
    },
  };

  try {
    const response = await makeRequest(config);
    const { valid } = response.data;
    return (valid as boolean) || false;
  } catch (error) {
    return Promise.reject(error);
  }
}