// miniprogram/pages/detail/detail.js

const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    isFriend: false,
    isHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 此处之前用到onReady生命周期函数造成代码冗余
    // console.log(options);
    let userId = options.userId;
    console.log(userId);
    if (userId) {
      db.collection('users').doc(userId).get().then((res)=>{
        this.setData({
          detail : res.data
        });
        let friendList = res.data.friendList;
        if (friendList.includes(app.userInfo._id) ){
          this.setData({
            isFriend : true
          });
        }
        else{
          this.setData({
            isFriend : false
          },()=>{
            if ( userId == app.userInfo._id ){
              this.setData({
                isFriend : true,
                isHidden : true
              });
            }
          });
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // let userId;
    // const eventChannel = this.getOpenerEventChannel();
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // eventChannel.on('userId', function (data) {
    //   userId = data.data;
    // });
    // db.collection("users").doc(userId).get().then(res => {
    //   this.setData({
    //     detail: res.data
    //   });
    //   let friendList = res.data.friendList;
    //   if (friendList.includes(app.userInfo._id)) {
    //     this.setData({
    //       isFriend: true
    //     });
    //   } else {

    //   }
    // });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  handleAddFriend() {
    if (app.userInfo._id) {
      db.collection('message').where({
        userId: this.data.detail._id
      }).get().then((res) => {
        if (res.data.length) { // 更新
          if (res.data[0].list.includes(app.userInfo._id)) {
            wx.showToast({
              title: '已申请过!'
            })
          } else {
            wx.cloud.callFunction({
              name: 'update',
              data: {
                collection: 'message',
                where: {
                  userId: this.data.detail._id
                },
                data: `{list : _.unshift('${app.userInfo._id}')}`
              }
            }).then((res) => {
              wx.showToast({
                title: '申请成功~'
              })
            });
          }
        } else { // 添加 
          db.collection('message').add({
            data: {
              userId: this.data.detail._id,
              list: [app.userInfo._id]
            }
          }).then((res) => {
            wx.showToast({
              title: '申请成功'
            })
          });
        }
      });
    } else {
      wx.showToast({
        title: '请先登录',
        duration: 2000,
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/user/user'
            })
          }, 2000);
        }
      });
    }
  }
})