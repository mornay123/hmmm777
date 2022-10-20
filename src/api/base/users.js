import { createAPI } from '@/utils/request'

// 用户列表
export const list = data => createAPI('/users/', 'get', data)

// 用户简单列表
export const simple = data => createAPI('/users/simple', 'get', data)

// 添加用户
export const add = data => createAPI('/users', 'post', data)

// 更新用户
export const update = data => createAPI(`/users/${data.id}`, 'put', data)

// 删除用户
export const remove = data => createAPI(`/users/${data.id}`, 'delete', data)

// 用户详情
export const detail = data => createAPI(`/users/${data.id}`, 'get', data)
