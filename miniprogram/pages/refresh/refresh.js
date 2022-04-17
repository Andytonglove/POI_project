// pages/refresh/refresh.js
const app = getApp();
const db = wx.cloud.database();
const store = db.collection("store");
const userInfo = db.collection("userInfo");
const _ = db.command;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    problemLabel: "",
    images: [],
    content: "",
    iconPath: "",
    titleColor: {
      address: "black",
      problemLabel: "black",
      images: "black",
      type: "black"
    },
    isChecked: 0,
    showPicker: false,
    type: "",
    columnsType: ["餐饮","购物","住宿","出行","文体娱乐","金融服务","生活服务","汽车服务","教育","医疗","房产","旅游","企事业单位","行政机构","公共服务设施","其他"],
    showReason: false // 是否显示驳回理由
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中...",
    });
    // 获取原来的信息并进行更新
    store
      .doc(options.id)
      .get()
      .then((res) => {
        this.setData(
          {
            store: res.data,
            // 这里赋值一些默认初始值，测试通过（除地点要重新选取）
            isChecked: res.data.isChecked,
            address: res.data.address,
            problemLabel: res.data.problemLabel,
            type: res.data.type
          },
          (res) => {
            if(this.data.isChecked==2){
              this.setData({
                showReason: true,
              })
            }
            wx.hideLoading();
          }
        );
      });
  },

  chooseLocation: function (event) {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting["scope.userLocation"]) {
          wx.authorize({
            scope: "scope.userLocation",
            success: (res) => {
              wx.chooseLocation({
                success: (res) => {
                  this.setData({
                    // address: `${res.address} ${res.name}`,
                    address: `${res.name}`,
                    latitude: res.latitude,
                    longitude: res.longitude,
                  });
                },
              });
            },
          });
        } else {
          wx.chooseLocation({
            success: (res) => {
              this.setData({
                // address: `${res.address} ${res.name}`,
                address: `${res.name}`,
                latitude: res.latitude,
                longitude: res.longitude,
              });
            },
          });
        }
      },
    });
  },

  createUserInfo: async function () {
    const openId = wx.getStorageSync("openId");
    const res = await userInfo.where({
      _openid: openId
    }).count();
    // 不存在就创建用户并设置用编号
    if (!res.total) {
      const res2 = await userInfo.where({
        _openid: _.exists(true)
      }).count();
      console.log("当前总用户数", res2.total);
      userInfo
        .add({
          data: {
            id: res2.total + 1,
            nickName: wx.getStorageSync("nickName") || "",
            avatarUrl: wx.getStorageSync("avatarUrl") || "",
            openId,
          },
        })
        .then((res) => {
          console.log("创建用户成功", res);
        });
    }
  },

  updateItem: function (event) {
    this.setData({
      titleColor: {
        address: (!this.data.address || !this.data.longitude) ? "red" : "black",
        problemLabel: !this.data.problemLabel ? "red" : "black",
        type: !this.data.type ? "red" : "black",
        images: !this.data.images.length ? "red" : "black",
      }
    })
    if (!this.data.address || !this.data.longitude || !this.data.problemLabel || !this.data.images.length || !this.data.type) {
      wx.showToast({
        title: "缺少必填项",
        icon: "error",
      });
    } else {
      wx.showLoading({
        title: "上传数据中...",
      });
      this.createUserInfo();
      // 这里要改成更新该点的数据
      store
        .where({
          _id: this.options.id,
        })
        .update({
          data: {
            createTime: new Date(),
            address: this.data.address,
            longitude: this.data.longitude,
            latitude: this.data.latitude,
            problemLabel: this.data.problemLabel,
            iconPath: this.data.iconPath,
            images: this.data.images,
            content: event.detail.value.content,
            // 这里暂时以覆盖上一次的数据为更新操作
            userName: wx.getStorageSync('nickName'),
            isChecked: 0, // 1或3再改成0，需要重新核验
            type: this.data.type,
          },
        })
        .then((res) => {
          wx.hideLoading();
          wx.showToast({
            title: "更新成功！",
            icon: "success",
            success: (res) => {
              wx.navigateTo({
                url: "../share/share",
              });
            },
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  },

  // 兴趣点类型
  showPopupPicker: function () {
    this.setData({
      showPicker: true
    })
  },

  onConfirmType: function (event) {
    console.log("已确认，您选择的选项类型为"+event.detail.value)
    this.setData({
      type: event.detail.value,
      showPicker: false
    })
  },

  onCancelType: function (event) {
    this.setData({
      showPicker: false
    })
    console.log("取消：关闭弹出窗口")
  },

  onCloseType: function () {
    this.setData({
      showPicker: false
    })
  },

  onChangeType: function (e) {
    console.log("您改变了选项为"+e.detail.value)
  },

  uploadImage: function (e) {
    wx.chooseImage({
      count: 2,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {

        wx.showLoading({
          title: '上传中'
        })
        let tempFilePaths = res.tempFilePaths
        let items = [];
        for (const tempFilePath of tempFilePaths) {
          items.push({
            src: tempFilePath
          })
        }
        const uploadTask = items.map(item => this.uploadPhoto(item.src))

        Promise.all(uploadTask).then(result => {

          let urls = this.data.images;
          for (const file of result) {
            urls.push(file.fileID);
          }
          this.setData({
            images: urls
          }, res => {
            wx.hideLoading();
            wx.showToast({
              title: '上传图片成功',
              icon: 'success'
            })
          })
        }).catch(() => {
          wx.hideLoading()
          wx.showToast({
            title: '上传图片错误',
            icon: 'error'
          })
        })

        this.setData({
          tempPhoto: items
        })
      }
    })
  },
  uploadPhoto(filePath) {
    return wx.cloud.uploadFile({
      cloudPath: `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.png`,
      filePath
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.images,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '确定要删除这个图片吗？',
      cancelText: '保留',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.images.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            images: this.data.images
          })
        }
      }
    })
  },

  onChangeRadio(event) {
    const problemLabel = event.detail;
    let iconPath = "";
    switch (problemLabel) {
      case "兴趣点占用":
        iconPath = "../../images/marker/occupy.png";
        break;

      case "兴趣点设计":
        iconPath = "../../images/marker/design.png";
        break;

      default:
        iconPath = "../../images/marker/error.png";
        break;
    }
    this.setData({
      problemLabel,
      iconPath,
    });
  },
  goToArticle: function () {
    wx.navigateTo({
      url: '../article/article',
    })
  }
});