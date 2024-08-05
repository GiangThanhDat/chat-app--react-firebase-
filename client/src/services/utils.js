import axiosInstance, { request } from "axios-instance"

export const getRequest = async (url, optional) => {
  return request(axiosInstance.get(`${url}`, optional))
}

export const postRequest = async (url: string, data: unknown, optional) => {
  return request(axiosInstance.post(`${url}`, data, optional))
}

export const createQueryByIdFn = (model) => {
  return async (id) => {
    return request(axiosInstance.get(`/${model}/${id}`))
  }
}

export const createQueryList = (model) => {
  return async (data) => {
    return request(axiosInstance.get(`/${model}`, data))
  }
}

export const createPostMutateFn = (model) => {
  return async (data) => {
    return request(axiosInstance.post(`/${model}/`, data))
  }
}

export const createPutMutateFn = (model) => {
  return async (data) => {
    return request(axiosInstance.put(`/${model}/${data.id}`, data))
  }
}

export const createDeleteMutateFn = (model) => {
  return async (id) => {
    return request(axiosInstance.delete(`/${model}/${id}`))
  }
}
