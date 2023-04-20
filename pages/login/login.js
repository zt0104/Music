// pages/login/login.js
import request from '../../utils/request';
import {base64src} from '../../utils/base64'
let timestamp;
let key
let timer
Page({

  /**
   * 页面的初始数据
   */
  data: {
      info:'',
      cookie:'',
      srcImg:'',  //base64 转译 img srt链接码
      key:'',
      isLogin:'',
      clearTime:'false'
  },
         // 这里没有 读到key
  async checkStatues(key,timestamp=Date.now()) {
    let res = await request('/login/qr/check',{key,timestamp,isLogin:true})
    console.log(res);
    return res
  },
    //携带cookie 获取用户数据 再存储本地userinfo 
  async getLoginStatus() {
    let res = await request('/login/status?cookie='+this.data.cookie,'GET',{timestamp:Date.now()},
    )
      console.log(res);
    wx.setStorageSync('userinfo',  JSON.stringify(res.data,null,2))
    this.setData({
      info: res.data         
    })
    //已登录 数据存储到本地, 返回 "我的" 
    // if(wx.getStorageSync('isLogin') && wx.getStorageSync('isLogin')!='true')
   if(this.data.isLogin !=false){
    this.goback() 
   }
  },


  goback(){
    wx.setStorageSync('isLogin',  'true')
    wx.reLaunch({url:'/pages/my/my'})
    
   
  },


  async showRWM(){
      // 最近第一次登录 获取key
      let res = await request('/login/qr/key',{timestamp:Date.now()})
      let key = res.data.unikey
      let res2 = await request('/login/qr/create',{
        key,timestamp:Date.now(),qrimg:true})
       let ImgSrc = res2.data.qrimg
       
      // 在那倒 base64 之后 再渲染二维码
        base64src( ImgSrc, res=>{
        console.log("二维码链接",res);   // 返回图片地址，直接赋值到image标签即可
        this.setData({
          srcImg :res,
          key,
        })
      if( wx.getStorageSync('cookie')?false:true){
        this.login()
      }
       
    })
  },



  // 执行 login
  async login(){
    let timer
    let key = this.data.key
    // // 最近是否登录过,读取cookie 直接登录
    // if(wx.getStorageSync('cookie')!=''){
    // let cookie = wx.getStorageSync('cookie')
    // this.getLoginStatus(cookie)
    // }
      // 定时器 循环等待扫码  验证登录状态
    timer = setInterval(async() =>{
      timestamp =Date.now()
      let statusRes = await this.checkStatues(key)
      console.log("statusRes",statusRes);
      //用于 左上角返回时, 计时器仍在轮询的问题
      if(this.data.clearTime!='false'){
        clearInterval(timer)
      }
      if (statusRes.code === 800){
        wx.showToast({
          title: '二维码已过期,请重试',
          icon: 'none',
          duration: 2000
        })
        clearInterval(timer)
        this.showRWM()
      }
      if (statusRes.code === 803){
        console.log(statusRes);
        //登录成功 消除定时器
        clearInterval(timer)
        wx.showToast({
          title: '成功登录',
          icon: 'success',
          duration: 2000
        })
        wx.setStorageSync('cookie', statusRes.cookie)
        this.setData({
          cookie:statusRes.cookie
        }) 
        await this.getLoginStatus(statusRes.cookie)  
       
      }
    } ,1000)},
  // },
 
  
  ckRg(){
    let cookie = wx.getStorageSync('cookie')
    this.setData({
      cookie
    })
    this.getLoginStatus()
    
  },
  outLogin(){
    wx.removeStorage({
      key: 'cookie',
      success (res) {
        wx.removeStorageSync('userinfo')
        wx.removeStorageSync('isLogin')
        wx.showToast({
          title: '退出成功',
          icon:'none'
        })
      }
    })
  },
  btn(){
    this.onLoad()
  },
  onLoad(options) {
    this.showRWM()
    if(wx.getStorageSync('cookie')!=''){
      wx.showToast({
        title: '用户已登录',
        duration: 850
      })
      this.setData({
        isLogin:false
      })
      this.ckRg()
    }
    
    
  },
 
  onReady() {
   
  },

  onShow() {
   
  },

  onHide() {

  },

  onUnload() {
            // 获取当前页面
            const pages = getCurrentPages();
            // 获取上一级页面
            const beforePage = pages[pages.length - 2];
     
            beforePage.setData({ //直接修改上个页面的数据（可通过这种方式直接传递参数）
                backRefresh: true  //函数封装，传值为true时调接口刷新页面
            })
            
           this.setData({
             clearTime:true
           })
           this.goback()
  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },


  onShareAppMessage() {

  }
})