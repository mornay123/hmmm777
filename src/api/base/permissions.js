import { createAPI } from '@/utils/request'

// 权限列表
export const list = data => createAPI('/permissions', 'get', data)

// 简单权限列表
export const simple = data => createAPI('/permissions/simple', 'get', data)

// 添加权限
export const add = data => createAPI('/permissions', 'post', data)

// 更新权限
export const update = data => createAPI(`/permissions/${data.id}`, 'put', data)

// 删除权限
export const remove = data => createAPI(`/permissions/${data.id}`, 'delete', data)

// 权限详情
export const detail = data => createAPI(`/permissions/${data.id}`, 'get', data)
