import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import Cookies from "js-cookie"
import { parseJson } from "./utils"

export const getCookie = (name) => {
  const value = Cookies.get(name)

  return parseJson(value)
}

export const setCookie = (name, value, expirationTime) => {
  const endTimeCookie = dayjs(new Date(1000 * expirationTime))
  dayjs.extend(duration)
  const durationTime = dayjs.duration(endTimeCookie.diff(dayjs()))

  Cookies.set(name, JSON.stringify(value), {
    expires: Math.round(durationTime.asDays()),
  })
}

export const removeCookie = (name) => {
  if (getCookie(name)) Cookies.remove(name)
}
