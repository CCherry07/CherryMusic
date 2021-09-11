// pages/index/index.js
import request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannersList: [], //轮播图
    recommendList: [], //推荐歌单
    topList: [], //排行榜
  },
  /**
   * 生命周期函数--监听页面加载
   */

  // 数据请求
  onLoad: async function (options) {
    //轮播图
    let bannersListData = await request("/banner", { type: 2 });
    this.setData({
      bannersList: bannersListData.banners,
    });
    //推荐歌单
    let recommendListData = await request("/personalized", { limit: 8 });
    this.setData({
      recommendList: recommendListData.result,
    });
    //排行榜
    let topListData = await request("/toplist");
    let pages = [];
    let info = [];
    (function randomArr() {
      let pageNumber = parseInt(Math.random() * 32);
      info.length > 6
        ? "return"
        : info.indexOf(pageNumber) === -1
        ? info.push(pageNumber) & randomArr()
        : randomArr();
    })();
    for (const item of info) {
      let { playlist: topListArr } = await request("/playlist/detail", {
        id: topListData.list[item].id,
      });
      let arr = [];
      for (const el of topListArr.trackIds) {
        const index = topListArr.trackIds.indexOf(el);
        if (index < 3) {
          let { songs: songs } = await request("song/detail", { ids: el.id });
          let songsMsg = {
            name: songs[0].name,
            picUrl: songs[0].al.picUrl,
            id: songs[0].id,
          };
          arr.push(songsMsg);
        }
      }
      pages.push([topListData.list[item].name, arr]);
      this.setData({
        topList: pages,
      });
    }
  },
  goPlay(e){
    wx.navigateTo({
      url:"/pages/play/play?songId="+e.currentTarget.dataset.songid
    });
  },
  goRecommend() {
    wx.navigateTo({ url: "/pages/recommendSongs/recommendSongs" });
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
