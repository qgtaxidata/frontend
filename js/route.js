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















    var timeout = null
    //实时车辆路径可视化的url
    var hotliveurl = "http://192.168.1.103:8080/taxiRoute/findLiveRoute";
    //生成出租车列表url
    var findtaxiurl = "http://192.168.1.103:8080/taxiRoute/findTaxi"
    //出租车历史路径可视化
    var historytaxiurl = "http://192.168.1.103:8080/taxiRoute/findRoute"
    //路径可视化的大容器
    var route = document.getElementsByClassName("route")[0];
    //引用外部的map实例

    //给刷新按钮添加点击事件,根据不同的情况发送不同的请求
    $(function() {
        $('.refresh-btn').click(function() {
            if(route.getElementsByClassName("time-pass")[0].getAttribute("class") == "time-pass time-onChoose") {
                //调用化函数发送查询历史的请求
                sendhistoryreq();
            } else if(route.getElementsByClassName("time-now")[0].getAttribute("class") == "time-now time-onChoose") {
                //调用发送实时路径查询请求
                presentreq();
            }           
        })
    })

    //发送历史查询结果的请求
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
                    console.log(data.data);
                    // var a = JSON.parse(data.data);
                    //在页面上显示车牌信息
                    taxinumber(data.data);
                    addhistorytaxionclick(data.data);
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
                    // var a = JSON.parse(data.data);
                    //在页面上显示车牌信息
                    taxinumber(data.data);
                    addhottaxionclick(data.data);
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

    //出租车历史路径可视化
    function addhistorytaxionclick(information) {
        //定义一个数组把之前之前路径生成的点都存起来
        var storepoint = [];
        //定义一个数组存起发送多次请求时，发送到后台的对象。
        var objs = [];
        //显示出车牌信息展示容器
        route.getElementsByClassName("taxi-information-container")[0].style.display = "block";

        for(let i = 0; i < document.getElementsByClassName("taxi-number").length; i++) {  
            document.getElementsByClassName("taxi-number")[i].onclick = function() {
                //还原字体的颜色
                reductioncolor();
                //给点击的车辆号码改变颜色
                this.style.color = "#4c93fd";

                var date = findtime(this.innerHTML,information);
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
                        loadplugin(changform(data.data))                                                         
                    }
                })
            }
        }
    }

    //出租车实时路径可视化
    function addhottaxionclick(information) {
        //定义一个数组把之前之前路径生成的点都存起来
        var storepoint = [];
        //定义一个数组存起发送多次请求时，发送到后台的对象。
        var objs = [];
        //显示出车牌信息展示容器
        route.getElementsByClassName("taxi-information-container")[0].style.display = "block";

        for(let i = 0; i < document.getElementsByClassName("taxi-number").length; i++) {  
            document.getElementsByClassName("taxi-number")[i].onclick = function() {
                //还原字体的颜色
                reductioncolor();
                //给点击的车辆号码改变颜色
                this.style.color = "#4c93fd";

                var date = findtime(this.innerHTML,information);
                //这里重新生成一个新的对象，用于第二次数据的提交
                var obj = {
                    time: changetime(new Date(Date.now() - 79200000000)),
                    licenseplateno: this.innerHTML
                }

                // //点击一次把对象push进去数组
                // objs.push(obj);
                // this.contains

                // $('.confirm-btn').click(function() {
                //向后台发出请求，生成路线
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
                            var realpoint = changform(data.data)
                            loadplugin(realpoint)
                            storepoint.push(realpoint)
                            //把json对象转为路线规划参数负荷的形式             
                            setTimeout(() => {
                                timeout = setInterval(function (){
                                realtimeroute(obj.licenseplateno,storepoint)
                                },10000)
                            }, 10000);                                                      
                        }
                    })
                // })
            }
        }
    }

    //实时路径查询
    function realtimeroute(taxi,storepoint) {
        var obj = {
            time:  route.getElementsByClassName("time-value ")[0].value,
            licenseplateno: taxi
        }
        $.ajax({
            "url":  hotliveurl,
            "method": "POST",
            "headers": {
            "Content-Type": "application/json"
            },
            "data": JSON.stringify(obj),
            "dataType": "json",
            "async": true,
            "crossDomain": true,
            "success": function(data) {
                storepoint.push(changform(data.data))
                console.log(storepoint);
                //把json对象转为路线规划参数符合的形式
                loadplugin(realroute(storepoint));                           
            }
        }) 
    }

    //对返回的数据转换一下格式，转换成生成路径参数可接受的数组格式
    function changform(path) {
        var arry = new Array();
        var taxi_point = new Array();

        for(let i = 0; i < path.length; i++) {      
                taxi_point[i] = [path[i].longitude,path[i].latitude]
                arry.push(taxi_point[i]);   
        }

        return arry;
    }

    //旧的路线规划，有点卡
    // function createroute(routes) {
    //     //每次画图前清除所有的覆盖物
    //     var length = routes.length
    //     addimage(routes[0],routes[length - 1])
    //     for(var i = 0; i < routes.length; i++) {
    //         var polyline = new AMap.Polyline({
    //             path: routes,
    //             outlineColor: '#ffeeff',
    //             borderWeight: 3,
    //             strokeColor: "#3366FF", 
    //             strokeOpacity: 1,
    //             strokeWeight: 6,
    //             // 折线样式还支持 'dashed'
    //             strokeStyle: "solid",
    //             // strokeStyle是dashed时有效
    //             strokeDasharray: [10, 5],
    //             lineJoin: 'round',
    //             lineCap: 'round',
    //             zIndex: 50,
    //             // showDir:true
    //         })
    //         polyline.setMap(map);
    //         map.setFitView([ polyline ]);
    //     }
    // }

    //用于接受海量数据的路径规划，加载路径规划插件 
    function loadplugin(point_arry) {
        AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {

            if (!PathSimplifier.supportCanvas) {
                alert('当前环境不支持 Canvas！');
                return;
            }
            //启动路线规划
            initPage(PathSimplifier,point_arry);
        });
    }
    
    //启动路径规划函数
    function initPage(PathSimplifier,routes) {
        //添加图片
        addimage(routes[0],routes[routes.length - 1])
        //创建组件实例
        var pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: map, //所属的地图实例
            getPath: function(pathData, pathIndex) {
                //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
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
      if(timeout != null) {
        clearInterval(timeout);
      }
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



  var path= {
    "msg": "success",
    "code": 1,
    "data": [
        {
            "longitude": 113.24972485282404,
            "latitude": 23.138024500572293,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24972485282404,
            "latitude": 23.138024500572293,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25112474842666,
            "latitude": 23.13842440944412,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2532247716897,
            "latitude": 23.139524609813954,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2547248634454,
            "latitude": 23.139824663022292,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2547248634454,
            "latitude": 23.139824663022292,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25512489772075,
            "latitude": 23.139824660005264,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25512489772075,
            "latitude": 23.139824660005264,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25532492396273,
            "latitude": 23.13992470033242,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25682513479782,
            "latitude": 23.140124833698845,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25682513479782,
            "latitude": 23.140124833698845,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25682513479782,
            "latitude": 23.140124833698845,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25682513479782,
            "latitude": 23.140124833698845,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25702524170262,
            "latitude": 23.141225282030632,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25702524170262,
            "latitude": 23.141225282030632,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2570253557562,
            "latitude": 23.14292595246653,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2570253557562,
            "latitude": 23.14292595246653,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25702548323677,
            "latitude": 23.144826699933592,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25702548323677,
            "latitude": 23.144826699933592,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25702553691563,
            "latitude": 23.14562701406865,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25742568174051,
            "latitude": 23.14672747739082,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25862590622965,
            "latitude": 23.146327452949993,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.26202687578271,
            "latitude": 23.145527810419065,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2643277938925,
            "latitude": 23.145028315414677,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.26692905920169,
            "latitude": 23.14412899269376,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.26692905920169,
            "latitude": 23.14412899269376,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.26903022095637,
            "latitude": 23.142629417691666,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.27153184365864,
            "latitude": 23.141130245293827,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.27423388266774,
            "latitude": 23.139831517403568,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.27683621888772,
            "latitude": 23.14033367862037,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28434443701022,
            "latitude": 23.143741972827588,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28434443701022,
            "latitude": 23.143741972827588,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29055246484558,
            "latitude": 23.143849119031316,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29836444055637,
            "latitude": 23.147661121039977,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30096880231922,
            "latitude": 23.149065521583324,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30357318446082,
            "latitude": 23.14836925909331,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30507567396987,
            "latitude": 23.146370857697377,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30637778462844,
            "latitude": 23.143371781022633,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30637778462844,
            "latitude": 23.143371781022633,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30788011798829,
            "latitude": 23.137772035054315,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30767955131259,
            "latitude": 23.134770511102477,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30767955131259,
            "latitude": 23.134770511102477,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30757918050512,
            "latitude": 23.131969228547014,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.3062764983294,
            "latitude": 23.126965090767804,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.3062764983294,
            "latitude": 23.126965090767804,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30377202006252,
            "latitude": 23.12596068234425,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30076685642679,
            "latitude": 23.125155732188027,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30076685642679,
            "latitude": 23.125155732188027,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29776192318276,
            "latitude": 23.12455107369042,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29485736859944,
            "latitude": 23.123846737603603,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29485736859944,
            "latitude": 23.123846737603603,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29005015165754,
            "latitude": 23.119738871684795,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29005015165754,
            "latitude": 23.119738871684795,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28914877179064,
            "latitude": 23.11743684755522,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28844769496345,
            "latitude": 23.11533516150575,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28794688141484,
            "latitude": 23.113033638414652,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28744608249906,
            "latitude": 23.11083216156863,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28744608249906,
            "latitude": 23.11083216156863,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2867450432722,
            "latitude": 23.10873050563128,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28614415160868,
            "latitude": 23.10672901462857,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28534301898488,
            "latitude": 23.104627275013044,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28454191407728,
            "latitude": 23.102625595044515,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28384095461983,
            "latitude": 23.100724078467646,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28323999951186,
            "latitude": 23.096921890043962,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28323999951186,
            "latitude": 23.096921890043962,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28334000121743,
            "latitude": 23.09522128595189,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28334000121743,
            "latitude": 23.09522128595189,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28384049809463,
            "latitude": 23.09392125865393,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28384049809463,
            "latitude": 23.09392125865393,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28524214438214,
            "latitude": 23.093422529808954,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28744489333012,
            "latitude": 23.093124853597843,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28744489333012,
            "latitude": 23.093124853597843,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28964778912994,
            "latitude": 23.092727283440578,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29094957273487,
            "latitude": 23.092528801804246,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29094957273487,
            "latitude": 23.092528801804246,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29094957273487,
            "latitude": 23.092528801804246,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29094957273487,
            "latitude": 23.092528801804246,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29094957273487,
            "latitude": 23.092528801804246,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29215125630822,
            "latitude": 23.092230198622367,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29215125630822,
            "latitude": 23.092230198622367,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29415414874616,
            "latitude": 23.09163257491377,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29585670340848,
            "latitude": 23.091234726299145,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29775964776601,
            "latitude": 23.090737198473015,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29795996004347,
            "latitude": 23.09063744430835,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29795996004347,
            "latitude": 23.09063744430835,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29795996004347,
            "latitude": 23.09063744430835,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29886143521956,
            "latitude": 23.091038917427333,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30316881816164,
            "latitude": 23.09384659240035,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30316881816164,
            "latitude": 23.09384659240035,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30126548376114,
            "latitude": 23.09234303895066,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.30126548376114,
            "latitude": 23.09234303895066,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2999632667725,
            "latitude": 23.091540749487827,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2999632667725,
            "latitude": 23.091540749487827,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29976293764001,
            "latitude": 23.091540452102922,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29976293764001,
            "latitude": 23.091540452102922,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29976293764001,
            "latitude": 23.091540452102922,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29976293764001,
            "latitude": 23.091540452102922,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29976293764001,
            "latitude": 23.091540452102922,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29976293764001,
            "latitude": 23.091540452102922,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29976293764001,
            "latitude": 23.091540452102922,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29976293764001,
            "latitude": 23.091540452102922,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29976293764001,
            "latitude": 23.091540452102922,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29976293764001,
            "latitude": 23.091540452102922,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29976293764001,
            "latitude": 23.091540452102922,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29976293764001,
            "latitude": 23.091540452102922,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29976293764001,
            "latitude": 23.091540452102922,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29946243906865,
            "latitude": 23.091439966153704,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29806014011835,
            "latitude": 23.090937713567133,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29725887499481,
            "latitude": 23.09103660914451,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29725887499481,
            "latitude": 23.09103660914451,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29725887499481,
            "latitude": 23.09103660914451,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29725887499481,
            "latitude": 23.09103660914451,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29725887499481,
            "latitude": 23.09103660914451,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29655778265237,
            "latitude": 23.0911356613738,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29475505074282,
            "latitude": 23.091633384221357,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29195098284075,
            "latitude": 23.092430025443974,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2916505614025,
            "latitude": 23.09252968450143,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2916505614025,
            "latitude": 23.09252968450143,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2915504192732,
            "latitude": 23.092529557542292,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.29044888895235,
            "latitude": 23.092728263233443,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28874659542218,
            "latitude": 23.09302632864178,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2866438884906,
            "latitude": 23.09342407068761,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2866438884906,
            "latitude": 23.09342407068761,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2851420423885,
            "latitude": 23.093722546907795,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28424097142367,
            "latitude": 23.093921674905726,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28424097142367,
            "latitude": 23.093921674905726,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28394062935239,
            "latitude": 23.0941214454137,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28344023820763,
            "latitude": 23.09702213515332,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28344028520027,
            "latitude": 23.097722425420194,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28344028520027,
            "latitude": 23.097722425420194,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28344028520027,
            "latitude": 23.097722425420194,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28344028520027,
            "latitude": 23.097722425420194,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28344028520027,
            "latitude": 23.097722425420194,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28354046211838,
            "latitude": 23.09862290065094,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28404118391627,
            "latitude": 23.100624244612074,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28434160758235,
            "latitude": 23.10162497149551,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28484228228744,
            "latitude": 23.10272595471362,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28524284949279,
            "latitude": 23.103926878563588,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28584369671792,
            "latitude": 23.10552819041343,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28634447665105,
            "latitude": 23.107829688535777,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28634447665105,
            "latitude": 23.107829688535777,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28464244395589,
            "latitude": 23.108728210784065,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28454232378229,
            "latitude": 23.10872810496637,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28454232378229,
            "latitude": 23.10872810496637,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28424193166535,
            "latitude": 23.108227584257076,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28424193166535,
            "latitude": 23.108227584257076,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28404167415646,
            "latitude": 23.107927252340826,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28374129375504,
            "latitude": 23.10752677733444,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28374129375504,
            "latitude": 23.10752677733444,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28344088950551,
            "latitude": 23.106726140767996,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28344088950551,
            "latitude": 23.106726140767996,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2837411930153,
            "latitude": 23.106026160798603,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28524295696356,
            "latitude": 23.105527537520413,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28524295696356,
            "latitude": 23.105527537520413,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28484235616503,
            "latitude": 23.103826408376136,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28434166130494,
            "latitude": 23.102425301821402,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28404126449412,
            "latitude": 23.101824740470907,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28354055611214,
            "latitude": 23.10002348016502,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28263941906297,
            "latitude": 23.09852195018708,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28313981018604,
            "latitude": 23.095821332176698,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28313981018604,
            "latitude": 23.095821332176698,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28354016674281,
            "latitude": 23.094221074591346,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28313966251646,
            "latitude": 23.09362041778545,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28183815852931,
            "latitude": 23.093118922036943,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.28183815852931,
            "latitude": 23.093118922036943,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2803364936622,
            "latitude": 23.092517255516107,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.27923532525799,
            "latitude": 23.09211609770236,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.27923532525799,
            "latitude": 23.09211609770236,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.27673278984257,
            "latitude": 23.090613372557787,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2756317295453,
            "latitude": 23.08971214136405,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.274430622134,
            "latitude": 23.088710838604676,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.27383008835255,
            "latitude": 23.08821020613861,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.27282922399097,
            "latitude": 23.087309152379113,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.27142809424603,
            "latitude": 23.086307845599947,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.27142809424603,
            "latitude": 23.086307845599947,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.27142809424603,
            "latitude": 23.086307845599947,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.26992701772242,
            "latitude": 23.086006846655106,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.26842604046587,
            "latitude": 23.085906013386285,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.26672500506808,
            "latitude": 23.085304965184598,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.26402358182537,
            "latitude": 23.084203458902564,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.26312327581091,
            "latitude": 23.085403673774326,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.26312327581091,
            "latitude": 23.085403673774326,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.26192290405939,
            "latitude": 23.086803923227997,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.26102267264842,
            "latitude": 23.08800420820103,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.26102267264842,
            "latitude": 23.08800420820103,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25922230620982,
            "latitude": 23.090404868552852,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25782211922099,
            "latitude": 23.092405521210434,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25752208739917,
            "latitude": 23.092805658669732,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25622198205846,
            "latitude": 23.094406237760246,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25622198205846,
            "latitude": 23.094406237760246,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25622198205846,
            "latitude": 23.094406237760246,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.255821963729,
            "latitude": 23.094906431877824,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.255821963729,
            "latitude": 23.094906431877824,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25552195584748,
            "latitude": 23.095306591783885,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25552195584748,
            "latitude": 23.095306591783885,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25432196025187,
            "latitude": 23.09690726504508,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25312202213681,
            "latitude": 23.098507992101506,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25312202213681,
            "latitude": 23.098507992101506,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2527220599977,
            "latitude": 23.09910827399923,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2527220599977,
            "latitude": 23.09910827399923,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25242224997275,
            "latitude": 23.101909460741535,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25242224997275,
            "latitude": 23.101909460741535,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25232225828296,
            "latitude": 23.10200951247885,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25232225828296,
            "latitude": 23.10200951247885,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25122231571123,
            "latitude": 23.10220973500777,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24822270035631,
            "latitude": 23.10251047331854,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24792279661409,
            "latitude": 23.10311080098352,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24842274532939,
            "latitude": 23.103710916721404,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25032254161641,
            "latitude": 23.104510832039672,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25082251112055,
            "latitude": 23.104710828056987,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2515224797745,
            "latitude": 23.1049108054247,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2515224797745,
            "latitude": 23.1049108054247,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25192240937801,
            "latitude": 23.104110424251626,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25202235928367,
            "latitude": 23.103410123749004,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25202235928367,
            "latitude": 23.103410123749004,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25172235000359,
            "latitude": 23.10311003706469,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25042258563084,
            "latitude": 23.10531114340325,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25042258563084,
            "latitude": 23.10531114340325,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25032260860169,
            "latitude": 23.105511243739034,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.25032260860169,
            "latitude": 23.105511243739034,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24972276146954,
            "latitude": 23.106811894457845,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24942286671119,
            "latitude": 23.107812368386394,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24942286671119,
            "latitude": 23.107812368386394,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24942286671119,
            "latitude": 23.107812368386394,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24942286671119,
            "latitude": 23.107812368386394,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24942286671119,
            "latitude": 23.107812368386394,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2491229621259,
            "latitude": 23.108612763264276,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2488231013077,
            "latitude": 23.110013407143413,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2488231013077,
            "latitude": 23.110013407143413,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2488231214073,
            "latitude": 23.110313530021788,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2488231214073,
            "latitude": 23.110313530021788,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2488231214073,
            "latitude": 23.110313530021788,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.2488231214073,
            "latitude": 23.110313530021788,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24852335126552,
            "latitude": 23.113014707563053,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24832345958689,
            "latitude": 23.114115207308554,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24742381584485,
            "latitude": 23.116816554217454,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24722396637786,
            "latitude": 23.118417263467766,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24722396637786,
            "latitude": 23.118417263467766,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24722397307995,
            "latitude": 23.11851730406711,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24712412937052,
            "latitude": 23.120518145194342,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24712412937052,
            "latitude": 23.120518145194342,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24712412937052,
            "latitude": 23.120518145194342,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        },
        {
            "longitude": 113.24712423661614,
            "latitude": 23.122118792710516,
            "time": null,
            "licenseplateno": "粤A0LJ51"
        }
    ]}

});