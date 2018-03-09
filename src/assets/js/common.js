/**
 * Created by Administrator on 2017/7/26.
 */



// (function () {
//   var ie = !!(window.attachEvent && !window.opera);
//   var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
//   var fn = [];
//   var run = function () { for (var i = 0; i < fn.length; i++) fn[i](); };
//   var d = document;
//   d.ready = function (f) {
//     if(!ie && !wk && d.addEventListener){
//       return d.addEventListener('DOMContentLoaded', f, false);
//     }
//     if(fn.push(f) > 1){ return; }
//     if(ie){
//       (function () {
//         try { d.documentElement.doScroll('left'); run(); }
//         catch (err) { setTimeout(arguments.callee, 0); }
//       })();
//     }else if(wk){
//       var t = setInterval(function () {
//         if (/^(loaded|complete)$/.test(d.readyState)){
//           clearInterval(t);
//           run();
//         }
//       }, 0);
//     }
//   };
// })();

function formatTime(value,type,separator) {
  let T,Time;
  if(separator===undefined){
    separator = '-'
  }
  if(value===undefined || value===''){
    T = new  Date()
  }else {
    T = new Date(value)
  }
  let year = T.getFullYear();
  let mon  = T.getMonth()+1<10?'0'+(T.getMonth()+1):T.getMonth()+1;
  let date = T.getDate()<10?'0' + T.getDate():T.getDate();
  let hour = T.getHours()<10?'0' + T.getHours():T.getHours();
  let min  = T.getMinutes()<10?'0'+T.getMinutes():T.getMinutes();
  let sec  = T.getSeconds()<10?'0'+T.getSeconds():T.getSeconds();

  if(type==='long'){
    Time = year + separator + mon + separator + date + ' ' + hour + ':' + min +':' + sec
  }
  if(type==='middle'){
    Time = year + separator + mon + separator + date + ' ' + hour + ':' + min
  }
  if(type==='sort'||type===undefined){
    Time = year + separator + mon + separator + date
  }
  return Time
}


var regEmail = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式 邮箱格式验证
var regExpEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;

function IdCodeValid(code){
  //身份证号合法性验证
  //支持15位和18位身份证号
  //支持地址编码、出生日期、校验位验证
  let city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
  let row={
    'pass':true,
    'msg':'验证成功'
  };
  if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(code)){
    row={
      'pass':false,
      'msg':'身份证号格式错误'
    };
  }else if(!city[code.substr(0,2)]){
    row={
      'pass':false,
      'msg':'身份证号地址编码错误'
    };
  }else{
    //18位身份证需要验证最后一位校验位
    if(code.length === 18){
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
      //校验位
      let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i++)
      {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      if(parity[sum % 11].toString() !== code[17].toUpperCase()){
        row={
          'pass':false,
          'msg':'身份证号校验位错误'
        };
      }
    }
  }
  return row;
}
export default {
  IdCodeValid,
  formatTime
}
