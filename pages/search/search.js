// pages/search/search.js
import request from "../../utils/request";
let flog = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: "",
    hotList: [],
    searchContent: "",
    blurSearch: [],
    searchRecord: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData();
    this.getSearchRecord();
  },

  getSearchRecord() {
    let searchRecord = wx.getStorageSync("searchRecord");
    if (searchRecord.length > 6) {
      searchRecord.length = 6;
    }
    if (searchRecord) {
      this.setData({
        searchRecord,
      });
    }
  },
  async getInitData() {
    let placeholderContent = await request("/search/default");
    let { data: hotList } = await request("/search/hot/detail");
    console.log(hotList);
    this.setData({
      hotList,
      placeholderContent: placeholderContent.data.showKeyword,
    });
  },

  changeInput(e) {
    this.setData({
      searchContent: e.detail.value.trim(),
    });
    if (flog) {
      return;
    }
    flog = true;
    this.getSearchList();
    setTimeout(() => {
      flog = false;
    }, 300);
  },

  async getSearchList() {
    if (!this.data.searchContent) {
      this.setData({
        blurSearch: [],
      });
      return;
    }
    let { result: blurSearch } = await request("/search", {
      keywords: this.data.searchContent,
      limit: 10,
    });
    console.log(blurSearch);
    this.setData({
      blurSearch: blurSearch.songs,
    });
  },

  setSearchRecord(e) {
     console.log(e);
    let { searchContent, searchRecord } = this.data;
    if (!searchContent) {
      return;
    }
  
    if (searchRecord.indexOf(searchContent)!==-1) {
      searchRecord.splice(searchRecord.indexOf(searchContent), 1);
    }
    searchRecord.unshift(searchContent);
    wx.setStorageSync("searchRecord", searchRecord);
    this.getSearchRecord();
  },
  clearContent(){
    this.setData({
      searchContent:''
    })
  },

  delData(){
    let {searchRecord} = this.data
    if (searchRecord.length==0) {
      wx.showToast({
        title: '没有历史记录', //提示的内容,
        icon: 'none', //图标,
        duration: 500, //延迟时间,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      return
    }else{
      wx.showModal({
        content: '确认删除历史记录吗？', //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: '#000000', //取消按钮的文字颜色,
        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: '#3CC51F', //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            this.setData({
              searchRecord:[]
            })
            wx.removeStorageSync("searchRecord");
            this.getSearchRecord() 
          }
        }
      });
    }
      
    
   
  },
  // 模糊搜索

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
