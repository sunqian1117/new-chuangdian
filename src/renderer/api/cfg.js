// 仅示例
import request from '@/utils/request'
const crypto = require('crypto');
const md5 = crypto.createHash('md5');
// export function login (data) {
//   return request({
//     url: '/user/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo (token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
export function cfg (data) {
  let timestamp = new Date().getTime()/1000
  let sign = md5.update('24083557'+'58dbb9b56f924643b7d462b1543dd081'+timestamp).digest('hex')
  console.log(sign)
  data = {...data,uid:'24083557',timestamp,sign}
  console.log(data)
  return request({
    url: '/conf/real',
    method: 'post',
    data
  })
}
