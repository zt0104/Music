// pages/video/video.js
import request from '../../utils/request';
let vtop=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videogroupListData:[],
    navId:'',
    videoList:[],
    vid:'',  //用户点击ID
    videoArr:[],
    isTriggle:'',
    scrollTop:0
    
    // movetop:''
    // cookie:''
  },
  // onPageScroll(scrollTop){
  //   console.log(scrollTop);
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getvideogroupList()
    this.setData({
      // cookie:wx.getStorageSync('cookie')
    })
  },
  
   async getvideogroupList (e){
    let videogroupList = await request('/video/group/list')
    let {data} =videogroupList
    
    let videogroupListData =  data.splice(0,14)
    this.setData({
      videogroupListData,
      navId : videogroupListData[0].id
    })
    this.getvideoGroup(this.data.navId)
   },
   async getvideoGroup(id){
    let videoGroup = await request('/video/timeline/recommend',{
     cookie:wx.getStorageSync('cookie'),
      id  ,
      timestamp:Date.now()
      },)
      wx.hideLoading();
     let isTriggle=false
      let videoGroupData=[]
      let  index =0
      videoGroup.datas.map(item =>
        item.id = index++
      )
      let {datas} =videoGroup
      try {
        for(let item of datas){
          let obj1={
             id : item.data.urlInfo.id,
            Vurl: item.data.urlInfo.url,
            title: item.data.title,
            avatarUrl:item.data.creator.avatarUrl,
            nickname:item.data.creator.nickname,
            praiseCount:item.data.praisedCount,
            commentCount:item.data.commentCount, 
             coverUrl : item.data.coverUrl
           }
           videoGroupData.push(obj1)
         }
      } catch (error) {
        // console.log(error);
      }
      this.setData({
        videoList :videoGroupData,
        isTriggle
      })
    
   },
  async changeTab(event){ 
   let navId =  event.currentTarget.id
   console.log(navId);
   wx.showLoading({
    title: '正在加载'
  })
    this.setData({
      navId,
      videoList:[]
    })
    this.getvideoGroup(this.data.navId);
   },
   HandlePlay(event){
     
    //  console.log("哈哈哈");
   
    /* 问题:多个视频同时播放的问题
    需求:  1) 在点击播放的事件中需要找到上一个播放的视频
          2)  在播放新的视频之前关闭上一个正在播放的视频
    关键: 1) 如何找到上一个视频的实例对象
          2) 如何确认点击播放的视频和正在播放的视频不是同一个视频
   设计模式 ———— 单例模式：
          1.在需要创建多个对象的场景下,通过一个变量接收,始终保持只有一个对象,
          2.节省内存空间
    */
    
      let vid = event.currentTarget.id
      this.setData({
        vid
      })
     this.vid !==vid  && this.videoCtx && this.videoCtx.stop()
      this.vid = vid
     this.videoCtx =  wx.createVideoContext(vid)
     let {videoArr} = this.data
     let videoItem = videoArr.find(item => item.vid === vid);
    if(videoItem){
      this.videoCtx.seek(videoItem.vstopTime);
    }
    this.videoCtx.play();
    
    
   },
   bindtimeUpdate(event){
    //  console.log(event);
    let videoArr =this.data.videoArr
    let videoObj ={
      vid:event.currentTarget.id,
      vstopTime:event.detail.currentTime
    }
   let thisvideoItem =  videoArr.find(item =>videoObj.vid === item.vid )
    //  console.log(thisvideoItem);
    if(thisvideoItem){
      thisvideoItem.vstopTime= event.detail.currentTime   
    }else{
      // console.log("此前一直没有");
    videoArr.push(videoObj)}
    this.setData({videoArr})
      // console.log(videoArr);
  },
  finishedPlay(event){
    let {videoArr} = this.data
   let findNumber = videoArr.findIndex(item =>event.currentTarget.id ===item.vid)
    videoArr.splice(findNumber,1)
    this.setData({
      videoArr
    })

  },
  handleRefresh(){
      console.log("触发刷新");
      this.getvideoGroup(this.data.navId);
  },
 async handleTolower(event){
    // console.log("触底加载更多");
    let videoGroupData=[]
    let videoList = this.data.videoList;
    // let newVideoList = this.getvideoGroup(this.data.navId);
    let newVideoList =await request('/video/timeline/recommend',{
      cookie:wx.getStorageSync('cookie'),
       id:this.data.navId ,
       timestamp:Date.now()
       },)
       let index=10

       newVideoList.datas.map(item =>
        item.id = index++
      )
       let {datas} =newVideoList
      // console.log(datas);
       try {
        for(let item of datas){
          let obj1={
             id : item.data.urlInfo.id,
            Vurl: item.data.urlInfo.url,
            title: item.data.title,
            avatarUrl:item.data.creator.avatarUrl,
            nickname:item.data.creator.nickname,
            praiseCount:item.data.praisedCount,
            commentCount:item.data.commentCount, 
             coverUrl : item.data.coverUrl
           }
           videoGroupData.push(obj1)
         }
       } catch (error) {
         
       }
         videoList.push(...videoGroupData)
        //  console.log(event);
        // console.log(vtop);
        this.setData({
          videoList,
          scrollTop:vtop +80
        })           
  },
  onScroll: function(e) {
    vtop = e.detail.scrollTop
  },

/*  /  * 生命周期函数--监听页面初次渲染完成
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

  },
 
})