import {
  readServices as listServicesInStore,
  readService as getServiceInStore,
  createService as createServiceInStore,
  updateService as updateServiceInStore,
  deleteService as deleteServiceInStore,
} from "../../db/services.js"
import {
  CreateServiceInputSchema,
  UpdateServiceInputSchema,
  ListServiceInputSchema,
  LookupServiceInputSchema,
  ServiceErrorCode,
  ServiceListResultSchema,
  ServiceSingleResultSchema,
  ServiceDeleteResultSchema,
  createServiceFailure,
} from "./spec.js"

const defaultServiceStore = {
  list: (filters) => listServicesInStore(filters),
  get: (id) => getServiceInStore(id),
  create: (data) => createServiceInStore(data),
  update: (id, data) => updateServiceInStore(id, data),
  remove: (id) => deleteServiceInStore(id),
}

function inputFailure(resultSchema, error, fallbackMessage) {
  const message = error?.issues?.map((issue) => issue.message).join("; ") || fallbackMessage
  return resultSchema.parse(
    createServiceFailure(ServiceErrorCode.INVALID_INPUT, message, false)
  )
}

function unknownFailure(resultSchema, error, fallbackMessage) {
  return resultSchema.parse(
    createServiceFailure(
      ServiceErrorCode.UNKNOWN_ERROR,
      error instanceof Error ? error.message : fallbackMessage,
      true
    )
  )
}

function notFoundFailure(resultSchema, id) {
  return resultSchema.parse(
    createServiceFailure(ServiceErrorCode.NOT_FOUND, `Service not found: ${id}`, false)
  )
}

export class ServiceHandler {
  constructor(store = defaultServiceStore) {
    this.store = store
  }

  async list(input) {
    const parsedInput = ListServiceInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(ServiceListResultSchema, parsedInput.error, "Invalid service filters.")
    }

    try {
      const { data, meta } = await this.store.list(parsedInput.data)
      return ServiceListResultSchema.parse({ success: true, data: { items: data, meta } })
    } catch (error) {
      return unknownFailure(ServiceListResultSchema, error, "Failed to list services")
    }
  }

  async get(input) {
    const parsedInput = LookupServiceInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(ServiceSingleResultSchema, parsedInput.error, "Invalid service id.")
    }

    try {
      const { id } = parsedInput.data
      const service = await this.store.get(id)
      if (!service) return notFoundFailure(ServiceSingleResultSchema, id)
      return ServiceSingleResultSchema.parse({ success: true, data: service })
    } catch (error) {
      return unknownFailure(ServiceSingleResultSchema, error, "Failed to get service")
    }
  }

  async create(input) {
    const parsedInput = CreateServiceInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(ServiceSingleResultSchema, parsedInput.error, "Invalid service payload.")
    }

    try {
      const service = await this.store.create(parsedInput.data)
      return ServiceSingleResultSchema.parse({ success: true, data: service })
    } catch (error) {
      return unknownFailure(ServiceSingleResultSchema, error, "Failed to create service")
    }
  }

  async update(input) {
    const parsedInput = UpdateServiceInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(ServiceSingleResultSchema, parsedInput.error, "Invalid service payload.")
    }

    try {
      const { id, ...data } = parsedInput.data
      const service = await this.store.update(id, data)
      if (!service) return notFoundFailure(ServiceSingleResultSchema, id)
      return ServiceSingleResultSchema.parse({ success: true, data: service })
    } catch (error) {
      return unknownFailure(ServiceSingleResultSchema, error, "Failed to update service")
    }
  }

  async remove(input) {
    const parsedInput = LookupServiceInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(ServiceDeleteResultSchema, parsedInput.error, "Invalid service id.")
    }

    try {
      const { id } = parsedInput.data
      const deleted = await this.store.remove(id)
      if (!deleted) return notFoundFailure(ServiceDeleteResultSchema, id)
      return ServiceDeleteResultSchema.parse({ success: true, data: { deleted: true } })
    } catch (error) {
      return unknownFailure(ServiceDeleteResultSchema, error, "Failed to delete service")
    }
  }
}
