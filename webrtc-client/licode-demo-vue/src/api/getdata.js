import ajax from '@/config/ajax'

import {baseUrl} from '@/config/env'

/**
 * 获取课程列表
 */
export const getCourseList = data => ajax('/api/user/user/info', data, 'GET');

/**
 * 创建课程
 */

export const creatCourse = data => ajax('/api/user/user/info', data, 'POST');

/**
 * 编辑课程
 */
export const editCourse = data => ajax('/api/user/user/info', data, 'POST');

export const getUpFileUrl = () => {
    var getPath = baseUrl + '/api/disk/file/upload'
    return getPath
};
/**
 * 手动创建列表
 */

export const handCreatFile = data => ajax('/api/disk/file/upload_create', data, 'GET');

export const getList = (data,loadingkey) => {
    ajax('/api/disk/file/get_list', data, 'GET',false,false,false,loadingkey);
}
/**
 * 创建文件夹
 */

export const creatFolder = data => ajax('/api/disk/dir/add', data, 'GET');