import { getLocalKeyWithHost } from "./utils"

export const LOCAL_STORE_KEYS = {
  USER: getLocalKeyWithHost("USER"),
  // ROLES: getLocalKeyWithHost("ROLES"),
}

export const TOKEN_KEY = getLocalKeyWithHost("TOKEN")

const mutateKeys = {
  LOGIN: "LOGIN",
  LOGIN_EMAIL: "LOGIN_EMAIL",
  VALIDATE_EMAIL_ACCESS_CODE: "VALIDATE_EMAIL_ACCESS_CODE",
  SETUP_CREDENTIALS: "SETUP_CREDENTIALS",
  EMPLOYEE: "EMPLOYEE",
  DELETE_EMPLOYEE: "DELETE_EMPLOYEE",
  TASKS: "TASKS",
  DELETE_TASKS: "DELETE_TASKS",
  CONVERSATION: "CONVERSATION",
  MESSAGE: "MESSAGE",
}

const queryKeys = {
  EMPLOYEES: "EMPLOYEES",
  TASKS: "TASKS",
  CONVERSATIONS: "CONVERSATIONS",
  MESSAGES: "MESSAGES",
}
export const QUERY_KEYS = Object.freeze(queryKeys)
export const MUTATE_KEYS = Object.freeze(mutateKeys)
