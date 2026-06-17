import { MusicErrorCode } from "./spec.js"

const MUSIC_ERROR_STATUS = {
  [MusicErrorCode.INVALID_INPUT]: 400,
  [MusicErrorCode.NOT_FOUND]: 404,
  [MusicErrorCode.UNKNOWN_ERROR]: 500,
}

export function getMusicErrorStatus(code) {
  return MUSIC_ERROR_STATUS[code] || 500
}
