/*
封装功能函数
1功能明确
2固定代码
3参数默认值
*/

// 网路请求
import config from "./config";
export default (url, data = {}, method = "GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header:{
        cookie :wx.getStorageSync('cookie')
      },
      dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        console.log(err);
        reject(err);
      },
    });
  });
};
