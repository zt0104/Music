// pages/Recommend/Recommend.js
import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month : '',
    cookie:'',
    recommendList:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     // 更新日期的状态数据
     let cookie = wx.getStorageSync('cookie')
    
     this.setData({
      cookie,
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    this.getrecommendData()
  },
  async getrecommendData(){
   let  recommendData = await request('/recommend/songs?cookie='+this.data.cookie,'GET')
   console.log(recommendData);
   this.setData({
    recommendList :recommendData
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