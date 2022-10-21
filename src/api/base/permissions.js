import { createAPI } from '@/utils/request'

// 权限列表
export const list = params => createAPI('/permissions', 'get', params)

// 简单权限列表
export const simple = params => createAPI('/permissions/simple', 'get', params)

// 添加权限
export const add = data => createAPI('/permissions', 'post', data)

// 更新权限
export const update = data => createAPI(`/permissions/${data.id}`, 'put', data)

// 删除权限
export const remove = data => createAPI(`/permissions/${data.id}`, 'delete', data)

// 权限详情
export const detail = params => createAPI(`/permissions/${params.id}`, 'get', params)
