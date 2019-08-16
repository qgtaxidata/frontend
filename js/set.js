define(["require", "tools"], function (require) {

  let tools = require('tools');  

  let setCon = document.getElementsByClassName('set')[0];
  let timeSet = setCon.getElementsByClassName("time-value")[0];
  let timeNow = setCon.getElementsByClassName("time-now")[0];
  let setClick  = setCon.getElementsByTagName("button")[0];
  let clickJudge = true;

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
    if (!clickJudge) {
      return;
    }
    clickJudge = false;
    setTimeout(function() {
      clickJudge = true;
    }, 1000)

    let timeValue = timeSet.value;
    timeDiffer = Date.now() - (new Date(timeValue)).getTime(); 
    console.log("修改时间成功");
  }
});