define(["require", "tools"], function (require) {

	let tools = require('tools');  

    // 路线可视化按钮容器
    let routeCon = document.getElementsByClassName('route')[0]; 
    // 监控路线可视化时段选择
    let onRoutePrd = "time-now";
    // 路线可视化时段按钮容器
    let routePrd = routeCon.getElementsByClassName('time-choice')[0];
    // 路线可视化时间选择器容器
    let routePicker = routeCon.getElementsByClassName('time-picker')[0];
 	// 实时路线可视化时间监控
 	let controlTime;
 	// 钟表时间监控
 	let routeTimeId;
 	// 时间input节点
 	let routeTime = routeCon.getElementsByClassName('time-value')[0];
 	// 选择地区容器
 	let regCon = routeCon.getElementsByClassName('region-choice')[0];
 	// 选择的地区
 	let regValue = regCon.getElementsByClassName('region-value')[0];
 	// 区域列表下拉和上拉
 	let regChoice = regCon.getElementsByTagName('img');
 	// 选择地区列表
     let regList = regCon.getElementsByTagName('ul')[0];
    //给三条路线添加一个计时器
    var timeout1,
    timeout2,
    timeout3
    //定义一个数组把之前之前路径生成的点都存起来
    var storepoint = new Array();
    //存放颜色的数组，用于不同路线的改变未不同的颜色
    var color = [
        "#3366cc", "#dc3912", "#aaaa11", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
        "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
        "#651067", "#329262", "#5574a6", "#3b3eac"
    ];
    //存放路线轨迹的数组
    var pathSimplifierIns = new Array()
    //获得loading和画面
    var loading = document.getElementById("fountainG");

    

 	for(let i = 0; i < routePrd.children.length; i++) {
    	// 时段按钮事件绑定
    	routePrd.children[i].onclick = function() { 
    		routePrd.getElementsByClassName(onRoutePrd)[0].classList.remove("time-onChoose");
    		event.target.classList.add("time-onChoose");
    		onRoutePrd = event.target.classList[0];
    		creatTime();
    	}
    }
    // 根据时段创造时间选择器
    function creatTime() {
	    if (onRoutePrd  == "time-now") {	// 现在，禁止时间选择器
	    	routePicker.style.display = "none";
	    	if (routeTimeId) {
	    		clearInterval(routeTimeId);
	    	}
	      	// 生成钟表，监控现在时间
	      	routeTimeId = setInterval(function() {
	      		routeTime.value = tools.formatTime(allTimeNow);
            }, 1000);
            
            routeCon.getElementsByClassName("error-alert")[0].style.display = "none";
            routeTime.style.borderColor = "#4c93fd";
            routeTime.style.color = "#4c93fd";
            //切换按钮的时候重新设置车牌号码
            routeCon.getElementsByClassName("taxi-information-container")[0].innerHTML = '<div class="taxi-number-notice">车牌号码</div>';
            clear()

	    } else { // 过去，创造对应时间选择器
	    	if (routeTimeId) {
	    		clearInterval(routeTimeId);
	    	}
	    	routePicker.style.display = "block";
	    	new Picker(routeTime, {
	    		container: '.route .time-picker',
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
            routeTime.value = "请选择过去的时间";
            //切换按钮的时候重新设置车牌号码
            routeCon.getElementsByClassName("taxi-information-container")[0].innerHTML = '<div class="taxi-number-notice">车牌号码</div>';
            clear()
	    } 
	}
  	// 默认创造当前时间
  	creatTime();
  	// 地区选择列表下拉上拉事件程序处理函数
  	function showRegList() {
  		if (regList.title == "hiden") {
              console.log(avoid)
  			regList.setAttribute('style', "height: 15rem;padding-top: 1.5rem");
  			regList.title = "show";
  			regChoice[0].style.display = "none";
  			regChoice[1].style.display = "block";
  		} else {
  			regList.setAttribute('style', "height: 0");
  			regList.title = "hiden";
  			regChoice[0].style.display = "block";
  			regChoice[1].style.display = "none";
  		}
  	}
  	regChoice[0].onclick = showRegList;
  	regChoice[1].onclick = showRegList;
  	// 地区选择事件程序处理函数
  	for (let i = 0; i < regList.children.length; i++) {
  		regList.children[i].onclick = function () {
  			regValue.value = event.target.innerText;
  			regValue.setAttribute('tle', event.target.getAttribute('tle'));
  			showRegList();
        if (regValue.value == "全广州") {
          changeView("广州");
        } else {
            changeView(regValue.value);
          }
  		}
      }
      
    //路径可视化的大容器
    var route = document.getElementsByClassName("route")[0];
    //防暴力点击变量
    var avoid = 0;
    //防暴力点击变量
    var avoid_hot = 0;
    //给刷新按钮添加点击事件,根据不同的情况发送不同的请求
    $(function() {
        $('.refresh-btn').click(function() {
            clear("active");
            console.log(avoid)
            if(route.getElementsByClassName("time-pass")[0].getAttribute("class") == "time-pass time-onChoose") {
                if(route.getElementsByClassName("time-value ")[0].value == "请选择过去的时间") {                 
                    routeCon.getElementsByClassName("error-alert")[0].style.display = "block";
                    routeTime.style.borderColor = "red";
                    routeTime.style.color = "red";                
                } else {
                    if(avoid == 0 && event.target.getAttribute("class") == "refresh-btn") {
                        let timeDiffer = allTimeNow.getTime() - (new Date(route.getElementsByClassName("time-value ")[0].value)).getTime();
                        if(timeDiffer > 0) {
                            console.log(indexhistory)
                            avoid = 1;
                            //调用化函数发送查询历史的请求
                            routeCon.getElementsByClassName("error-alert")[0].style.display = "none";
                            routeTime.style.borderColor = "#4c93fd";
                            routeTime.style.color = "#4c93fd";
                            sendhistoryreq();
                        } else {
                            avoid = 0;
                            routeCon.getElementsByClassName("error-alert")[0].style.display = "block";
                            routeTime.style.borderColor = "red";
                            routeTime.style.color = "red"; 
                        }                      
                     }  else  {
                        alert("请不要频繁点击");                     
                    }
                }
            } else if(route.getElementsByClassName("time-now")[0].getAttribute("class") == "time-now time-onChoose") {
                if(avoid_hot == 0) {
                    if(route.getElementsByClassName("time-value ")[0].value != "请选择过去时间") {
                        avoid_hot = 1;
                        //调用发送实时路径查询请求
                        presentreq();
                    }
                } else {
                    alert("请不要频繁点击");
                }
            }           
        })
    })
 
    //历史路径查询
    function sendhistoryreq() {
        //获得不同区域对应不同的编号
        var region_num = route.getElementsByClassName("region-choice")[0].getElementsByTagName("input")[0].getAttribute("tle");

        //先判断用户是否选择广州的,如果是就拦截      
        var position = {
            time : route.getElementsByClassName("time-value ")[0].value,
            area: region_num
        }

        console.log(position)
        $.ajax({
            "url":  serverUrl + "/taxiRoute/findTaxi",
            "method": "GET",
            "dataType": "json",
            "data": position,
            "async": true,
            "crossDomain": true,
            "success": function(data) {
                setTimeout(function() {
                    avoid = "0";
                }, 5000)            
                if(data.code == -1) {
                    alert(code.msg)
                } else {
                    console.log(data.data);
                    //在页面上显示车牌信息
                    taxinumber(data.data);
                    addhistorytaxionclick(data.data);              
                }
            }
        })     
         
    }

    //发送实时搜索车辆请求
    function presentreq() {
        var region_num = route.getElementsByClassName("region-choice")[0].getElementsByTagName("input")[0].getAttribute("tle")

        //先判断用户是否选择广州的,如果是就拦截
        var position = {
            time : route.getElementsByClassName("time-value ")[0].value,
            area: region_num
        }

        console.log(position)
        $.ajax({
            "url":  serverUrl + "/taxiRoute/findTaxi",
            "method": "GET",
            "data": position,
            "dataType": "json",
            "async": true,
            "crossDomain": true,
            "success": function(data) {
                setTimeout(function(){
                    avoid_hot = 0;
                },5000)
                console.log(data.data);
                //在页面上显示车牌信息
                taxinumber(data.data);
                addhottaxionclick(data.data);
            }
        })      
    }

    //动态添加出租车的车牌号码
    function taxinumber(taxi_num) {
        var taxi = document.getElementsByClassName("taxi-information-container")[0]
        //每次生成车牌信息时都先清空之前显示的信息
        taxi.innerHTML = "<div class='taxi-number-notice'>车牌号码</div>"

        for(var i = 0; i < taxi_num.length; i++) {
            for(var j in taxi_num[i]) {
                if(j == "licenseplateno") {
                    taxi.innerHTML += "<div class='taxi-number'>" + taxi_num[i][j] + `</div>`
                }
            }
        }
    }

     //发送历史查询结果的请求
     var indexhistory = -1;
    //历史车辆路径显示绑定点击事件
    function addhistorytaxionclick() {  
        //显示出车牌信息展示容器
        route.getElementsByClassName("taxi-information-container")[0].style.display = "block";

        for(let i = 0; i < document.getElementsByClassName("taxi-number").length; i++) {  
            document.getElementsByClassName("taxi-number")[i].onclick = function() {
                indexhistory++;
                loading.style.display = "block";
                //给点击的车辆号码改变颜色
                this.style.color = "#4c93fd";
                console.log(indexhistory)
                //这里重新生成一个新的对象，用于第二次数据的提交
                var obj = {
                    time: route.getElementsByClassName("time-value ")[0].value,
                    licenseplateno: this.innerHTML
                }
                $.ajax({
                    "url": serverUrl + "/taxiRoute/findRoute",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify(obj),
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    "success": function(data) {
                        loading.style.display = "none";
                        if(data.code == -1) {
                            alert(data.msg);
                            document.getElementsByClassName("taxi-number")[i].style.color = "black";
                            indexhistory = indexhistory - 1;
                        } else if(data.code == 1) {
                            console.log(data.data);                             
                            loadplugin(changform(data.data), "history", color[indexhistory], indexhistory);                                                 
                        }                                                       
                    }
                })            
            }
        }
    }

    
    //记录点击了多少辆车
    var index = -1;
    //出租车实时路径可视化
    function addhottaxionclick() {
        //显示出车牌信息展示容器
        route.getElementsByClassName("taxi-information-container")[0].style.display = "block";

        for(let i = 0; i < document.getElementsByClassName("taxi-number").length; i++) {  
            document.getElementsByClassName("taxi-number")[i].onclick = function() {
                //点击一次出租车数量计数器+1，记录当前显示多少辆车。
                index++;
                if(index < 3) {
                    loading.style.display = "block"
                    console.log(index)
                     //给点击的车辆号码改变颜色
                    this.style.color = "#4c93fd";

                    //这里重新生成一个新的对象，用于第二次数据的提交
                    var obj = {
                        time: route.getElementsByClassName("time-value")[0].value,
                        licenseplateno: this.innerHTML
                    }
                    $.ajax({
                        "url":  serverUrl + "/taxiRoute/findLiveRoute",
                        "method": "POST",
                        "data": JSON.stringify(obj),
                        "dataType": "json",
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "async": true,
                        "crossDomain": true,
                        "success": function(data) {
                            loading.style.display = "none";
                            if(data.code == -1) {
                                alert(data.msg)   
                                document.getElementsByClassName("taxi-number")[i].style.color = "black";   
                                index = index - 1;                           
                            } else if(data.code == 1) {                                                                                                                              
                                    var realpoint = changform(data.data)
                                    loadplugin(realpoint, "hot", color[index], index);
                                    storepoint.push(realpoint);
                                    console.log(storepoint)                                          
                                    if(index == 0) {
                                        timeout1 = setInterval(function() { 
                                            realtimeroute(obj.licenseplateno,0);
                                        },10000)
                                    } else if(index == 1) {
                                        timeout2 = setInterval(function() { 
                                            realtimeroute(obj.licenseplateno,1);
                                        },10000)
                                    } else if(index == 2) {
                                        timeout3 = setInterval(function() { 
                                            realtimeroute(obj.licenseplateno,2);
                                        },10000)
                                    } 
                                    map.setFitView();
                                }                                   
                            }                                                    
                        
                    })
                } else {
                    alert("你已经超过三辆车,请先清除轨迹后再试");
                }              
            }
        }
    }

    var multiple  = [1,1,1]
    //实时路径查询
    function realtimeroute(taxi, k) {
        var obj = {
            time:  tools.formatTime((new Date(route.getElementsByClassName("time-value ")[0].value)).getTime() + 50000*(multiple[k]++)),
            licenseplateno: taxi
        }
        $.ajax({
            "url":  serverUrl + "/taxiRoute/findLiveRoute",
            "method": "POST",
            "headers": {
            "Content-Type": "application/json"
            },
            "data": JSON.stringify(obj),
            "dataType": "json",
            "async": true,
            "crossDomain": true,
            "success": function(data) {
                if(data.data != 0 ) {
                    if(data.data != null) {
                        console.log(data.data);
                        console.log(changform(data.data))
                        mergeary(changform(data.data),k)
                        console.log(storepoint);
                        //把json对象转为路线规划参数符合的形式
                        pathSimplifierIns[k].hide();
                        loadplugin(storepoint[k], "hot", color[k], k);     
                    } 
                }                  
            }
        }) 
    }

    //对返回的数据转换一下格式，转换成生成路径参数可接受的数组格式
    function changform(path) {
        var arry = new Array();

        for(let i = 0; i < path.length; i++) {      
            arry.push([path[i].longitude,path[i].latitude]);   
        }

        return arry;
    }

    //这里没有拼接到
    function mergeary(arr, k) {
        if(timeout1 != null && timeout2 != null && timeout3 != null) {
            for(var i = 0; i < arr.length; i++) {           
                storepoint[k].push(arr[i])
            }
        } else {
            return;
        }
    }

    //用于接受海量数据的路径规划，加载路径规划插件 
    function loadplugin(point_arry, type, routecolor, num) {
        AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {

            if (!PathSimplifier.supportCanvas) {
                alert('当前环境不支持 Canvas！');
                return;
            }
            //启动路线规划
            initPage(PathSimplifier, point_arry, type , routecolor, num);
        });
    }
    
    //启动路径规划函数
    function initPage(PathSimplifier,routes, type, routecolor, num) {
        console.log("num=" + num)

        //创建组件实例
            pathSimplifierIns[num] = new PathSimplifier({     
            autoSetFitView: false,
            zIndex: 100,
            map: map, //所属的地图实例
            getPath: function(pathData, pathIndex) {
                return pathData.path;
            },
            renderOptions: {
                //轨迹线的样式
                pathLineStyle: {
                    outlineColor: routecolor,
                    strokeStyle: routecolor,
                    lineWidth: 6,
                    dirArrowStyle: true
                }
            }
        });

        pathSimplifierIns[num].setData([{
            path: routes
        },    
        ]);

        if(type == "hot") {         
            imagestart(routes[0])                      
        } else if(type == "history") {
            //添加图片
            addimage(routes[0],routes[routes.length - 1])
            map.setFitView();
        }
    }
    
    //只添加起点的图标
    function imagestart(startpoint) {
        // 创建一个 Icon
        var startIcon = new AMap.Icon({
            // 图标尺寸
            size: new AMap.Size(19, 31),
            // 图标的取图地址
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
            // 图标所用图片大小
            imageSize: new AMap.Size(19, 31),
        });

        var startMarker = new AMap.Marker({
            position: new AMap.LngLat(startpoint[0],startpoint[1]),
            icon: startIcon,
            offset: new AMap.Pixel(-13, -30)
        });

        map.add([startMarker]);
    }


    //将加入起点终点的图标包装成一个方法类
    function addimage(startpoint,endpoint) {
        // 创建一个 Icon
        var startIcon = new AMap.Icon({
            // 图标尺寸
            size: new AMap.Size(19, 31),
            // 图标的取图地址
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
            // 图标所用图片大小
            imageSize: new AMap.Size(19, 31),
        });

        var startMarker = new AMap.Marker({
            position: new AMap.LngLat(startpoint[0],startpoint[1]),
            icon: startIcon,
            offset: new AMap.Pixel(-13, -30)
        });

        // 创建一个 icon
        var endIcon = new AMap.Icon({
            // 图标尺寸
            size: new AMap.Size(19, 31),
            // 图标的取图地址
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
            // 图标所用图片大小
            imageSize: new AMap.Size(19, 31),
        });

        // 将 icon 传入 marker
        var endMarker = new AMap.Marker({
            position: new AMap.LngLat(endpoint[0],endpoint[1]),
            icon: endIcon,
            offset: new AMap.Pixel(-13, -30)
        });    

        map.add([startMarker, endMarker]);
    }

    //还原车牌号码显示的颜色
    function reductioncolor() {
        for(var i = 0; i < document.getElementsByClassName("taxi-number").length; i++) {
            document.getElementsByClassName("taxi-number")[i].style.color = "black";
        }
    }

    //点击按钮清除当前显示路径同时停止计时器
    route.getElementsByClassName("clear-btn")[0].onclick = function() {
        clear("active")
    }

    //还原所有东西
    function clear(btn) {
        clearInterval(timeout1);
        clearInterval(timeout2);
        clearInterval(timeout3);

        timeout1 = null;
        timeout2 = null;
        timeout3 = null

        for(let i = 0; i < pathSimplifierIns.length; i++) {
            if(pathSimplifierIns[i] != null) {
                pathSimplifierIns[i].hide();
            }
        }

        pathSimplifierIns.length = 0;
        storepoint.length = 0;
        map.clearMap();
        index = -1;
        indexhistory = -1;
        reductioncolor()
        routeCon.getElementsByClassName("error-alert")[0].style.display = "none";
        routeTime.style.borderColor = "#4c93fd";
        routeTime.style.color = "#4c93fd";
        if(btn != "active") {
            routeCon.getElementsByClassName("taxi-information-container")[0].innerHTML = '<div class="taxi-number-notice">车牌号码</div>' 
            routeCon.getElementsByClassName("taxi-information-container")[0].style.display = "none"
        } 
        multiple = [1,1,1]
    }
    

    // 选择地区跳转视图
    var opts = {
      extensions: 'all',      
    };
    let polygons = [];

    function changeView(districtName) {
      for (let i = 0; i < polygons.length; i++) {
        polygons[i].setMap(null);
      }
      polygons = [];
      var district = new AMap.DistrictSearch(opts);
      district.search(districtName, function(status, result) {
        if(status=='complete'){
          getData(result.districtList[0]);
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

    return{
        loadplugin: loadplugin,
        initPage: initPage,
        addimage: addimage,
        changform: changform,
        loading: loading,
        clear: clear
    }

    
});









