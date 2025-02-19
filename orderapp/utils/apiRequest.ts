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
    if (error.response && error.response.status === 400) {
      return error.response.data
  
    } else {
      throw new ApiError(error.response.status, error.respons.statusText);
    }
  }
};
