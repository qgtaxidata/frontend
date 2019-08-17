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
	    } 
	}
  	// 默认创造当前时间
  	creatTime();
  	// 地区选择列表下拉上拉事件程序处理函数
  	function showRegList() {
  		if (regList.title == "hiden") {
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

    //给刷新按钮添加点击事件,根据不同的情况发送不同的请求
    $(function() {
        $('.refresh-btn').click(function() {
            if(route.getElementsByClassName("time-pass")[0].getAttribute("class") == "time-pass time-onChoose") {
                if(route.getElementsByClassName("time-value ")[0].value == "请选择过去的时间") {
                    routeCon.getElementsByClassName("error-alert")[0].style.display = "block";
                    routeTime.style.borderColor = "red";
                    routeTime.style.color = "red";
                } else {
                    //调用化函数发送查询历史的请求
                    routeCon.getElementsByClassName("error-alert")[0].style.display = "none";
                    routeTime.style.borderColor = "#4c93fd";
                    routeTime.style.color = "#4c93fd";
                    sendhistoryreq();
                }
            } else if(route.getElementsByClassName("time-now")[0].getAttribute("class") == "time-now time-onChoose") {
                //调用发送实时路径查询请求
                presentreq();
            }           
        })
    })

    //发送历史查询结果的请求
    var indexhistory = -1;
    function sendhistoryreq() {
        //获得不同区域对应不同的编号
        var region_num = route.getElementsByClassName("region-choice")[0].getElementsByTagName("input")[0].getAttribute("tle")

        //先判断用户是否选择广州的,如果是就拦截
        if(region_num == 0) {
            alert("暂不支持搜索全广州,请选择其他区域")
        } else {
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
                    indexhistory++;
                    console.log(data.data);
                    //在页面上显示车牌信息
                    taxinumber(data.data);
                    addhistorytaxionclick(data.data);
                    map.setFitView();
                }
            })     
        }
    }

    //发送实时搜索车辆请求
    function presentreq() {
        var region_num = route.getElementsByClassName("region-choice")[0].getElementsByTagName("input")[0].getAttribute("tle")

        //先判断用户是否选择广州的,如果是就拦截
        if(region_num == 0) {
            alert("暂不支持搜索全广州,请选择其他区域")
        } else {
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
                    console.log(data.data);
                    //在页面上显示车牌信息
                    taxinumber(data.data);
                    addhottaxionclick(data.data);
                    map.setFitView();
                }
            })
        }
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

    //从拿到的车牌号中查找该车牌号所对应的是时间
    function findtime(taxi_license,taxi_obj) {
        for(var i = 0; i < taxi_obj.length; i++) {
            if(taxi_obj[i].licenseplateno == taxi_license) {
                return taxi_obj[i].time
            }
        }
    }

    //历史车辆路径显示绑定点击事件
    function addhistorytaxionclick(information) {  
        //显示出车牌信息展示容器
        route.getElementsByClassName("taxi-information-container")[0].style.display = "block";

        for(let i = 0; i < document.getElementsByClassName("taxi-number").length; i++) {  
            document.getElementsByClassName("taxi-number")[i].onclick = function() {
                //////////这里可以加一个loding界面！！！！！！！！！！！！！！！！！！！
                if(indexhistory < 3) {
                    //给点击的车辆号码改变颜色
                    this.style.color = "#4c93fd";
                    indexhistory++;
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
                            if(data.code == -1) {
                                alert(data.msg);
                                document.getElementsByClassName("taxi-number")[i].style.color = "black";
                                indexhistory = indexhistory - 1;
                            } else if(data.code == 1) {
                                console.log(data.data);
                                loadplugin(changform(data.data), "history")  
                            }                                                       
                        }
                    })
                } else {
                    alert("最多选择3辆车")
                }
            }
        }
    }

    
    //记录点击了多少辆车
    var index = -1;
    //给三条路线添加一个计时器
    var timeout = new Array();
    //定义一个数组把之前之前路径生成的点都存起来
    var storepoint = new Array();
    //出租车实时路径可视化
    function addhottaxionclick(information) {
        //先清除之前的计时器    
        clearInterval(timeout);

        //显示出车牌信息展示容器
        route.getElementsByClassName("taxi-information-container")[0].style.display = "block";

        for(let i = 0; i < document.getElementsByClassName("taxi-number").length; i++) {  
            document.getElementsByClassName("taxi-number")[i].onclick = function() {
                /////////////注意点击一下进入loading界面防止恶意点击！！！！！！！！！！！！！！！！！！！！！！！
                if(index < 2) {
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
                            if(data.code == -1) {
                                    alert(data.msg)   
                                document.getElementsByClassName("taxi-number")[i].style.color = "black";                              
                            } else if(data.code == 1) {                                                                                                                                
                                    //点击一次出租车数量计数器+1，记录当前显示多少辆车。
                                    index++;
                                    var realpoint = changform(data.data)
                                    loadplugin(realpoint, "hot")
                                    storepoint.push(realpoint);
                                    console.log(storepoint)
                                           
                                    if(index == 0) {
                                        timeout[index] = setInterval(function() { 
                                            realtimeroute(obj.licenseplateno,0);
                                        },10000)
                                    } else if(index == 1) {
                                        timeout[index] = setInterval(function() { 
                                            realtimeroute(obj.licenseplateno,1);
                                        },10000)
                                    } else if(index == 2) {
                                        timeout[index] = setInterval(function() { 
                                            realtimeroute(obj.licenseplateno,2);
                                        },10000)
                                    } 
                                }                                   
                            }                                                    
                        
                    })
                } else {
                    alert("最多选择3辆车")
                }              
            }
        }
    }

    //实时路径查询
    function realtimeroute(taxi,k) {
        var obj = {
            time:  route.getElementsByClassName("time-value ")[0].value,
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
                    console.log(data.data);
                    console.log(changform(data.data))
                    mergeary(changform(data.data),k)
                    console.log(storepoint);
                    //把json对象转为路线规划参数符合的形式
                    loadplugin(storepoint[k], "hot");      
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
        console.log("第一个车", k);

        for(var i = 0; i < arr.length; i++) {           
            storepoint[k].push(arr[i])
        }
    }

    //用于接受海量数据的路径规划，加载路径规划插件 
    function loadplugin(point_arry, type) {
        AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {

            if (!PathSimplifier.supportCanvas) {
                alert('当前环境不支持 Canvas！');
                return;
            }
            //启动路线规划
            initPage(PathSimplifier, point_arry, type);
        });
    }
    
    //启动路径规划函数
    function initPage(PathSimplifier,routes, type) {
        if(type == "hot") {
            imagestart(routes[0])
        } else if(type == "history") {
            //添加图片
            addimage(routes[0],routes[routes.length - 1])
        }
        //创建组件实例
        var pathSimplifierIns = new PathSimplifier({
            autoSetFitView: false,
            zIndex: 100,
            map: map, //所属的地图实例
            getPath: function(pathData, pathIndex) {
                return pathData.path;
            },
            renderOptions: {
                //轨迹线的样式
                pathLineStyle: {
                    outlineColor: '#ffeeff',
                    strokeStyle: "#3366FF",
                    lineWidth: 6,
                    dirArrowStyle: true
                }
            }
        });

        pathSimplifierIns.setData([{
            path: routes
        },    
        ]);
    }

    //把实时路径storeppint外层数组去掉
    function realroute(storepoint) {
        var realpoint = [];

        for(var i = 0; i < storepoint.length; i++) {
            for(var j  = 0; j < storepoint[i].length; j++) {
                realpoint.push(storepoint[i][j]);
            }
        }

        return realpoint;
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
      console.log("我已经清除计时器")
      for(var i = 0; i < timeout.length; i++) {
          if(timeout[i] != null) {
              clearInterval(timeout[i])
          }
      } 

      index = -1;
      indexhistory = -1;
      map.clearMap();   
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
        changform: changform
    }
});