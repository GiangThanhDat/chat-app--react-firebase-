/**
 *  Local store utils
 */

import { parseJson } from "./utils"

export const getLocalStorage = (key) => {
  const value = localStorage.getItem(key)

  return parseJson(value)
}

export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const removeLocalStorage = (key) => {
  if (getLocalStorage(key)) {
    localStorage.removeItem(key)
  }
}
