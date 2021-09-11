// pages/video/video.js
import request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], //视频列表标签
    activeItemId: 0, //当前选择的标签
    videoList: [], //视频list
    activeId: "", //当前播放视频的id
    videoUpdateTime: [], //历史播放video的播放进度
    triggered: false, //下拉数据更新状态
    newPages: [], //下拉数据更新的数据
    page: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync("cookie")) {
      this.getVideoGroupList();
    } else {
      wx.showToast({
        title: "亲，访问视频页需要登录奥",
        icon: "none",
        duration: 1500,
        mask: false,
      });
      setTimeout(()=>{
        wx.reLaunch({ url: "/pages/login/login"});
      },1500)
    }
  },

  // 视频标签
  async getVideoGroupList(flog) {
    let { data: res } = await request("/video/group/list");
    res.splice(4,1)&&res.splice(13,1),
    this.setData({ 
      videoGroupList: res.slice(0, 14),
      // 默认选项
      activeItemId: flog ? flog : res[0].id,
    });
    this.getVideoList(this.data.activeItemId);
  },

  // active导航标签
  navActive(e) {
    this.setData({
      activeItemId: e.target.id,
      videoList: [],
    });
    wx.showLoading({
      title: "Loading...", //提示的内容
    });
    this.getVideoGroupList(this.data.activeItemId);
  },

  // 视频标签下的数据
  async getVideoList(id, page) {
    let offset = 0;
    if (page) {
      offset = page;
    }
    let { datas: res } = await request("/video/group", { id, offset });
    let videoMsg = [res];
    let urls = [];
    for (const item of res) {
      urls.push(
        request("/video/url", { id: item.data.vid }).then((res) => res)
      );
    }

    //es6的语法
    // res.forEach(async (item) => {
    //   urls.push(
    //       request("/video/url", { id: item.data.vid }).then((res) => res)
    //   );
    // });
    let data = await Promise.all(urls);
    videoMsg.push(data);
    console.log(videoMsg);
    this.setData({
      newPages: videoMsg,
    });
    if (!page) {
      this.setData({
        videoList: videoMsg,
        triggered: false,
      });
    }
    wx.hideLoading();
  },
  // 视频播放

  // 解决多个视频同时播放
  handlePlay(e) {
    // 创建video实例对象
    let vid = e.target.id;
    this.vid !== vid && this.videoContext && this.videoContext.stop();
    this.vid = vid;
    this.setData({
      activeId: vid,
    });
    this.videoContext = wx.createVideoContext(vid);
    // 判断当前视频是否有播放记录
    let { videoUpdateTime } = this.data;
    let videoItem = videoUpdateTime.find((item) => item.vid === vid);
    if (videoItem) {
      // 跳转指定时间播放
      this.videoContext.seek(videoItem.currentTime);
      return;
    }
    this.videoContext.play();
  },

  // 记录历史播放video的播放进度
  videoCurrentTime(e) {
    let setCurrentTime = {
      vid: e.currentTarget.id,
      currentTime: e.detail.currentTime,
    };
    let { videoUpdateTime } = this.data;
    let videoItem = videoUpdateTime.find(
      (item) => item.vid === setCurrentTime.vid
    );
    if (videoItem) {
      videoItem.currentTime = e.detail.currentTime;
    } else {
      videoUpdateTime.push(setCurrentTime);
    }
    this.setData({
      videoUpdateTime,
    });
  },
  // 视频播放完后删除videoUpdateTime里面的记录
  videoEnd(e) {
    let { videoUpdateTime } = this.data;
    videoUpdateTime.splice(
      videoUpdateTime.findIndex((item) => item.vid === e.target.vid),
      1
    );
    this.setData({
      videoUpdateTime,
    });
  },
  // 下拉刷新数据
  handleUpdateData() {
    this.setData({
      triggered: true,
    });
    this.getVideoList(this.data.activeItemId, 0);
  },

  // 上拉触底数据加载
  handleDataLoading() {
    // 数据分页 1后端分页2前端分页（追加数据view）
    let { videoList, newPages, page } = this.data;
    page++;
    this.getVideoList(this.data.activeItemId, page);
    let res = videoList.map((item, index) => {
      return videoList[index].concat(newPages[index]);
    });
    this.setData({
      videoList: res,
      page,
      triggered: false,
    });
  },
  goSearch(){
    wx.navigateTo({
      url: "/pages/search/search",
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!wx.getStorageSync("cookie")) {
      wx.showToast({
        title: "亲，访问视频页需要登录奥",
        icon: "none",
        duration: 3000,
        mask: false,
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (from) {
    if (from.from==='button') {
      console.log(from);
      return {
        title:`${from.target.dataset.title}`,
        page:`${from.target.dataset.link}`,
        imageUrl:`${from.target.dataset.img}`
      }
    }else{
      return {
        title:'分享video页面',
        page:'/pages/video/video'
      }
    }
  },
});
