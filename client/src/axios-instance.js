import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"
import { TOKEN_KEY } from "lib/const"
import { getCookie } from "lib/cookie"

const axiosInstance = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: "http://localhost:8000",
  timeout: 15000,
  headers: {
    "Accept-Language": "vi-VN",
    "Content-Type": "application/json",
  },
})
console.log(axiosInstance)

/**
 * Axios request interceptor to add an Authorization header with a bearer token.
 *
 * @param config - The Axios request configuration.
 * @returns The modified Axios request configuration.
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.Authorization = `Bearer ${getCookie(TOKEN_KEY)}`
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Axios response interceptor to handle common error cases and redirect to the login page on a 401 status code.
 *
 * @param response - The Axios response.
 * @returns The original Axios response.
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // console.log(error)
    // const { message, response } = error

    // if (status === 401) {
    //   //Add Logic to
    //   //1. Redirect to login page or
    //   //2. Request refresh token
    //   window.location.href = "/sign-in"
    // }

    // // SQL errors
    // if (status === 400) {
    //   return Promise.reject(data.errors)
    // }

    return Promise.reject({ message: error.response.data.message })
  }
)

/**
 * Handles Axios response and resolves the desired data from it.
 *
 * @template T - The type of the expected data in the response.
 * @param asyncService - The Axios response promise.
 * @returns A promise that resolves to the desired data from the response.
 * @throws Error if the response data is missing or if the API returns an error (status code 400).
 */
export const request = async <T>(asyncService): Promise<T> => {
  return asyncService.then((response) => {
    if (!response.data) {
      return Promise.reject({ message: "Request failure" })
    }

    if ("success" in response.data && response.data.success === false) {
      return Promise.reject({ message: response.data.message })
    }

    return response.data
  })
}

export default axiosInstance
