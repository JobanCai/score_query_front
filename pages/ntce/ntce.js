// pages/ntce/ntce.js
import Toast from '@vant/weapp/toast/toast';
var utilMd5 = require('../../utils/md5.js');  
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        id_card: '',
        yzm: '',
        isOK: false,
        cookie_str: '',
        writtenTableHeader: [
            {
              prop: '科目',
              width: 200,
              label: '科目',
              color: '#55C355'
            },
            {
              prop: '报告分',
              width: 100,
              label: '分数'
            },
            {
              prop: '合格与否',
              width: 130,
              label: '合格与否'
            },
            {
              prop: '考试批次',
              width: 150,
              label: '考试批次'
            }
          ],
          interviewTableHeader: [
            {
              prop: '科目',
              width: 150,
              label: '科目',
              color: '#55C355'
            },
            {
              prop: '合格与否',
              width: 130,
              label: '合格与否'
            },
            {
              prop: '考试省份',
              width: 150,
              label: '考试省份'
            },
            {
              prop: '考试批次',
              width: 150,
              label: '考试批次'
            }
          ],
          stripe: true,
          border: true,
          outBorder: true,
          writtenRow: [],
          interviewRow: [],
          msg: '暂无数据'
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      this.onYzm();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    onYzm: function() {
      var url = app.globalData.domain + '/ntce/yzm';
      console.log(url);
      var that = this;
      wx.request({
        url: url,
        method: 'GET',
        complete(res) {
          that.setData({
            'yzm': res.data.yzm_str,
            'cookie_str': res.data.cookie_str
          });
        }
      });
    },
    onQuery: function() {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
        if(reg.test(this.data.id_card) === false) {
            Toast('身份证输入不合法');
            return;
        }
        var url = app.globalData.domain + '/ntce/query';
        var that = this;
        var param_str = that.data.id_card + '&' + that.data.name + '&' + that.data.yzm + '&' + app.globalData.key
        var sign = utilMd5(param_str)
        wx.request({
          url: url,
          method: 'POST',
          header: {
            'cookie_str' : that.data.cookie_str
          },
          data: {
            'id_card': that.data.id_card,
            'name': that.data.name,
            'yzm': that.data.yzm,
            'sign': sign
          },
          complete(res) {
            if('Y' == res.data.isOk) {
              that.setData({
                'isOK': true,
                'writtenRow': res.data.data.written_test,
                'interviewRow': res.data.data.interview
              })
            } else{
              Toast('暂无数据~');
            }
          }
        })
    },
    sign: function() {

    }

})