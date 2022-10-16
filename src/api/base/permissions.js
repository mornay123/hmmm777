import { createAPI } from '@/utils/request'

export const list = params => createAPI('/permissions', 'get', params)
export const simple = params => createAPI('/permissions/simple', 'get', params)
export const add = data => createAPI('/permissions', 'post', data)
export const update = data => createAPI(`/permissions/${data.id}`, 'put', data)
export const remove = data => createAPI(`/permissions/${data.id}`, 'delete', data)
export const detail = params => createAPI(`/permissions/${params.id}`, 'get', params)
