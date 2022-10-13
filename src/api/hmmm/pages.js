import { createAPI } from '@/utils/request'

// 基础题库列表
export const getmenusAPI = () => createAPI('/menus')
