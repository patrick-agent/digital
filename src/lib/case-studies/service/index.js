import { CaseStudyHandler } from "./handler.js"

const handler = new CaseStudyHandler()

export const listCaseStudies = (input) => handler.list(input)
export const getCaseStudy = (input) => handler.get(input)
export const createCaseStudy = (input) => handler.create(input)
export const updateCaseStudy = (input) => handler.update(input)
export const deleteCaseStudy = (input) => handler.remove(input)

export { CaseStudyHandler } from "./handler.js"
export * from "./spec.js"
