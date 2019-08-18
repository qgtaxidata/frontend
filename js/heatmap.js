define(["require", "tools"], function (require) {

  let tools = require('tools');  

  function isSupportCanvas() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }
  if (!isSupportCanvas()) {
    alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
  }

  // 热力图按钮容器
  let heatmapCon = document.getElementsByClassName('heatmap')[0]; 
  // 监控热力图时段选择
  let onHmapPrd = "time-now";
  // 热力图时段按钮容器
  let hmapPrd = heatmapCon.getElementsByClassName('time-choice')[0];
  // 热力图时间选择器容器
  let hmapPicker = heatmapCon.getElementsByClassName('time-picker')[0];
  // 热力图时间判断
  let hmapJudge = heatmapCon.getElementsByClassName('time-judge')[0];
  // 热力图请求判断
  let hmapButJudge = heatmapCon.getElementsByClassName('button-judge')[0];
  // 监控热力图状态
  let heatmapStatus = "hide";
  // 实时热力图时间监控
  let controlTime;
  // 按钮点击频率监控
  let heatmapClickJudge = true;
  // 显示热力图
  let heatmapShow = document.getElementsByClassName('heatmap-show')[0];
  // 隐藏热力图
  let heatmapHide = document.getElementsByClassName('heatmap-hide')[0];
  // 钟表时间监控
  let hmapTimeId;
  // 时间input节点
  let heatmapTime = heatmapCon.getElementsByClassName('time-value')[0];
  // 选择地区容器
  let regCon = heatmapCon.getElementsByClassName('region-choice')[0];
  // 选择的地区
  let regValue = regCon.getElementsByClassName('region-value')[0];
  // 区域列表下拉和上拉
  let regChoice = regCon.getElementsByTagName('img');
  // 选择地区列表
  let regList = regCon.getElementsByTagName('ul')[0];
  // 选择算法容器
  let algCon = heatmapCon.getElementsByClassName('algorithm-choice')[0];
  // 选择的算法
  let algValue = algCon.getElementsByClassName('algorithm-value')[0];
  // 算法列表下拉和上拉
  let algChoice = algCon.getElementsByTagName('img');
  // 选择算法列表
  let algList = algCon.getElementsByTagName('ul')[0];
  // 热力图数据分析分析按钮
  let regAnaly = heatmapCon.getElementsByClassName('analyse')[0]; 

  for(let i = 0; i < hmapPrd.children.length; i++) {
    // 时段按钮事件绑定
    hmapPrd.children[i].onclick = function() { 
      if (heatmapStatus == "show") {
        hmapButJudge.innerText = "请先取消热力图显示";
        heatmapHide.classList.add("heatmap-cancel");
        return;
      }
      hmapPrd.getElementsByClassName(onHmapPrd)[0].classList.remove("time-onChoose");
      event.target.classList.add("time-onChoose");
      onHmapPrd = event.target.classList[0];
      creatTime();
      if (onHmapPrd == "time-future") {
        algCon.style.display = "block";
      } else {
        algCon.style.display = "none";
      }
      if (regValue.value != "全广州" && onHmapPrd == "time-now") {
        regAnaly.style.display = "block";
      } else {
        regAnaly.style.display = "none";
      }
    }
  }
  
  // 根据时段创造时间选择器
  function creatTime() {
    if (onHmapPrd == "time-now") {// 现在，禁止时间选择器
      hmapPicker.style.display = "none";
      if (hmapTimeId) {
        clearInterval(hmapTimeId);
      }
      // 生成钟表，监控现在时间
      hmapTimeId = setInterval(function() {
        heatmapTime.value = tools.formatTime(allTimeNow);
      }, 1000);
    } else { // 过去/未来，创造对应时间选择器
      if (hmapTimeId) {
        clearInterval(hmapTimeId);
      }
      hmapPicker.style.display = "block";
      new Picker(heatmapTime, {
        container: '.heatmap .time-picker',
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
      if (onHmapPrd == "time-pass") {
        heatmapTime.value = "请选择过去的时间";
      } else {
        heatmapTime.value = "请选择未来的时间";
      }
    } 
  }
  // 默认创造当前时间
  creatTime();

  // 地区选择列表下拉上拉事件程序处理函数
  function showRegList() {
    if (heatmapStatus == "show") {
      hmapButJudge.innerText = "请先取消热力图显示";
      heatmapHide.classList.add("heatmap-cancel");
      return;
    }
    if (regList.title == "hiden") {
      regList.setAttribute('style', "height: 15rem;padding-top: 1.5rem");
      regList.title = "show";
      regChoice[0].style.display = "none";
      regChoice[1].style.display = "block";
    } else {
      regList.setAttribute('style', "height: 0;");
      regList.title = "hiden";
      regChoice[0].style.display = "block";
      regChoice[1].style.display = "none";
    }
  }
  regChoice[0].onclick = showRegList;
  regChoice[1].onclick = showRegList;
  // 算法选择列表下拉上拉事件程序处理函数
  function showAlgList() {
    if (heatmapStatus == "show") {
      hmapButJudge.innerText = "请先取消热力图显示";
      heatmapHide.classList.add("heatmap-cancel");
      return;
    }
    if (algList.title == "hiden") {
      algList.setAttribute('style', "height: 5.7rem;padding-top: 1rem");
      algList.title = "show";
      algChoice[0].style.display = "none";
      algChoice[1].style.display = "block";
    } else {
      algList.removeAttribute('style');
      algList.title = "hiden";
      algChoice[0].style.display = "block";
      algChoice[1].style.display = "none";
    }
  }
  algChoice[0].onclick = showAlgList;
  algChoice[1].onclick = showAlgList;
  // 地区选择事件程序处理函数
  for (let i = 0; i < regList.children.length; i++) {
    regList.children[i].onclick = function () {
      regValue.value = event.target.innerText;
      regValue.setAttribute('tle', event.target.getAttribute('tle'));
      showRegList();
      if (event.target.innerText == "全广州") {
        changeView("广州");
      } else {
        changeView(event.target.innerText);
      }
      
      if (event.target.innerText != "全广州" && onHmapPrd == "time-now") {
        regAnaly.style.display = "block";
      } else {
        regAnaly.style.display = "none";
      }
    }
  }
  // 算法选择事件程序处理函数
  for (let i = 0; i < algList.children.length; i++) {
    algList.children[i].onclick = function () {
      algValue.value = event.target.innerText;
      algValue.setAttribute('tle', event.target.getAttribute('tle'));
      showAlgList();
    }
  }


  map.plugin("AMap.DistrictSearch");
  var opts = {
    extensions: 'all',      
  };
  let polygons = [];
  // 跳转视图
  function changeView(districtName) {
    for (let i = 0; i < polygons.length; i++) {
      polygons[i].setMap(null);
    }
    polygons = [];
    var district = new AMap.DistrictSearch(opts);
    district.search(districtName, function(status, result) {
      if(status=='complete'){
        getData(result.districtList[0]);
          // var position = [result.districtList[0].center.lng, result.districtList[0].center.lat];
          // var marker = new AMap.Marker({position : position});
          // map.add(marker);
        }
      });
    setTimeout(function() {
      map.setFitView();
    }, 500);
  }
  function getData(data) {
    var bounds = data.boundaries;
    if (bounds) {
      for (var i = 0; i < bounds.length; i ++) {
        var polygon = new AMap.Polygon({
          map: map,
          strokeWeight: 0,
          strokeColor: 'rgba(1, 1, 1, 0)',
          fillColor: '#80d8ff',
          fillOpacity: 0,
          path: bounds[i]
        });
        polygons.push(polygon);
      }
      map.setFitView();
    }
  }
    


  let heatmap;
  map.plugin(["AMap.Heatmap"], function(){
    heatmap = new AMap.Heatmap(map, {
      radius: 25, 
      opacity: [0, 0.5],
      gradient: {
        0.5: 'rgb(0, 0, 255)',
        0.65: 'rgb(117, 211, 248)',
        0.7: 'rgb(0, 255, 0)',
        0.9: 'rgb(255, 234, 0)',
        1.0: 'rgb(255, 0, 0)'
      }
    });
  });
  
  
  function hmapNowPass() {
    let area = regValue.getAttribute('tle');
    let time = heatmapTime.value;

    let reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
    let regExp = new RegExp(reg);
    if(!regExp.test(time)){
      hmapJudge.innerText = "请选择一个时间";
      heatmapTime.setAttribute("class", "time-value time-error");
      // alert("请选择一个时间");
      return false;
    }

    let timeDiffer = allTimeNow.getTime() - (new Date(time)).getTime();
    console.log("时间为差值", timeDiffer/1000 + "s");
    
    if (timeDiffer < 0 && onHmapPrd == "time-pass") {
      hmapJudge.innerText = "请选择过去的时间";
      // alert("请选择过去的时间");
      heatmapTime.setAttribute("class", "time-value time-error");
      return false;
    }

    let send = {
      area: area,
      time : tools.formatTime(allTimeNow)
    } 
    console.log(send);
   //  $.ajax({
   //    url: serverUrl + `/thermoDiagram/getAreaMap`,
   //    method: "GET",
   //    data: send,
   //    // contentType: false,
   //    dataType: "json",
   //    headers: {
   //     "Content-Type": "application/json"
   //   },
   //   async: false,
   //   "crossDomain": true,
   //   success: function (data) {
   //     console.log(data.data);
   //     if (data.msg == "success") {    	      	
   //       heatmap.setDataSet({
   //         data: data.data
   //       });   	      	
   //     } else {
   //       alert(data.msg);
   //     }
   //   }
   // })
    return true;
  }
  function hmapFuture() {
    let area = regValue.getAttribute('tle');
    let algorithm = algValue.getAttribute('tle');
    let futureTime = heatmapTime.value;
    let nowTime = tools.formatTime(allTimeNow);

    let reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
    let regExp = new RegExp(reg);
    if(!regExp.test(futureTime)){
      hmapJudge.innerText = "请选择一个时间";
      heatmapTime.setAttribute("class", "time-value time-error");
      return false;
    }

    let timeDiffer = (new Date(futureTime)).getTime() - allTimeNow.getTime();
    console.log("时间为差值", timeDiffer/1000 + "s");
    
    if ( timeDiffer < 0) {
      hmapJudge.innerText = "请选择未来的时间";
      heatmapTime.setAttribute("class", "time-value time-error");
      return false;
    }
    let send = {
      area: area,
      algorithm: algorithm,
      futureTime: futureTime,
      nowTime : nowTime
    } 

    console.log(send);
 
    // $.ajax({
    // url: serverUrl + "/thermoDiagram/getFutureMap",
    // method: "GET",
    // data: send,
    // dataType: "json",
    // headers: {
    //  "Content-Type": "application/json"
    // },
    //  async: false,
    // "crossDomain": true,
    // success: function (data) {
    //    console.log(data.data);
    //    if (data.msg == "success") {             
    //      heatmap.setDataSet({
    //        data: data.data
    //      });            
    //    } else {
    //      alert(data.msg);
    //    }
    //  }
    // })
    return true;
  }
   
  
  
  // 显示热力图
  heatmapShow.onclick = function() {
    if (!heatmapClickJudge) {
      return;
    }
    heatmapClickJudge = false;
    setTimeout(function() {
      heatmapClickJudge = true;
    }, 3000);

    if (onHmapPrd == "time-future") {
      if(!hmapFuture()) {
        return;
      }
    } else if (onHmapPrd == "time-pass"){
      if(!hmapNowPass()) {
        return;
      }
    } else {
      if(!hmapNowPass()) {
        return;
      }
      controlTime = setInterval(function() {
        hmapNowPass();
      }, 2000);
    }
    heatmap.show();
    changeStaus();// 换状态
  }
  // 隐藏热力图
  heatmapHide.onclick = function() {
    if (!heatmapClickJudge) {
      return;
    }  
    heatmapClickJudge = false;
    setTimeout(function() {
      heatmapClickJudge = true;
    }, 1000);

    if (hmapButJudge.innerText != "") {
      hmapButJudge.innerText = "";
      heatmapHide.classList.remove('heatmap-cancel');
    }
    


    heatmap.hide();
    if (onHmapPrd == "time-now") {
      clearInterval(controlTime);
    } 
    changeStaus(); //  换状态  
  }
  // 换状态
  function changeStaus() {
    if (heatmapStatus == "show") {
      console.log("关闭");
      heatmapStatus = "hide";
      heatmapShow.style.display = "block";
      heatmapHide.style.display = "none";
      if (onHmapPrd != "time-now") {
        hmapPicker.style.display = "block";
      }
    } else {
      console.log("显示");
      heatmapStatus = "show";
      heatmapShow.style.display = "none";
      heatmapHide.style.display = "block";
      if (onHmapPrd != "time-now") {
        hmapPicker.style.display = "none";
      }
    }
  }

  heatmapTime.parentNode.onmouseover = function() {
    if (hmapJudge.innerText == "") {
      return;
    }
    hmapJudge.innerText = "";
    heatmapTime.setAttribute("class", "time-value time-correct");
  }
  
  regAnaly.onclick = function() {
    let formCon = document.getElementsByClassName("form-container")[0];
    formCon.style.display = "block";
    formCon.innerHTML = ""
    formCon.innerHTML += `<img title="关闭" class="form-close" src="./images/关闭.png" click="formClose"><div class="echartsCon onShow"></div>`;
    let chartCon = formCon.getElementsByClassName("onShow")[0];
    let chart =  echarts.init(chartCon);

    let area = regValue.getAttribute('tle');
    let time = heatmapTime.value;
    let send = {
      area: area,
      time: time
    }
    console.log(send);
    // $.ajax({
    //   url: serverUrl + "/AreaRequirement/analyseRequirement",
    //   method: "GET",
    //   data: send,
    //   dataType: "json",
    //   headers: {
    //    "Content-Type": "application/json"
    //   },
    //   async: false,
    //   crossDomain: true,
    //   success: function (data) {
    //     console.log(data.data);
    //     if (data.msg == "success") {
    //       chart.setOption(createOption(data.data));
    //     } else {
    //       alert(data.msg);
    //     }
    //   }
    // })


    let data = {

      "graph_data": [
      {
        "title": "一个小时前",
        "demand": 171
      },
      {
        "title": "当前时间",
        "demand": 195
      },
      {
        "title": "一个小时后",
        "demand": 330
      }
      ],
      "title": "天河区需求分析及预测"
    }
    chart.setOption(createOption(data));
  }
  function createOption(data) {
    var option = {
      title: {
        text: data.title,
      },
      tooltip: {},
      legend: {
        data:["line"],
      },
      xAxis: {
        data:[data.graph_data[0].title, data.graph_data[1].title, data.graph_data[2].title]
      },
      yAxis: {},
      series: [
        {
          name:'line',
          type:'line',
          data:[data.graph_data[0].demand, data.graph_data[1].demand, data.graph_data[2].demand]
        }
      ]
    }
    return option;
  }

});



