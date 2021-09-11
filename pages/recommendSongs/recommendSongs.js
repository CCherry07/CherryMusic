// pages/recommendSongs/recommendSongs.js
import request from "../../utils/request";
import PubSub from "pubsub-js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    day: "",
    month: "",
    recommendSongs: [],
    songIndex: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
    });
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      wx.showToast({
        title: "请先登录", //提示的内容,
        icon: "none", //图标,
        duration: 1500, //延迟时间,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: () => {
          setTimeout(() => {
            wx.reLaunch({ url: "/pages/login/login" });
          }, 1500);
        },
      });
    }
    this.getRecommendSongs();
    // 订阅事件
    PubSub.subscribe("updateMusic", (msg, type) => {
      let { recommendSongs, songIndex } = this.data;
      console.log(type);
      if (type == "up") {
        // 上一首
        if (songIndex == 0) {
          songIndex = recommendSongs.length - 1;
        } else {
          songIndex -= 1;
        }
      } else {
        // 下一首
        if (songIndex == recommendSongs.length-1) {
          songIndex = 0;
        } else {
          songIndex += 1;
        }
      }
      this.setData({
        songIndex,
      });
      let newMusicId = recommendSongs[songIndex].id;
      PubSub.publish("getMusicId", newMusicId);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  // 获取推荐数据

  async getRecommendSongs() {
    let { data: recommendSongs } = await request("/recommend/songs");
    this.setData({
      recommendSongs: recommendSongs.dailySongs,
    });
  },

  goPlay(e) {
    let { index, songid } = e.currentTarget.dataset;
    this.setData({
      songIndex: index,
    });
    wx.navigateTo({
      url: "/pages/play/play?songId=" + songid,
    });
  },
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
