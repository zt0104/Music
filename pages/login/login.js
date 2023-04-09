// pages/login/login.js
import request from '../../utils/request';
import {base64src} from '../../utils/base64'



 let timestamp
 let cookie
 let reback
Page({

  /**
   * 页面的初始数据
   */
  data: {
      info:'',
      cookie:'',
      srcImg:''  //base64 转译 img srt链接码
  },

  async checkStatues(key,timestamp=Date.now()) {
    console.log(timestamp);
    let res = await request('/login/qr/check',{key,timestamp})
    return res
  },
 
  async getLoginStatus() {
    
    // this.data.cookie
    let res = await request('/login/status?cookie='+this.data.cookie,'GET',{timestamp:Date.now()},
    )
      console.log(res);

    wx.setStorageSync('userinfo',  JSON.stringify(res.data,null,2))
    this.setData({
      // info: JSON.stringify(res.data,null,2)
      info: res.data         
    })
    // 获取到数据后 回调到 "我的"
    // if(true){
    // setTimeout(this.goback,1500)
    // }
    // reback=setTimeout(this.goback,2000)
  },
  goback(){
    clearTimeout(reback)
  wx.reLaunch({url:'/pages/my/my'})
  },
  // 执行 login
  async login(){
    let timer
    // 是否已经登录 ,读取cookie 直接登录
    if(wx.getStorageSync('cookie')!=0){
    let cookie = wx.getStorageSync('cookie')
    this.getLoginStatus(cookie)
  }
    // 最近第一次登录 获取key
    let res = await request('/login/qr/key',{timestamp:Date.now()})
    let key = res.data.unikey
    console.log(key,Date.now());
    let res2 = await request('/login/qr/create',{
      key,timestamp:Date.now(),qrimg:true})
     
      console.log("res2",res2);
     let ImgSrc = res2.data.qrimg
     
   // 在那倒 base64 之后 再渲染二维码
    base64src( ImgSrc, res=>{
    console.log("二维码链接",res);   // 返回图片地址，直接赋值到image标签即可
    this.setData({
      srcImg :res
    })
  })
    // if(this.data.info.length===0){
    timer = setInterval(async() =>{
      timestamp =Date.now()
      let statusRes = await this.checkStatues(key)
      console.log("statusRes",statusRes);
      if (statusRes.code === 800){
        wx.showToast({
          title: '二维码已过期,重新获取',
          icon: 'none',
          duration: 2000
        })
        clearInterval(timer)
        this.ckRg()
      }
      if (statusRes.code === 803){
        console.log(statusRes);
        clearInterval(timer)
        wx.showToast({
          title: '成功登录',
          icon: 'success',
          duration: 2000
        })
        await this.getLoginStatus(statusRes.cookie)  
        wx.setStorageSync('cookie', statusRes.cookie)
        this.setData({
          cookie:statusRes.cookie
        })
       
      }
    }
    ,1000)
    },
  // },
  btn(e){
      console.log(e);
      if(e.target.id=="游客"){
        this.YXlogin()
        console.log("你是游客");

      }else{
      console.log("你是用户");
      this.login()
    }
  },
  async YXlogin(){
   let ykData =  await request('/register/anonimous',{timestamp:Date.now()})
   let {cookie}  = ykData
    console.log(cookie);
    let ykStatus =  await request('/login/status?cookie='+cookie,'GET')
    console.log(ykStatus);
  },
  ckRg(){
    let cookie = wx.getStorageSync('cookie')
    this.setData({
      cookie
    })
    // console.log(this.data.cookie);
    this.getLoginStatus()
    
  },
  onLoad(options) {
    if(wx.getStorageSync('cookie')!=''){
      this.ckRg()
    }
    //二维码
    
  },
 
  onReady() {
   
  },

  onShow() {
   
  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },


  onShareAppMessage() {

  }
})