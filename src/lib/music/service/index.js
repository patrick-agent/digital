import { MusicHandler } from "./handler.js"

const handler = new MusicHandler()

export const listMusicItems = (input) => handler.list(input)
export const getMusicItem = (input) => handler.get(input)
export const createMusicItem = (input) => handler.create(input)
export const updateMusicItem = (input) => handler.update(input)
export const deleteMusicItem = (input) => handler.remove(input)

export { MusicHandler } from "./handler.js"
export * from "./spec.js"
