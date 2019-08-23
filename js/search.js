define(["require", "route", "tools"],function() {

    //引入别的文件路径规划函数
    var loading = require("route").loading;
    var tools = require("tools").verificat; 
    //热点推荐的容器框
    var hot_point = document.getElementsByClassName("hot-point-container")[0]; 
    //非空载状态下路径可视化的容器框
    var load_container =  document.getElementsByClassName("load-ul")[0];
    //搜索确认框
    var comfirm_btn = document.getElementsByClassName("search-btn")[0]
    //单个输入框时的inoput名称
    var single_input = document.getElementById("start");
    //两个输入框时的起点输入框
    var couple_start = document.getElementById("input-departure");
    //两个输入框时的终点输入框
    var couple_end = document.getElementById("input-destination");
    //模糊搜索容器框
    var fuzzy_container = document.getElementsByClassName("fuzzy-contaniner")[0];
    var color = [
        "#3366cc", "#dc3912", "#22aa99", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
        "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
        "#651067", "#329262", "#5574a6", "#3b3eac"
    ];
    var pathSimplifierIns = new Array()

    //搜索框对应出租车状态选择栏
    var change = document.getElementsByClassName('xiala')[0];
    change.onclick = function(e) {
        let taxiStatus = change.parentNode;
        if (taxiStatus.getAttribute("class") == "taxi-status-hidden") {
            taxiStatus.setAttribute("class", "taxi-status-show");
            change.src = "images/shouqi.png"
        } else {
            taxiStatus.setAttribute("class", "taxi-status-hidden");
            change.src = "images/xiala.png"
        }
    }
    var statusChoice = document.getElementsByClassName('status-choice');
    for (let i = 0; i < statusChoice.length; i++) {
        statusChoice[i].onclick = function() {
            let taxiStatus = event.target.parentNode;
            let thisNode = taxiStatus.removeChild(event.target);
            taxiStatus.insertBefore(thisNode, taxiStatus.children[0]);
            clear()
            change.onclick();

            if(statusChoice[0].innerHTML == "非空载") {
                document.getElementsByClassName("input-start-end-contaniner")[0].style.display = "block";
                single_input.setAttribute("class", "input-start-hidden");
            }  else if(statusChoice[0].innerHTML == "空载") {
                single_input.setAttribute("class", "input-start");
                document.getElementsByClassName("input-start-end-contaniner")[0].style.display = "none";
            }     
        }
    }

    //当聚焦三个input框时清除掉所有的东西
    function onfcus(type) { 
        single_input.onfocus = function() {
            hot_point.innerHTML = "";
            load_container.innerHTML = "";
            fuzzy_container.innerHTML = "";
            load_container.innerHTML = "";
            if(type == "空载") {
                hot_point.style.display = "block"
            } else {
                hot_point.innerHTML = "";
            }       
        }
        couple_start.onfocus = function() {
            hot_point.innerHTML = "";
            load_container.innerHTML = "";
            fuzzy_container.innerHTML = "";
            load_container.innerHTML = "";
            hot_point.innerHTML = "";
        }
        couple_end.onfocus = function() {
            hot_point.innerHTML = "";
            load_container.innerHTML = "";
            fuzzy_container.innerHTML = "";
            load_container.innerHTML = "";
            hot_point.innerHTML = "";
        }
    }

    onfcus();

    //清除路线轨迹
    function removeRoute() {
        if(pathSimplifierIns.length != 0) {
            for(var i = 0; i <  pathSimplifierIns.length; i++) { 
                if(pathSimplifierIns[i])    
                pathSimplifierIns[i].hide()
            }
        }
    }

    //清除所有的东西
    function clear() {
        map.clearMap();
        document.getElementById("input-departure").value = "";
        document.getElementById("input-destination").value = "";
        avoid = "available"
        removeRoute()
        fuzzy_container.innerHTML = "";
        single_input.value = "";
        hot_point.innerHTML = "";
        car_num = 0;
        load_container.innerHTML = ""
        document.getElementsByClassName("button-contaniner")[0].innerHTML = " <div class='clear-routes-btn'>清除路线</div><div class='search-btn' name='loadroute'>搜索</div>";
        submit();
        bindClear()
        pathSimplifierIns.length = 0;
    }

    //点击清除按钮
    function bindClear() {
        document.getElementsByClassName("clear-routes-btn")[0].onclick = function() {
            clear()
        }
    }
    bindClear()

    //给搜索框的取消按钮添加取消功能
    var wrong_icon = document.getElementsByClassName("cha-icon");
    wrong_icon[0].onclick = function() {
        document.getElementById("input-departure").value = "";
    }

    wrong_icon[1].onclick = function() {
        document.getElementById("input-destination").value = "";
    }


    //给三个输入框添加模糊搜索功能
    function fuzzysearch (inputid) {
        map.plugin('AMap.Autocomplete',function() {
            var autoOptions = {
                // input 为绑定输入提示功能的input的DOM ID
                city: "广州市",
                input: inputid,
                output: 'fuzzy-search-contanier',
                citylimit: "true",
            }
           new AMap.Autocomplete(autoOptions); 
        })
    }

    fuzzysearch ("start");
    fuzzysearch ("input-departure");
    fuzzysearch ("input-destination"); 

    //用户点击搜索把名称转变为坐标向后台发请求
    //防止暴力点击按钮
    var avoid = "available"
    function submit(type, lng , lat) {
        $('.search-btn').click(function() {
            removeRoute();
            releaseEvent()
            if(document.getElementsByClassName("status-choice")[0].innerHTML == "空载") {
                submit("hot", lng, lat)    
            } else {
                submit()
            }
            car_num = 0;       
            if(avoid == "available") {
                avoid = "inactivated";
                //进行判断判断按钮的name是hotpoint，还是loadroute，对应发送不同的请求
                if(single_input.getAttribute("class") == "input-start-hidden") {
                    avoid = "available";
                    if(tools.isNotNullTrim(couple_end.value) && tools.isNotNullTrim(couple_start.value)) {
                        single_input.value = ""
                        loading.style.display = "block"
                        //当点击发送请求的时候清空模糊搜索内容
                        fuzzy_container.innerHTML = "";
                        load_container.innerHTML = "";
                        getroutepoint(type, lng, lat)
                    } else {
                        alert("请检查你的输入")
                    }
                } else if(single_input.getAttribute("class") == "input-start") {
                    if(tools.isNotNullTrim(single_input.value)) {     
                        console.log(avoid)
                        couple_end.value = ""; 
                        couple_start.value = "";                  
                        //当点击发送请求的时候清空模糊搜索内容
                        fuzzy_container.innerHTML = "";
                        load_container.innerHTML = ""
                        gethotpoint(type, lng, lat)
                    } else {
                        alert("请检查你的输入")
                    }                 
                }
            } else {
                alert("请不要频繁点击")
            }                     
        })
    }

    submit()
    //把地址的名称转变为坐标,同时向后台发送请求请求热点数据
    function gethotpoint() {
        AMap.plugin('AMap.Geocoder', function() {
            var geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: '广州'
            })
        
            geocoder.getLocation(single_input.value, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {              
                    //创建一个后台能够接受数据的对象
                    var position = {
                        time : "2017-02-01 15:31:46",
                        longitude: result.geocodes[0].location.lng,
                        latitude: result.geocodes[0].location.lat,
                    } 
                    console.log(position);                
                    $.ajax({
                        "url":  serverUrl + "/hotspot/findHotspot",
                        "method": "POST",
                        "headers": {
                        "Content-Type": "application/json"
                        },
                        "data": JSON.stringify(position),
                        "dataType": "json",
                        "async": true,
                        "crossDomain": true,
                        "complete": function() {
                            setTimeout(function() {
                                avoid = "available"
                            },3000); 
                        },
                        "success": function(data) {                      
                            if(data.code == -1) {
                                alert(data.msg)
                            } else {
                                if(data.length == 0) {
                                    alert("查询无果")
                                } else {
                                    fuzzy_container.innerHTML = ""
                                    console.log(data)
                                    showhotpoint(data.data)
                                    addhotpoint(data.data);
                                    onfcus()
                                }
                            }
                        }
                    })
                } else {
                    alert("请检查你输入的地点");
                    avoid = "available"
                    return
                }
            })
        })        
    }

    //非空载状态下的导航
    function getroutepoint(type, lng, lat) {
        //定义两个变量解决下面回调函数的异步问题
        var flag1 = 0,
            flag2 = 0,
            lonOrigin,
            latOrigin,
            lonDestination,
            latDestination;
        AMap.plugin('AMap.Geocoder', function() {
            var geocoder = new AMap.Geocoder({
            city: '广州'
            })

            if(type == "hot") {
                //热点推荐下的路径规划
                geocoder.getLocation(couple_start.value, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        lonOrigin = result.geocodes[0].location.lng;
                        latOrigin = result.geocodes[0].location.lat;     
                        $.ajax({
                            "url":  serverUrl + "/route/getRoute?lonOrigin=" + lonOrigin + "&latOrigin=" + latOrigin + "&lonDestination=" + lng + "&latDestination=" + lat,
                            "method": "POST",
                            "headers": {
                            "Content-Type": "application/json"
                            },
                            "dataType": "json",
                            "async": true,
                            "crossDomain": true,
                            "complete": function() {
                                loading.style.display = "none"
                            },
                            "success": function(data) {
                                if(data.code == -1) {
                                    console.log(data)
                                    alert(data.msg)
                                } else if(data.code == 1) {
                                    if(data.length == 0) {
                                        alert("查询无果")
                                    } else {
                                        fuzzy_container.innerHTML = "" 
                                        console.log(data);
                                        noloadroute(data.data)
                                    }
                                }
                            }
                        })                                             
                    } else {
                        alert("请检查你输入的地点");
                        loading.style.display = "none"
                        return
                    }
                })
            } else {
                //先获得第一个输入框起点的坐标
                geocoder.getLocation(couple_start.value, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        map.clearMap()
                        flag1 = 1;
                        lonOrigin = result.geocodes[0].location.lng;
                        latOrigin = result.geocodes[0].location.lat;  
                        if(flag1 == 1 && flag2 == 1) {
                            flag1 = 0; flag2 = 0;
                            $.ajax({
                                "url":  serverUrl + "/route/getRoute?lonOrigin=" + lonOrigin + "&latOrigin=" + latOrigin + "&lonDestination=" + lonDestination + "&latDestination=" + latDestination ,
                                "method": "POST",
                                "headers": {
                                "Content-Type": "application/json"
                                },
                                "dataType": "json",
                                "async": true,
                                "crossDomain": true,
                                "complete": function() {
                                    loading.style.display = "none"
                                },
                                "success": function(data) {
                                    if(data.code == -1) {
                                        console.log(data)
                                        alert(data.msg)
                                    } else if(data.code == 1) { 
                                        if(data.data.length == 0) {
                                            alert("查询无果")
                                        } else {
                                            fuzzy_container.innerHTML = "" 
                                            console.log(data);
                                            noloadroute(data.data)
                                        }
                                    }
                                }
                            })                                       
                        } 
                    } else {
                        alert("请检查你输入的地点");
                        loading.style.display = "none"
                        return
                    }
                })
                 
                //再获得第二个输入框终点的坐标
                geocoder.getLocation(couple_end.value, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        flag2 = 1;
                        lonDestination = result.geocodes[0].location.lng;
                        latDestination = result.geocodes[0].location.lat;  
                        if(flag1 == 1 && flag2 == 1) {
                            flag1 = 0; flag2 = 0;
                            $.ajax({
                                "url":  serverUrl + "/route/getRoute?lonOrigin=" + lonOrigin + "&latOrigin=" + latOrigin + "&lonDestination=" + lonDestination + "&latDestination=" + latDestination,
                                "method": "POST",
                                "headers": {
                                "Content-Type": "application/json"
                                },
                                "dataType": "json",
                                "async": true,
                                "crossDomain": true,
                                "complete": function() {
                                    loading.style.display = "none"
                                },
                                "success": function(data) {
                                    if(data.code == -1) {
                                        console.log(data)
                                        alert(data.msg)
                                    } else if(data.code == 1) {
                                        if(data.data.length != 0) {
                                            fuzzy_container.innerHTML = "" 
                                            console.log(data);
                                            noloadroute(data.data)
                                        } else {
                                            alert("查询不到结果")
                                        }
                                        
                                    }
                                }
                            })                          
                        } 
                    } else {
                        alert("请检查你输入的地点");
                        loading.style.display = "none"
                        return
                    }                      
                })
            }         
        }) 
    }

    var car_num = 0
    //非空载下的路径规划
    function noloadroute(method) {
        // releaseEvent()
        // if(document.getElementsByClassName("status-choice")[0] == "空载") {
        //     submit("hot", hotpoint[i].longitude, hotpoint[i].latitude)    
        // } else {
        //     submit()
        // }
        
        load_container.style.display = "block";
        let str = "";
        for(let i = 0; i < method.length; i++) {
            str += noloadstr(method[i], i);
        }
        load_container.innerHTML = str;
        for (let i = 0; i < method.length; i++) {
           let node = document.getElementsByClassName("method-recommand-container")[i];
            node.onclick = function () {
                load_container.style.display = "block"
                //当点击一个时还原另外两个的颜色
                for(var i = 0; i < method.length; i++) {
                    document.getElementsByClassName("method-recommand-container")[i].style.color = "black";
                }
                this.style.color = "#4c93fd";
                var k = this.getAttribute("num");
                loadplugin(changform(method[k].route), "history", color[car_num], car_num);
                console.log(pathSimplifierIns)
                if(car_num == 0 && pathSimplifierIns[2] != null) {
                    pathSimplifierIns[2].hide()
                }
                if(car_num >=1) {                 
                    console.log(car_num)
                    pathSimplifierIns[car_num - 1].hide()
                    if(car_num == 2) {
                        car_num = -1;
                        pathSimplifierIns.length = 0;
                    } 
                } 
                car_num++; 
                       
                map.setFitView();             
            };
        }

       document.getElementsByClassName("method-recommand-container")[method.length - 1].style.marginBottom = "1rem";
    }

    function changform(path) {
        var arry = new Array();
        var taxi_point = new Array();

        for(let i = 0; i < path.length; i++) {      
            taxi_point[i] = [path[i].lng,path[i].lat]
            arry.push(taxi_point[i]);   
        }

        return arry;
    }

    function noloadstr(method, i) {
        var context = `<div class="method-recommand-container" num="${i}">
            <div class="method-recommand">方案${i + 1}</div>
                <ul class="method-recommand method-recommand-ul">
                    <li>${method.time}分钟</li>
                    <li>|</li>
                    <li>${method.distance}公里</li>
                </ul>
            </div>`

        return context      
    }

    //颜色的映射
    function heatColor(heatVaule) {
        if(heatVaule <= 2) {
            return "#fefbd8"
        } else if(heatVaule > 2 && heatVaule <=4) {
            return "#fff001"
        } else if(heatVaule > 4 && heatVaule <= 6) {
            return "#f6aa00"
        } else if(heatVaule > 6 && heatVaule <= 9) {
            return "#e85521"
        } else if(heatVaule > 9 && heatVaule <= 10) {
            return "#e50112"
        }
    }
    //热点推荐
    //还要传入热度值
    function addhotpoint(json_information) {
        for(var i = 0; i < json_information.length; i++){
            var center = [json_information[i].longitude, json_information[i].latitude];
            var circleMarker = new AMap.CircleMarker({
              center:center,
              radius: 15,
              strokeWeight:2,
              strokeOpacity: 0.5,
              fillColor:  heatColor(json_information[i].heat),
              fillOpacity: 1,
              zIndex:10,
              bubble:true,
              cursor:'pointer',
              clickable: true
            })
            circleMarker.setMap(map)
        }  
        map.setFitView();      
    }

    //把后台返回的热点信息显示在前端
    function showhotpoint(hotpoint) {
        var context = null;
        //每一次添加热点把上次的热点清空
        hot_point.innerHTML = ""
        if(hotpoint.length == 0) {
            alert("抱歉该处没有热点")
        } else {
            for(var i = 0; i < hotpoint.length; i++) {
                context = addpoint(hotpoint[i]);
                hot_point.innerHTML += context;
            }  
            var hot_point_result  = hot_point.getElementsByClassName("hot-point-recommand");
            //在最后一个元素后加一个下边距
            hot_point_result[hot_point_result.length - 1].style.marginBottom = "1.5rem";
        }

        for(let i = 0; i < hot_point_result.length; i++) {
            hot_point_result[i].onclick = function () {
                //还原原来所选字的颜色
                for(var j = 0; j < document.getElementsByClassName("hot-point-recommand").length; j++) {
                    document.getElementsByClassName("hot-point-recommand")[j].style.color = "black";
                }
                this.color = "#4c93fd";
                //切换搜索框,同时把在搜索框的终点上,加上所选择的字段
                var end_name = single_input.value;
                document.getElementsByClassName("input-start-end-contaniner")[0].style.display = "block";
                single_input.setAttribute("class", "input-start-hidden");
                couple_end.value = end_name ;
                console.log(i)
                console.log(hotpoint)
                console.log(hotpoint[i])
                map.setFitView(new AMap.Marker({
                    position: [hotpoint[i].longitude, hotpoint[i].latitude]
                }));
                releaseEvent() 
                submit("hot", hotpoint[i].longitude, hotpoint[i].latitude)              
            }
        }
    }

    //用innerhtml解除原来的绑定事件，同时换上新的oncilick事件
    function releaseEvent() {
        document.getElementsByClassName("button-contaniner")[0].innerHTML = 
        " <div class='clear-routes-btn'>清除路线</div><div class='search-btn' name='loadroute'>搜索</div>"
        bindClear()
    }

    // //在地图上点出后台返回的热点数据
    function addpoint(hotpoint) {
        //每次生成点都要清除上一次的点
        map.clearMap();
        var point1 = normalpoint(hotpoint.latitude);
        var point2 = normalpoint(hotpoint.longitude);
        var context = `<div class="hot-point-recommand">
                <div class="hot-point-icon">
                    <div class="show-lng-lat">
                        北纬${point1[0]}°${point1[1]}'${point1[2]}'' 东经${point2[0]}°${point2[1]}'${point2[2]}''
                    </div>
                    <div class="show-shot-rank">
                        热度值:${hotpoint.heat}
                    </div>
                </div>
            </div>`

        point1 = null;
        point2 = null;
        return context  
    }

    //火星坐标转变成标准经纬度坐标带时分秒
    function normalpoint(point) {
        point = point.toFixed(4)
        var pointarray = new Array();
        point = point.toString();
        //截取整数部分充当时
        pointarray.push(point.substring(0,point.indexOf(".",0)))
        //截取小数部分
        var floatpoint = point.substring(point.indexOf(".",0),point.length)*60;
        floatpoint = floatpoint.toString();
        //乘60之后截取整数部分当分
        pointarray.push(floatpoint.substring(0,floatpoint.indexOf(".",0)));
        //取下整数部分*60充当秒
        pointarray.push((floatpoint.substring(floatpoint.indexOf(".",0),floatpoint.length)*60).toFixed(0).toString());

        return pointarray
    }

    //给每一个显示的热点添加点击事件，当点击每一个时切换到两个输入的搜索框
    for(let i = 0; i < document.getElementsByClassName("hot-point-recommand").length; i++) {
        document.getElementsByClassName("hot-point-recommand")[i].onclick = function() {
            document.getElementsByClassName("input-start").style.display = "none";
            document.getElementsByClassName("input-start-end-contaniner").style.display = "block"
            document.getElementById("input-departure").value = this.innerHTML;
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
        if(type == "hot") {
            imagestart(routes[0])
        } else if(type == "history") {
            //添加图片
            addimage(routes[0],routes[routes.length - 1])
        }
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
        map.setFitView();
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

    return {
        clear: clear
    }
});



