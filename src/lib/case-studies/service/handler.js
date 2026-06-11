import { readCaseStudies, readCaseStudy, createCaseStudy, updateCaseStudy, deleteCaseStudy } from "../../db/case-studies.js"
import {
  CreateCaseStudyInputSchema, UpdateCaseStudyInputSchema,
  ListCaseStudyInputSchema, LookupCaseStudyInputSchema,
  CaseStudyErrorCode,
} from "./spec.js"
import { createFailure, safeCatch } from "../../contract/base.js"

export class CaseStudyHandler {
  async list(input) {
    try {
      const filters = ListCaseStudyInputSchema.parse(input || {})
      const { data, meta } = await readCaseStudies(filters)
      return { success: true, data: { items: data, meta } }
    } catch (error) {
      return safeCatch(error, "Failed to list case studies")
    }
  }

  async get(input) {
    try {
      const { id } = LookupCaseStudyInputSchema.parse(input || {})
      if (!id) return createFailure(CaseStudyErrorCode.INVALID_INPUT, "id is required", false)
      const study = await readCaseStudy(id)
      if (!study) return createFailure(CaseStudyErrorCode.NOT_FOUND, `Case study not found: ${id}`, false)
      return { success: true, data: study }
    } catch (error) {
      return safeCatch(error, "Failed to get case study")
    }
  }

  async create(input) {
    try {
      const data = CreateCaseStudyInputSchema.parse(input || {})
      const study = await createCaseStudy(data)
      return { success: true, data: study }
    } catch (error) {
      return safeCatch(error, "Failed to create case study")
    }
  }

  async update(input) {
    try {
      const { id, ...data } = UpdateCaseStudyInputSchema.parse(input || {})
      if (!id) return createFailure(CaseStudyErrorCode.INVALID_INPUT, "id is required", false)
      const study = await updateCaseStudy(id, data)
      if (!study) return createFailure(CaseStudyErrorCode.NOT_FOUND, `Case study not found: ${id}`, false)
      return { success: true, data: study }
    } catch (error) {
      return safeCatch(error, "Failed to update case study")
    }
  }

  async remove(input) {
    try {
      const { id } = LookupCaseStudyInputSchema.parse(input || {})
      if (!id) return createFailure(CaseStudyErrorCode.INVALID_INPUT, "id is required", false)
      const deleted = await deleteCaseStudy(id)
      if (!deleted) return createFailure(CaseStudyErrorCode.NOT_FOUND, `Case study not found: ${id}`, false)
      return { success: true, data: { deleted: true } }
    } catch (error) {
      return safeCatch(error, "Failed to delete case study")
    }
  }
}
