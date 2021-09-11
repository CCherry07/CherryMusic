import request from "../../utils/request";

// pages/redTopic/redTopic.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannersList: [],
    radio: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // https://music.163.com/#/djradio?id=961055182 视频链接
    // 962569306 960512274
    this.getRadio(961055182);
  },
  async getRadio(id) {
    let { programs: radio } = await request("/dj/program", {
      rid: id,
    });
    this.setData({
      radio,
    });
    console.log(radio);
  },

  swiperActive(e) {
    // let type = e.detail.current;
    let type = e.currentTarget.id
    this.setData({
      radio: [],
    });
    console.log(type);
    if (type == 0) {
      this.getRadio(961055182);
    }else if (type == 1) {
      this.getRadio(962569306);
    }else{
      this.getRadio(960512274);
    }
  },
  goPlay(e) {
    let radioStationId= e.currentTarget.id;
    let radioInfoId = e.currentTarget.dataset.radioinfoid
    console.log(radioInfoId);
    wx.navigateTo({
      url: "/pages/play/play?radioStationId=" + radioStationId + -radioInfoId,
    });
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
