// pages/my/my.js
import request from '../../utils/request';
let startY=0;
let moveY=0;
let distance=0;
let timestamp;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:`translateY(0rpx)`,
    coverTransition:'',
    loginKey:'',
    userInfo:{},
    hsDataList:[]
    
    // covertransition:'transform 1s linear'
  },
 

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取历史播放记录
    
   let userInfo = wx.getStorageSync('userinfo')
   this.setData({
    userInfo:JSON.parse(userInfo)
   })
   this.test()
   this.historyData()
  //  if(this.userInfo.account!=''){
  //   this.historyData()
  //  }
  },
  
  HandletouchStart(e){
    startY= e.touches[0].clientY
    this.setData({
    
      coverTransition:''
    })
  },
  HandletouchMove(e){
  
   moveY = e.touches[0].clientY
   distance = moveY - startY
   if(distance<0){
    return;
  }
   if(distance>=80){
      distance=80;
   }

    this.setData({
      coverTransform:'translateY('+distance+'rpx)'
    })
  
  },
  HandletouchEnd(e){
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition:'transform .4s linear'
    })

  },
 
  login(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
 },
  test(){


  //  console.log(this.data.userInfo);
  //  console.log(this.data.userInfo.account);
  },
 /* 最近历史播放 weekdata */
   async historyData(){
     let hsDataList = []
    timestamp = Date.now()
      let hsData = await request('/user/record?uid='+this.data.userInfo.account.id+'&type=1&'+timestamp,'GET')
      let{ weekData } = hsData
      let index= 0
      let weekDatas = weekData.splice(0,6).map(item =>{
        item.id = index++
        return item
      })
      // console.log(hsData);
      this.setData({
        hsDataList :weekDatas
      })
    },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})