import { EventErrorCode } from "./spec.js"

const EVENT_ERROR_STATUS = {
  [EventErrorCode.INVALID_INPUT]: 400,
  [EventErrorCode.NOT_FOUND]: 404,
  [EventErrorCode.UNKNOWN_ERROR]: 500,
}

export function getEventErrorStatus(code) {
  return EVENT_ERROR_STATUS[code] || 500
}
