import request from "../../utils/request";
import PubSub from "pubsub-js";
import moment from "moment";
const appInst = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: true,
    song: {},
    radio:{},
    musicSrc: "",
    currentTime: "00:00",
    totalLength: "00:00",
    progressBar: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { songId, radioStationId } = options;
    if (songId) {
      this.getMusicInfo(songId);
    } else {
      let newArr = radioStationId.split("-");
      this.getRadioStation(newArr);
    }

    this.backAudioManager = wx.getBackgroundAudioManager();

    if (appInst.globalDate.musicPlay && appInst.globalDate.musicId == songId) {
      this.setData({
        isPlay: true,
      });
    }
    this.backAudioManager.onPlay(() => {
      this.playState(true);
      appInst.globalDate.musicId = songId;
    });
    this.backAudioManager.onPause(() => {
      this.playState(false);
    });
    this.backAudioManager.onStop(() => {
      this.playState(false);
    });
    this.backAudioManager.onEnded(() => {
      this.setData({
        progressBar: 0,
        currentTime: "00:00",
      });
      this.updateMusic("next");
    });
    // 监听音乐进度
    this.backAudioManager.onTimeUpdate(() => {
      let progressBar =
        (this.backAudioManager.currentTime / this.backAudioManager.duration) *
        600;
      this.setData({
        progressBar,
        currentTime: moment(this.backAudioManager.currentTime * 1000).format(
          "mm:ss"
        ),
      });
    });
  },
  // 电台详情
  // /dj/detail
  async getRadioStation(newArr) {
    let { program: radioStationInfo } = await request("/dj/program/detail", {
      id: newArr[1],
    });
    console.log(radioStationInfo);
    this.setData({
      radio:radioStationInfo
    })
    this.getMusicSrc(newArr[0]);
  },
  playState(isPlay) {
    appInst.globalDate.musicPlay = isPlay;
    this.setData({
      isPlay,
    });
  },

  async getMusicSrc(songId) {
    let { data: musicSrc } = await request("/song/url", { id: songId });
    this.setData({
      musicSrc: musicSrc[0].url,
    });
    this.backAudioManager.src = musicSrc[0].url;
    this.data.song ? this.radioControl(1) : this.musicControl(1);
  },

  async getMusicInfo(songId) {
    this.getMusicSrc(songId);
    let { songs: musicInfo } = await request("/song/detail", { ids: songId });
    this.setData({
      song: musicInfo,
    });
    console.log(musicInfo);
    let { dt: time } = musicInfo[0];
    this.setData({
      totalLength: moment(time).format("mm:ss"),
    });
    wx.setNavigationBarTitle({ title: this.data.song[0].name });
    this.musicControl("true");
  },

  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    this.setData({
      isPlay,
    });
    this.data.song ? this.radioControl(isPlay) : this.musicControl(isPlay);
  },

  musicControl(isPlay) {
    if (isPlay) {
      this.backAudioManager.src = this.data.musicSrc;
      console.log(isPlay, this.data.musicSrc);
      let title = this.data.song[0].name;
      this.backAudioManager.title = title;
    } else {
      this.backAudioManager.pause();
    }
  },
  radioControl(isPlay) {
    if (isPlay) {
      this.backAudioManager.src = this.data.musicSrc;
      this.backAudioManager.title = "党史";
    } else {
      this.backAudioManager.pause();
    }
  },

  updateMusic(e) {
    let type;
    if (e === "next") {
      type = e;
    } else {
      type = e.currentTarget.id;
    }
    console.log(type);
    this.backAudioManager.pause();
    PubSub.publish("updateMusic", type);
    PubSub.subscribe("getMusicId", (msg, musicId) => {
      this.getMusicInfo(musicId);
      PubSub.unsubscribe("getMusicId");
      console.log(musicId);
    });
  },

  async getMusicList(musicId) {
    let src = `https://music.163.com/song/media/outer/url?id=910363877.mp3`;
    this.setData({
      musicSrc: src,
    });
  },
  currentTimeUpdate(e) {
    console.log(e);
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
