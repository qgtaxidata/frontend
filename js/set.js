define(["require", "tools"], function (require) {

  let tools = require('tools');  

  let setCon = document.getElementsByClassName('set')[0];
  let timeSet = setCon.getElementsByClassName("time-value")[0];
  let timeNow = setCon.getElementsByClassName("time-now")[0];
  let setClick  = setCon.getElementsByTagName("button")[0];

  let reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
  let regExp = new RegExp(reg);

  timeSet.value = "请设置当前时间"; 
  new Picker(timeSet, {
    container: '.set .time-picker',
    date: allTimeNow,
    format: '2017-02-DD HH:mm:ss',
    inline: true,
    rows: 1,
    text: {
      title: '',
      cancel: '',
      confirm: '',
    }
  });

  timeNow.value = tools.formatTime(allTimeNow)
  setInterval(function() {
    timeNow.value = tools.formatTime(allTimeNow);
  }, 1000);

  setClick.onclick = function() {

    let timeValue = timeSet.value;

    if(!regExp.test(timeValue)){
      alert("请选择一个时间!");
      return;
    }    

    if(confirm(`你确定将当前时间设为 ${timeValue} 吗？`)) {
      timeDiffer = Date.now() - (new Date(timeValue)).getTime(); 
      alert("修改时间成功");
    } else {
      alert("取消成功");
    }
  }


});