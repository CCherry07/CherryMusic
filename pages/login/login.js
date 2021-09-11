// pages/login/login.js
import request from "../../utils/request";
/*
1.收集表单项认证
2.前端认证
1）验证用户信息是否合法
2）验证不通过提示修改
3）验证通过，发送请求
3后端认证
1）验证用户是否存在
2）用户不存在返回errmsg
3）用户存在，验证密码
4）不正确返回errmsg
5）正确返回数据
*/
Page({
  /**
   * 页面的初始数据
   */

  data: {
    phone: "15223363354",
    password: "sweetcdy9420",
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
  },

  handleInput(e) {
    // id方式
    // let type = e.currentTarget.id
    let type = e.currentTarget.dataset.type;
    this.setData({
      [type]: e.detail.value,
    });
  },

  async login() {
    let { phone, password } = this.data;
    // 验证表单数据合法性
    if (!phone || !password) {
      wx.showToast({
        title: "信息不能为空", //提示的内容,
        icon: "none", //图标,
        duration: 2000, //延迟时间,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: (res) => {},
      });
      return;
    }
    let phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: "手机号错误", //提示的内容,
        icon: "none", //图标,
      });
      return;
    }

    if (password.length < 6) {
      wx.showToast({
        title: "密码大于6位", //提示的内容,
        icon: "none", //图标,
      });
      return;
    }
    let res = await request("/login/cellphone", { phone, password }, "POST");
    if (res.code !== 200) {
      wx.showToast({
        title: res.message, //提示的内容,
        icon: "none", //图标,
      });
      return;
    } else {
      console.log(res);
      wx.setStorageSync(
        'userInfo',
         JSON.stringify(res.profile)
      );
      
      wx.setStorageSync(
        'cookie',
        res.cookie 
      )
      wx.showToast({
        title: "登录成功", //提示的内容,
        icon: "none", //图标,
      });
      wx.reLaunch({ url: "../personalCenter/personalCenter" });
    }
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
