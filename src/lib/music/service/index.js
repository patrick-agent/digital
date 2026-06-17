import { MusicHandler } from "./handler.js"

export const musicHandler = new MusicHandler()

export const listMusicItems = (input) => musicHandler.list(input)
export const getMusicItem = (input) => musicHandler.get(input)
export const createMusicItem = (input) => musicHandler.create(input)
export const updateMusicItem = (input) => musicHandler.update(input)
export const deleteMusicItem = (input) => musicHandler.remove(input)

export { MusicHandler } from "./handler.js"
export * from "./http.js"
export * from "./spec.js"
