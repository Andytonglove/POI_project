const app = getApp();
const config = require("../../config.js");
const db = wx.cloud.database();
const store = db.collection("store");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    stores: {},
    occurpyProblemNumber: 2,
    errorProblemNumber: 1,
    designProblemNumber: 3,
    longitude: config.center_longitude,
    latitude: config.center_latitude,
    windowHeight: 600,
    mapSubKey: config.mapSubKey,
    hideMe: true,
    showAdmin: false,
    windowHeight: app.globalData.windowHeight,
    defaultScale: config.default_scale,
    done: true,
    workType: false,
    searchValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.goToIntro()
    let showAdmin = config.show_admin ? true : false;
    if (app.globalData.showAdmin) {
      showAdmin = true;
    }
    this.setData({
      showAdmin: showAdmin,
    });
    this.getOpenID();
    this.getCenterLocation();
    this.getMarkerData();
    this.data.mapCtx = wx.createMapContext("map");
    wx.showToast({
      title: "双指缩放可以调整地图可视区域",
      icon: "none",
    });
  },

  /**
   * 生命周期函数--监听页面的显示
   */

  onShow: function () {
    this.setData({
      workType: app.globalData.is_verifier,
    });
    this.getMarkerData();
    this.isdone();
  },

  goToIntro: function () {
    try {
      const res = wx.getStorageSync('isNotShowIntroduction');
      console.log("isNotShowIntroduction缓存内容", res);
      if (res) {
        console.log("不需要展示引导");
      } else {
        console.log("需要展示引导");
        wx.navigateTo({
          url: "../index/index",
        });
      }
    } catch (e) {
      console.log("缓存不支持", e);
    }
  },

  getMarkerData: function () {
    wx.showLoading({
      title: "数据加载中...",
    });

    wx.cloud
      .callFunction({
        name: "getStore",
      })
      .then((res) => {
        console.log("云函数获取store", res.result)
        if (res.result.errMsg = "collection.get:ok") {
          let data = res.result.data;
          /**
           * 处理 occurpyProblemNumber,errorProblemNumber,designProblemNumber
           */
          let occurpyProblemNumber = 0;
          let errorProblemNumber = 0;
          let designProblemNumber = 0;
          res.result.data.forEach((item) => {
            // 这里将盲道改成兴趣点 可能出现bug和其他修改需求
            if (item.problemLabel === "兴趣点破损") {
              errorProblemNumber++;
            } else if (item.problemLabel === "兴趣点占用") {
              occurpyProblemNumber++;
            } else if (item.problemLabel === "兴趣点设计") {
              designProblemNumber++;
            }
          });

          this.setData({
            occurpyProblemNumber,
            errorProblemNumber,
            designProblemNumber,
          });

          /***
           * 处理marker
           * 将 _id 给 id ,确保 marker 事件的正确触发
           */
          data.map((item, index) => {
            item.id = index;
            item.width = 20;
            item.height = 25;
            item.title = item.problemLabel;
            // item.customCallout = {
            //   anchorX: 0,
            //   anchorY: -20,
            //   display: "BYCLICK"
            // }
          });
          this.setData({
            stores: data,
          },
            () => {
              wx.hideLoading();
            }
          );
        } else {
          () => {
            wx.showToast({
              title: '获取数据失败',
            })
            wx.hideLoading();
          }
        }
      });
  },

  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      wx.cloud
        .callFunction({
          name: "checkUserAuth",
        })
        .then((res) => {
          if (res.result.data.is_administrator) {
            app.globalData.is_administrator = true;
            wx.showModal({
              title: "管理员登陆成功",
              content: "管理员您好，是否要进入新增界面？",
              success: (res) => {
                if (res.cancel == false && res.confirm == true) {
                  wx.navigateTo({
                    url: "../add/add",
                  });
                } else {
                  wx.showToast({
                    title: "您可以点击下方查看全部按钮管理已有数据",
                    icon: "none",
                  });
                }
              },
            });
          } else {
            wx.showToast({
              title: "您不是管理员，无法进入管理入口！",
              icon: "none",
            });
          }
        });
    } else {
      // 处理未授权的场景
      wx.showModal({
        title: "授权失败",
        content: "您尚未授权获取您的用户信息，是否开启授权界面？",
        success: (res) => {
          if (res.confirm) {
            wx.openSetting({});
          }
        },
      });
    }
  },

  /**
   * 获取用户经纬度
   */
  getCenterLocation: function () {
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });
        console.log(
          "当前中心点的位置：",
          this.data.longitude,
          this.data.latitude
        );
      },
      fail: (err) => {
        wx.showToast({
          title: "请确认你的手机GPS定位已经打开",
          icon: "fail",
        });
        console.log("err", err);
      },
    });
  },
  getOpenID: function (event) {
    wx.cloud
      .callFunction({
        name: "getUserOpenId",
      })
      .then((res) => {
        try {
          wx.setStorageSync("openId", res.result.openid);
        } catch (e) {
          console.log("openID储存成功", res);
        }
      });
  },
  hideMe: function (res) {
    this.setData({
      hideMe: true,
    });
  },
  showAdmin: function (res) {
    wx.setStorage({
      key: "showAdmin",
      data: !this.data.showAdmin,
    });
    this.setData({
      showAdmin: !this.data.showAdmin,
    });
  },
  search: function () {
    wx.navigateTo({
      url: "../search/search",
    });
  },
  /**
   * 一些页面跳转
   */
  onMarkerTap: function (event) {
    console.log("marker点击", event);
    const index = event.detail.markerId;
    const _id = this.data.stores[index]._id;
    wx.navigateTo({
      url: "../info/info?id=" + _id,
    });
  },
  viewAll: function () {
    wx.navigateTo({
      url: "../list/list",
    });
  },

  viewMyList: function () {
    wx.navigateTo({
      url: "../myList/myList",
    });
  },

  addMarker: async function () {
    const nickName = wx.getStorageSync('nickName')
    if (!nickName) {
      wx.getUserProfile({
        desc: '用于记录上传者信息',
        success: (res) => {
          this.setData({
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
          })
          wx.setStorageSync("avatarUrl", res.userInfo.avatarUrl);
          wx.setStorageSync("nickName", res.userInfo.nickName);
          wx.navigateTo({
            url: "../add/add",
          });
        }
      })
    } else {
      wx.navigateTo({
        url: "../add/add",
      });
    }
  },

  goArticle: function () {
    wx.navigateTo({
      url: "../article/article",
    });
  },

  searchLocation: function () {
    wx.navigateTo({
      url: "../search/search",
    });
  },

  helpButton: function () {
    wx.navigateTo({
      url: "../index/index",
    });
  },

  onSearch: function (e) {
    this.setData({
      searchValue: e.detail
    })
    wx.navigateTo({
      url: "../search/search?keywords="+this.data.searchValue,
    });
  },

  // 待办事项列表跳转
  openTodoList: function () {
    if(!this.data.done){
      wx.showModal({
        title: "兴趣点核验消息通知",
        content: "您的兴趣点有核验更新消息，是否要进入查询界面？",
        success: (res) => {
          if (res.cancel == false && res.confirm == true) {
            if (!this.data.done) {
              wx.navigateTo({
                url: "../todos/todos",
              });
            } else {
              wx.showToast({
                title: "您目前没有新待办任务通知！",
                icon: "none",
              });
            }
          } else {
            wx.showToast({
              title: "您可以通过下方筑路日志按钮查看已有提交信息",
              icon: "none",
            });
          }
        },
      });
    }else{
      wx.showToast({
        title: "您目前没有新待办任务通知！享受生活吧~",
        icon: "none",
      });
    }

  },
  // 判断是否有待办事项
  isdone: function () {
    if (this.data.workType) {
      store.where({
        isChecked: 0,
      })
        .count().then(res => {
          if (res.total != 0) {
            this.setData({
              done: false,
            });
          } else {
            this.setData({
              done: true,
            });
          }
        })
    } else {
      const openId = wx.getStorageSync("openId");
      store.where({
        _openid: openId,
        isChecked: 2,
      })
        .count().then(res => {
          if (res.total != 0) {
            this.setData({
              done: false,
            });
          } else {
            this.setData({
              done: true,
            });
          }
        })
    }
  },
  // 采集者、核验者转换
  transWorkType: function () {
    wx.showModal({
      title: "转换身份消息通知",
      content: "是否确定转换身份？",
      success: (res) => {
        if (res.cancel == false && res.confirm == true) {
          this.setData({
            workType: !(this.data.workType),
          });
          app.globalData.is_verifier = this.data.workType;
          this.isdone();// 判断转换后身份是否有待办
          if (this.data.workType) {
            wx.showToast({
              title: "您已经转换身份为核验者！",
              icon: "none",
            });
          } else {
            wx.showToast({
              title: "您已经转换身份为采集者！",
              icon: "none",
            });
          }
        }
      },
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "我在POI地图上标记了一处兴趣点问题，你也快来加入我们吧",
      path: "/pages/map/map",
      imageUrl: "https://6d61-map-4g0ciu1x80002ab0-1305236624.tcb.qcloud.la/share/share-pre.jpg?sign=d0236b01a9f4f1255d06109ef4a3fa91&t=1618313697",
    };
  },
  /**
   * 用户分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: "我在POI地图上标记了一处兴趣点问题，你也快来加入我们吧",
      path: "/pages/map/map",
      imageUrl: "https://6d61-map-4g0ciu1x80002ab0-1305236624.tcb.qcloud.la/share/share-pre.jpg?sign=d0236b01a9f4f1255d06109ef4a3fa91&t=1618313697",
    };
  },
});