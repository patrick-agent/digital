import { readServices, readService, createService, updateService, deleteService } from "../../db/services.js"
import {
  CreateServiceInputSchema, UpdateServiceInputSchema,
  ListServiceInputSchema, LookupServiceInputSchema,
  ServiceErrorCode,
} from "./spec.js"
import { createFailure, safeCatch } from "../../contract/base.js"

export class ServiceHandler {
  async list(input) {
    try {
      const filters = ListServiceInputSchema.parse(input || {})
      const { data, meta } = await readServices(filters)
      return { success: true, data: { items: data, meta } }
    } catch (error) {
      return safeCatch(error, "Failed to list services")
    }
  }

  async get(input) {
    try {
      const { id } = LookupServiceInputSchema.parse(input || {})
      if (!id) return createFailure(ServiceErrorCode.INVALID_INPUT, "id is required", false)
      const service = await readService(id)
      if (!service) return createFailure(ServiceErrorCode.NOT_FOUND, `Service not found: ${id}`, false)
      return { success: true, data: service }
    } catch (error) {
      return safeCatch(error, "Failed to get service")
    }
  }

  async create(input) {
    try {
      const data = CreateServiceInputSchema.parse(input || {})
      const service = await createService(data)
      return { success: true, data: service }
    } catch (error) {
      return safeCatch(error, "Failed to create service")
    }
  }

  async update(input) {
    try {
      const { id, ...data } = UpdateServiceInputSchema.parse(input || {})
      if (!id) return createFailure(ServiceErrorCode.INVALID_INPUT, "id is required", false)
      const service = await updateService(id, data)
      if (!service) return createFailure(ServiceErrorCode.NOT_FOUND, `Service not found: ${id}`, false)
      return { success: true, data: service }
    } catch (error) {
      return safeCatch(error, "Failed to update service")
    }
  }

  async remove(input) {
    try {
      const { id } = LookupServiceInputSchema.parse(input || {})
      if (!id) return createFailure(ServiceErrorCode.INVALID_INPUT, "id is required", false)
      const deleted = await deleteService(id)
      if (!deleted) return createFailure(ServiceErrorCode.NOT_FOUND, `Service not found: ${id}`, false)
      return { success: true, data: { deleted: true } }
    } catch (error) {
      return safeCatch(error, "Failed to delete service")
    }
  }
}
