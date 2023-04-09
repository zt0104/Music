// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    recommanedList:[],
    topList:{},
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    let bannerListData=  await request('/banner',{type:2})
  
    let recommanedListData = await request('/personalized','GET',{limit:5})
    let index=0;
    let topListData = await request('/toplist','GET',{idx:index++})
     /* 取四项数据 */
      let topListItem = topListData.list.slice(0,5)
     let topListItemDetail=[]
      for(let item of topListItem){
        let detailList = 
        await request('/playlist/detail?id='+item.id,{limit:10})
        topListItemDetail.push({
          name:detailList.playlist.name,
          tracks:detailList.playlist.tracks.slice(0,3)
        })
        this.setData({
          topList:topListItemDetail
        })
        // console.log(detailList);
      }



    
    this.setData({
    bannerList : bannerListData.banners.slice(0,4) , 
    recommanedList : recommanedListData.result.slice(0,6),
    
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