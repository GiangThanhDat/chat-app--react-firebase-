import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseJson = (value) => {
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}

/**
 * Gets a local storage key with the host as a prefix.
 *
 * @param key - The key to prefix with the host.
 * @returns The local storage key with the host prefix.
 */
export const getLocalKeyWithHost = (key) =>
  !window ? key : `${window.location.host}_${key}`
