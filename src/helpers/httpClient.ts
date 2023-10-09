import axios, { AxiosResponse, Method } from "axios";

interface RequestConfig {
  method: Method;
  url: string;
  params?: any;
  data?: any;
  headers?: any;
  timeout?: number;
}

export async function makeRequest<T = any>(
  config: RequestConfig
): Promise<AxiosResponse<T>> {
  try {
    const response = await axios({
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.data,
      headers: config.headers,
      timeout: config.timeout,
    });

    return response;
  } catch (error) {
    throw error;
  }
}
