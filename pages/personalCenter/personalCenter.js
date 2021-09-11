import request from "../../utils/request";

// pages/personalCenter/personalCenter.js
let startY = 0,
  moveY = 0,
  moveDistance = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: "translateY(0)",
    coveTransition: "",
    userInfo: {}, //用户信息
    recentPlayList: [], //最近播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户信息
    let userInfo = JSON.parse(wx.getStorageSync("userInfo"));
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
      });
    }

    this.getRecentPlayList(this.data.userInfo.userId);
  },
  // 最近播放记录数据
  async getRecentPlayList(userId) {
    let { allData: RecentPlayListData } = await request("/user/record", {
      uid: userId,
      type: 0,
    });
    this.setData({
      recentPlayList: RecentPlayListData.slice(0, 10),
    });
  },

  handleTouchStart(e) {
    startY = e.touches[0].clientY;
    this.setData({
      coveTransition: ``,
    });
  },
  handleTouchMove(e) {
    moveY = e.touches[0].clientY;
    moveDistance = moveY - startY;
    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance >= 80) {
      moveDistance = 80;
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`,
    });
  },
  handleTouchEnd() {
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coveTransition: `transform .5s linear`,
    });
  },

  goPlay(e) {
    wx.navigateTo({
      url: "/pages/play/play?songId=" + e.currentTarget.dataset.songid,
    });
  },
  // 跳转登录页面
  toLogin() {
    wx.navigateTo({ url: "../login/login" });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
  onShareAppMessage: function () {},
});
