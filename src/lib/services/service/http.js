import { ServiceErrorCode } from "./spec.js"

const SERVICE_ERROR_STATUS = {
  [ServiceErrorCode.INVALID_INPUT]: 400,
  [ServiceErrorCode.NOT_FOUND]: 404,
  [ServiceErrorCode.UNKNOWN_ERROR]: 500,
}

export function getServiceErrorStatus(code) {
  return SERVICE_ERROR_STATUS[code] || 500
}
