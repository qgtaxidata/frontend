define(["require", "route"],function() {

    //引入别的文件路径规划函数
    var loadplugin = require('route').loadplugin;
    //热点推荐的容器框
    var hot_point = document.getElementsByClassName("hot-point-container")[0]; 
    //非空载状态下路径可视化的容器框
    var load_container=  document.getElementsByClassName("load-ul")[0];
    //搜索确认框
    var comfirm_btn = document.getElementsByClassName("search-btn")[0]
    //单个输入框时的inoput名称
    var single_input = document.getElementById("start");
    //两个输入框时的起点输入框
    var couple_start = document.getElementById("input-departure");
    //两个输入框时的终点输入框
    var couple_end = document.getElementById("input-destination");
    //模糊搜索容器框
    var fuzzy_container = document.getElementsByClassName("fuzzy-contaniner")[0]

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

    //给搜索框的取消按钮添加取消功能
    var wrong_icon = document.getElementsByClassName("cha-icon");
    wrong_icon[0].onclick = function() {
        document.getElementById("input-departure").value = "";
    }

    wrong_icon[1].onclick = function() {
        document.getElementById("input-destination").value = ""
    }


    //给三个输入框添加模糊搜索功能
    function fuzzysearch (inputid) {
        map.plugin('AMap.Autocomplete',function() {
            var autoOptions = {
                // input 为绑定输入提示功能的input的DOM ID
                input: inputid,
                output: 'fuzzy-search-contanier'
            }
           new AMap.Autocomplete(autoOptions); 
        })
    }

    fuzzysearch ("start");
    fuzzysearch ("input-departure");
    fuzzysearch ("input-destination"); 

    //用户点击搜索把名称转变为坐标向后台发请求
    $(function() {
        $('.search-btn').click(function() {
            //进行判断判断按钮的name是hotpoint，还是loadroute，对应发送不同的请求
            if(single_input.getAttribute("class") == "input-start-hidden") {
                //当点击发送请求的时候清空模糊搜索内容
                fuzzy_container.innerHTML = ""
                getroutepoint()

            } else if(single_input.getAttribute("class") == "input-start") {
                //当点击发送请求的时候清空模糊搜索内容
                fuzzy_container.innerHTML = ""
                gethotpoint()
            }
        })
    })

    function submitloadroute() {
        console.log($('.search-btn').attr("name"));
    }

    //把地址的名称转变为坐标,同时向后台发送请求请求热点数据
    function gethotpoint() {
        AMap.plugin('AMap.Geocoder', function() {
            var geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: '广州'
            })
        
            geocoder.getLocation(single_input.value, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                console.log([result.geocodes[0].location.lng,result.geocodes[0].location.lat])   
                
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
                    "success": function(data) {
                        console.log(data)
                        showhotpoint(data.data)
                        addhotpoint(data.data);
                    }
                })
            }
            })
        })        
    }

    //非空载状态下的导航
    function getroutepoint() {
        //定义两个变量解决下面回调函数的异步问题
        var flag1 = 0,
            flag2 = 0,
            lonOrigin,
            latOrigin,
            lonDestination,
            latDestination;
        AMap.plugin('AMap.Geocoder', function() {
            var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: '广州'
            })
            //先获得第一个输入框起点的坐标
            geocoder.getLocation(couple_start.value, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    flag1 = 1;
                    lonOrigin = result.geocodes[0].location.lng;
                    latOrigin = result.geocodes[0].location.lat;  
                    if(flag1 == 1 && flag2 == 1) {
                        var obj = {
                            lonOrigin: lonOrigin,
                            latOrigin: latOrigin,
                            lonDestination: lonDestination,
                            latDestination: latDestination
                        }
                        flag1 = 0; flag2 = 0;
                        $.ajax({
                            "url":  serverUrl + "/route/getRoute/?lonOrigin=" + lonOrigin + "&latOrigin=" + latOrigin + "&lonDestination=" + lonDestination + "&latDestination=" + latDestination ,
                            "method": "POST",
                            "headers": {
                            "Content-Type": "application/json"
                            },
                            "dataType": "json",
                            "async": true,
                            "crossDomain": true,
                            "success": function(data) {
                                if(data.code == -1) {
                                    console.log(data)
                                    alert(data.msg)
                                } else if(data.code == 1) {
                                    console.log(data)
                                    noloadroute(data.data)
                                }
                            }
                        })                                       
                    }
                }
            })
            //再获得第二个输入框终点的坐标
            geocoder.getLocation(couple_end.value, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    flag2 = 1;
                    lonDestination = result.geocodes[0].location.lng;
                    latDestination = result.geocodes[0].location.lat;  
                    if(flag1 == 1 && flag2 == 1) {
                        var obj = {
                            lonOrigin: lonOrigin,
                            latOrigin: latOrigin,
                            lonDestination: lonDestination,
                            latDestination: latDestination
                        }
                        flag1 = 0; flag2 = 0;
                        $.ajax({
                            "url":  serverUrl + "/route/getRoute/?lonOrigin=" + lonOrigin + "&latOrigin=" + latOrigin + "&lonDestination=" + lonDestination + "&latDestination=" + latDestination,
                            "method": "POST",
                            "headers": {
                            "Content-Type": "application/json"
                            },
                            "dataType": "json",
                            "async": false,
                            "crossDomain": true,
                            "success": function(data) {
                                if(data.code == -1) {
                                    console.log(data)
                                    alert(data.msg)
                                } else if(data.code == 1) {
                                    console.log(data);
                                    noloadroute(data.data)
                                }
                            }
                        })                          
                    }
                }
            })
        })        
    }

    // var method1 = [
    //     {
    //         method: "方案一",
    //         time: "23分钟",
    //         mile: "23公里"
    //     },
    //     {
    //         method: "方案一",
    //         time: "23分钟",
    //         mile: "23公里"
    //     },
    //     {
    //         method: "方案一",
    //         time: "23分钟",
    //         mile: "23公里"
    //     },
    //     {
    //         method: "方案一",
    //         time: "23分钟",
    //         mile: "23公里"
    //     },
    //     {
    //         method: "方案一",
    //         time: "23分钟",
    //         mile: "23公里"
    //     },
    //     {
    //         method: "方案一",
    //         time: "23分钟",
    //         mile: "23公里"
    //     },
    // ]

    //非空载下的路径规划
    function noloadroute(method) {
        load_container.style.display = "block";
        let str = "";
        for(let i = 0; i < method.length; i++) {
            str += noloadstr(method[i], i);
        }
        load_container.innerHTML = str;
        for (let i = 0; i < method.length; i++) {
           let node = document.getElementsByClassName("method-recommand-container")[i];
            node.onclick = function () {
                //当点击一个时还原另外两个的颜色
                for(var i = 0; i < method.length; i++) {
                    document.getElementsByClassName("method-recommand-container")[i].style.color = "black";
                }
                this.style.color = "#4c93fd";
                var k = this.getAttribute("num");
                console.log(method[k].route);
                console.log(changform(method[k].route));
                loadplugin(changform(method[k].route), "history")
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



    // noloadroute(method1)
    //热点推荐
    function addhotpoint(json_information) {
        var arr = new Array();
        for(let k = 0; k < json_information.length; k++) {
                arr[k] = new AMap.Marker({
                        position: new AMap.LngLat(json_information[k].longitude,json_information[k].latitude)
                });
                map.add(arr[k]);      
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

        for(var i = 0; i < hot_point_result.length; i++) {
            hot_point_result[i].onclick = function () {
                //还原原来所选字的颜色
                for(var i = 0; i < document.getElementsByClassName("hot-point-recommand").length; i++) {
                    document.getElementsByClassName("hot-point-recommand")[i].style.color = "black";
                }
                this.color = "#4c93fd";
                //切换搜索框,同时把在搜索框的终点上,加上所选择的字段
                var end_name = this.innerHTML
                document.getElementsByClassName("input-start-end-contaniner")[0].style.display = "block";
                single_input.setAttribute("class", "input-start-hidden");
                couple_end.value = end_name ;
                //把地图的视野聚焦到那个点上
                map.setFitView([m1, m2]);
                //////////////////////////////////还没有做完
            }
        }

    }

    //在地图上点出后台返回的热点数据
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

    //车空载状态下的的方案，道路拥挤度的显示
    // (function() {
    //     var road_information_arrow = document.getElementsByClassName("method-arrow-icon");

    //     for(let i = 0; i < road_information_arrow.length; i++) {
    //         road_information_arrow[i].onclick = function() {
    //             if(this.parentNode.getAttribute("class") == "method-recommand-container") {
    //                 this.src = "images/shouqi.png";
    //                 this.parentNode.setAttribute("class", "method-recommand-container-show");
    //             } else if(this.parentNode.getAttribute("class") == "method-recommand-container-show"){
    //                 this.src = "images/xiala.png";
    //                 this.parentNode.setAttribute("class", "method-recommand-container");
    //             }
    //         }
    //     }  
    // })()

//当点击不同方案的时候，改变字体颜色，同时执行对应方案的道路规划
// (function() {
//     var road_information = document.getElementsByClassName("method-recommand-container") 
//     || document.getElementsByClassName("method-recommand-container-show")
//     for(var i = 0; i < road_information.length; i++) {
//         road_information[i].onclick = function() {

//         }
//     }
// })()
});



