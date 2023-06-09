// 发送ajax请求
// 模块化思想  export default ()=>{}

import config from './config'


 
export default (url,data={},method='GET')=>{
return  new Promise((resolve,reject)=>{
    wx.request({
      url: config.host + url,
      data,
      header:{
      },
      method,
      
      success:(res)=>{
       
        resolve(res.data);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}