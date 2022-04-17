const app = getApp();
const db = wx.cloud.database();
const store = db.collection("store");
const config = require("../../config.js");
const plugin = requirePlugin('routePlan');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    worktype:false,
    isChecked: 0,
    labelPic: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中...",
    });

    // 获取url页面参数
    console.log("id", options.id);

    store
      .doc(options.id)
      .get()
      .then((res) => {
        this.setData(
          {
            store: res.data,
            is_administrator: app.globalData.is_administrator,
            isChecked: res.data.isChecked
          },
          (res) => {
            let labelstr="";
            if(this.data.isChecked==0){
              labelstr="verifying"
            }else if(this.data.isChecked==1){
              labelstr="passed"
            }else if(this.data.isChecked==2){
              labelstr="errored"
            }
            this.setData({
              labelPic: "../../images/marker/"+labelstr+".png"
            })
            wx.hideLoading();
          }
        );
      });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      worktype: app.globalData.is_verifier,
    })
  },

  tapImage: function (e) {
    wx.previewImage({
      urls: this.data.store.images,
      current: e.currentTarget.dataset.url,
    });
  },
  copyPath: function (e) {
    let path = this.route + "?id=" + this.data.store._id;
    wx.setClipboardData({
      data: path,
      success: (res) => {
        wx.showToast({
          title: "路径复制成功",
          icon: "success",
        });
      },
    });
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   let path = "/pages/info/info?id=" + this.data.store._id;
  //   let image = "/images/share.jpg";
  //   if (this.data.store.images[0]) {
  //     wx.cloud.getTempFileURL({
  //       fileList: [this.data.store.images[0]],
  //       success: (res) => {
  //         return {
  //           title: "我在" + config.appName + "上发现了好吃的，你也看看吧！",
  //           path: path,
  //           imageUrl: res.fileList[0].tempFileURL,
  //         };
  //       },
  //       fail: (error) => {
  //         console.error("出现Bug了", error);
  //       },
  //     });
  //   } else {
  //     return {
  //       title: "我在" + config.appName + "上发现了好吃的，你也看看吧！",
  //       path: path,
  //       imageUrl: image,
  //     };
  //   }
  // },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "我在POI地图上标记了一处兴趣点问题，你也快来加入我们吧",
      path: "/pages/map/map",
      imageUrl:
        "https://6d61-map-4g0ciu1x80002ab0-1305236624.tcb.qcloud.la/share/share-pre.jpg?sign=d0236b01a9f4f1255d06109ef4a3fa91&t=1618313697",
    };
  },
  /**
   * 用户分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: "我在POI地图上标记了一处兴趣点问题，你也快来加入我们吧",
      path: "/pages/map/map",
      imageUrl:
        "https://6d61-map-4g0ciu1x80002ab0-1305236624.tcb.qcloud.la/share/share-pre.jpg?sign=d0236b01a9f4f1255d06109ef4a3fa91&t=1618313697",
    };
  },
  callContact: function (event) {
    wx.makePhoneCall({
      phoneNumber: this.data.store.contact,
    });
  },
  navigate: function (e) {
    // 导航模块，原api即openLocation存在问题，这个可以
    let referer = '路线规划';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
        'name': this.data.store.address,
        'latitude': this.data.store.latitude,
        'longitude': this.data.store.longitude,
    });
    console.log(endPoint)
    wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + config.mapSubKey + '&referer=' + referer + '&endPoint=' + endPoint
    });
  },
  // 核验模块，可单独加入插件，这里跳转加传参id
  check: function (event) {
    console.log("marker核验", event);
    const _id = this.data.store._id;
    wx.navigateTo({
      url: "../verify/verify?id=" + _id,
    });
  },
  // 更新模块
  refresh: function (event) {
    const _id = this.data.store._id;
    wx.navigateTo({
      url: "../refresh/refresh?id=" + _id,
    });
  },
  // 跳转到消息留言板模块
  jumpMsg: function () {
    const _id = this.data.store._id;
    wx.navigateTo({
      // url: "../message/message?id=" + _id,
      url: "../msgpage/msgpage?id=" + _id,
    });
  },
  deleteItem: function (e) {
    wx.showModal({
      title: "删除确认",
      content: "您真的要删除" + this.data.store.title + "么？",
      success: (res) => {
        if (res.confirm) {
          store
            .doc(this.data.store._id)
            .remove()
            .then((res) => {
              wx.showToast({
                title: "删除成功",
                icon: "success",
                success: (res) => {
                  wx.navigateBack({
                    delta: 2,
                  });
                },
              });
            })
            .catch((error) => {
              wx.showToast({
                title: "删除失败！请添加小程序开发者微信 排查问题",
              });
            });
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },
});
