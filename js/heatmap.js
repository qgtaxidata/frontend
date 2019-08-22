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
  // 选择算法容器
  let algCon = heatmapCon.getElementsByClassName('algorithm-choice')[0];
  // 选择的算法
  let algValue = algCon.getElementsByClassName('algorithm-value')[0];
  // 热力图数据分析分析按钮
  let regAnaly = heatmapCon.getElementsByClassName('analyse')[0].children[1]; 
  // loading
  let fountainG = document.getElementById("fountainG");

  function liFun() {
    let input = this.getElementsByTagName("input")[0];
    input.value = event.target.innerText;
    input.setAttribute("tle", event.target.getAttribute("tle"));
    imgFun.call(this);
    if (event.target.innerText == "全广州") {
      changeView("广州");
    } else {
      changeView(event.target.innerText);
    }
    if (event.target.innerText != "全广州" && onHmapPrd == "time-now") {
      regAnaly.parentNode.style.display = "block";
    } else {
      regAnaly.parentNode.style.display = "none";
    }
  }

  function imgFun() {
    let img = this.getElementsByTagName("img")[0];
    let ul = this.getElementsByTagName("ul")[0];
    if (img.getAttribute("tle") == "xiala") {
      img.setAttribute("tle", "shouqi");
      img.setAttribute("src", "./images/shouqi.png");
      if (this.getAttribute("class") == "region-choice") {
        ul.setAttribute('style', "height: 15rem;padding-top: 1.5rem;");
      } else {
        ul.setAttribute('style', "height: 5.7rem;padding-top: 1.5rem;");
      } 
    } else {
      img.setAttribute("tle", "xiala");
      img.setAttribute("src", "./images/xiala.png");
      ul.setAttribute('style', "height: 0;");
    }
  }

  function chooseFun() {
    if (heatmapStatus == "show") {
      hmapButJudge.innerText = "请先取消热力图显示";
      heatmapHide.classList.add("heatmap-cancel");
      return;
    }
    if (event.target.nodeName == "IMG") {
      imgFun.call(this);
      event.stopPropagation();
    } else if (event.target.nodeName == "LI") {
      liFun.call(this);
      event.stopPropagation();
    }  
  }

  regCon.onclick = chooseFun.bind(regCon);
  algCon.onclick = chooseFun.bind(algCon);

  hmapPrd.onclick = function() {
    if (event.target.nodeName == "BUTTON") {
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
        regAnaly.parentNode.style.display = "block";
      } else {
        regAnaly.parentNode.style.display = "none";
      }
      event.stopPropagation();
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

  let heatmap = null;
  let option = {
    radius: 25, 
    opacity: [0, 0.5],
    gradient: {
      0.5: 'rgb(0, 0, 255)',
      0.65: 'rgb(117, 211, 248)',
      0.7: 'rgb(0, 255, 0)',
      0.9: 'rgb(255, 234, 0)',
      1.0: 'rgb(255, 0, 0)'
    }
  }
  map.plugin(["AMap.Heatmap"]); 
  
  
  
  function hmapNowPass(prd) {
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
    console.log("请求实时或历史热力图",send);
    $.ajax({
      url: serverUrl + `/thermoDiagram/getAreaMap`,
      method: "GET",
      data: send,
      // contentType: false,
      dataType: "json",
      headers: {
       "Content-Type": "application/json"
      },
      async: true,
      "crossDomain": true,
      success: function (data) {
        console.log(data.data);
        if (data.msg == "success") {
          if(prd != onHmapPrd) {
            return;
          }
          if(heatmap) {
            heatmap.hide();
            heatmap = null;
           }    	      	
          heatmap = new AMap.Heatmap(map,option);             
          heatmap.setDataSet({
            data: data.data
          });
          heatmap.show();
          fountainG.style.display = "none";   	      	
        } else {
          alert(data.msg);
          fountainG.style.display = "none";
          changeStaus();
        }
      }
    })
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

    console.log("请求未来热力图",send);
  
    $.ajax({
    url: serverUrl + "/thermoDiagram/getFutureMap",
    method: "GET",
    data: send,
    dataType: "json",
    headers: {
     "Content-Type": "application/json"
    },
     async: true,
    "crossDomain": true,
    success: function (data) {
       console.log(data.data);
       if (data.msg == "success") {
         if(heatmap) {
          heatmap.hide();
          heatmap = null;
         }
         heatmap = new AMap.Heatmap(map,option);             
         heatmap.setDataSet({
           data: data.data
         });
         heatmap.show();
         fountainG.style.display = "none";            
       } else {
         alert(data.msg);
         fountainG.style.display = "none";
         changeStaus();
       }
     }
    })
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
    }, 2000);

    if (onHmapPrd == "time-future") {
      fountainG.style.display = "block";
      if(!hmapFuture()) {
        fountainG.style.display = "none";
        return;
      }
    } else if (onHmapPrd == "time-pass"){
      fountainG.style.display = "block";
      if(!hmapNowPass(onHmapPrd)) {
        fountainG.style.display = "none";
        return;
      }
    } else {
      fountainG.style.display = "block";
      if(!hmapNowPass(onHmapPrd)) {
        fountainG.style.display = "none";
        return;
      }
      controlTime = setInterval(function() {
        hmapNowPass(onHmapPrd);
      }, 3000);
    }
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
    if(heatmap) {
      heatmap.hide();
    }
    heatmap = null;
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
  
  let analyClickJudge = true;
  regAnaly.onclick = function() {
    if (!analyClickJudge) {
      return;
    } 
    analyClickJudge = false;
    setTimeout(function() {
      analyClickJudge = true;
    }, 1000);

    let formCon = document.getElementsByClassName("form-container")[0];
    formCon.style.display = "block";
    formCon.innerHTML = ""
    formCon.innerHTML += `<img title="关闭" class="form-close" src="./images/关闭.png" click="formClose"><div class="echartsCon onShow"></div>`;
    let chartCon = formCon.getElementsByClassName("onShow")[0];
    let chart =  echarts.init(chartCon);
    chart.showLoading({
			text: '正在努力获取数据中...',
		});

    let area = regValue.getAttribute('tle');
    let time = heatmapTime.value;
    let send = {
      area: area,
      time: time
    }
    console.log(send);
    $.ajax({
      url: serverUrl + "/AreaRequirement/analyseRequirement",
      method: "GET",
      data: send,
      dataType: "json",
      headers: {
       "Content-Type": "application/json"
      },
      async: true,
      crossDomain: true,
      success: function (data) {
        console.log(data);
        if (data.msg == "success") {
          chart.setOption(createOption(data.data));
          chart.hideLoading();
        } else {
          alert(data.msg);
          chart.hideLoading();
        }
      }
    })

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

  function createOption(data) {
    var option = {
      title: {
        text: data.graph_title,
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



  function clear() {
    if (hmapButJudge.innerText != "") {
      hmapButJudge.innerText = "";
      heatmapHide.classList.remove('heatmap-cancel');
    }
    if (hmapJudge.innerText != "") {
      hmapJudge.innerText = "";
      heatmapTime.setAttribute("class", "time-value time-correct");
    }
    if (heatmap) {
      heatmap.hide();
      heatmap = null;
    }
    if (onHmapPrd == "time-now") {
      clearInterval(controlTime);
    }
    if (heatmapStatus == "show") {
      changeStaus(); 
    } 
    if (fountainG.style.display == "block") {
      fountainG.style.display = "none";
    }
    for (let i = 0; i < polygons.length; i++) {
      polygons[i].setMap(null);
    }
  }

  return {
    clear: clear
  }

});



