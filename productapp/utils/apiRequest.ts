import axios, { Method, AxiosRequestConfig } from "axios";
import ApiError from "./ApiError";

interface IApiResponse<T> {
  data: T;
  status: number;
}

export const apiRequest = async <T>(
  method: Method,
  url: string,
  token?: string,
  params?: Record<string, string>,
  body?: Record<string, any>
): Promise<IApiResponse<T>> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      headers: {
        Authorization: token ? `Bearer ${token}` : " ",
      },
      params,
      data: body,
    };
    const response = await axios(config);
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    console.error("API resonse Error:", error.response?.data || error.message);
    throw new ApiError(
      error.response?.data?.message || "API request failed",
      error.response?.status || 500
    );
  }
};
