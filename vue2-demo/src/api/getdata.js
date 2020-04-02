import ajax from '@/config/ajax'

import {baseUrl} from '@/config/env'

/**
 * 获取Token
 */
export const createToken = data => ajax('/createToken', data, 'POST', true);

/**
 * 获取课程列表
 */
export const getCourseList = data => ajax('/api/user/user/info', data, 'GET');

export const getUpFileUrl = () => {
    var getPath = baseUrl + '/api/disk/file/upload'
    return getPath
};
