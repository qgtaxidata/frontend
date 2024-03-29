define(["require", "tools"], function (require) {

    let tools = require('tools');

    let con = document.getElementsByClassName("abnormal")[0];
    let left = con.getElementsByClassName("left")[0];
    let right = con.getElementsByClassName("right")[0];
    let bottom = con.getElementsByClassName("bottom")[0];
    let leftForm = left.getElementsByClassName("form");
    let rightForm = right.getElementsByClassName("form");
    
    let carClickJudge = true;
    let carArr = [];

    let carIntervalId = null;

    // rightChart.showLoading({
    //     text: '正在努力获取数据中...',		
    // });
    // rightChart.hideLoading();
    function createLeftOption(data) {
        let xArr = [];
        for (let i = 0; i < data.x.length; i++) {
            xArr[i] = toArea(data.x[i]);
        }
        let option = {
            // title: {
            //     text: data.title,
            //     left: 'right',
            // },
            color: "rgba(255, 0, 0, 0.45)",
            grid: {
                left: 'right',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: "{b} : {c}辆"
            },
            angleAxis: {
                type: 'category',
                data: xArr,
                z: 10,
            },
            radiusAxis: {
                axisLabel: {
                    formatter: `{value}辆`,
				}
            },
            polar: {
            },
            series: {
                type: 'bar',
                data: data.y,
                coordinateSystem: 'polar',
            },
        };

        return option;
    }
    function createRightOption(data) {
        var option = {
            title: {
                text: `${toArea(data.area)} 异常车辆概率分布`,
                left: 'center',
                textStyle: {
                    fontSize: "15",
                    fontStyle: "normal"
                }

            },
            color: ["#d48265", " #91c7ae"],
            tooltip : {
                trigger: 'item',
                formatter: "{b} : {d}%"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                top: 'top',
                data: ['异常比例(%)', '正常比例(%)']
            },
            series: [
                {
                    type: 'pie',
                    radius: "65%",
                    data: [
                        { name: '异常比例(%)', value: data.abnormal },
                        { name: '正常比例(%)', value: data.normal }
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 8,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(1, 1, 1, 0.2)'
                        }
                    }
                },
            ]
        };
        return option;
    }
    function createBottomOption(normalData, abnormalData) {
        let timeArr = [];
        let data = abnormalData.distribution;
        let normal = normalData;
        for (let i = 0; i < 24; i++) {
            timeArr[i] = `${i > 9 ? i : ("0" + i)}:00`;
            data[i] = (100 * data[i]).toFixed(2);
        }
        let option = {
            title: {
                text: `${abnormalData.license}`,
                subtext: `规律分布: 指该车辆在此刻载客的概率`,
                left: 'right',
                subtextStyle: {
					color: "#666"
				}
            },
            tooltip: {
                trigger: 'axis',
                formatter: "正常：{c1}%的概率在{b1}载客 <br/>异常：{c0}%的概率在{b0}载客 "
			},
            grid: {
                bottom: '0',
                containLabel: true
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                top: 'top',
                data: ['异常车辆规律分布', '正常车辆规律分布']
            },
            xAxis: {
                type: 'category',
                data: timeArr,
                axisTick: {
                    alignWithLabel: true,   
                    // interval: 1
                },
                // axisLabel: {
                //     interval: 1
                //     formatter: `{value}h`
                // },
            },
            yAxis: {
                type: 'value',
                max: 12,
                axisLabel: {
					formatter: `{value} %`
				}
            },
            series: [{
                name: "异常车辆规律分布",
                data: data,
                smooth: true,
                showSymbol: false,
                type: 'line',
                color: "#ff9966"
            }, {
                name: "正常车辆规律分布",
                data: normal,
                smooth: true,
                showSymbol: false,
                type: 'line',
                color: "#5793f3"
            }]
        };

        return option;

    }
    
    function creatCarChart(normal, abnormal) {

        for(let i = 0; i < normal.length; i++) {
            normal[i] = (100 * normal[i]).toFixed(2);
        }

        bottom.innerHTML = "";
        let str = "";
        for(let i = 0; i < abnormal.length; i++) {
            if (i < 3) {
                str += `<div class="form car${i+1}"></div>`;
            } else {
                str += `<div class="form"></div>`;
            }
        }
        bottom.innerHTML = str;
        bottom.onclick = bottomClick; 
        for (let item of bottom.children) {
            carArr.push(item.getAttribute("class"));
        }
        
        let bottomChart = [];
        let bottomForm = bottom.getElementsByClassName("form");
        for (let i = 0; i < abnormal.length; i++) {
            bottomChart[i] = echarts.init(bottomForm[i]);
            bottomChart[i].setOption(createBottomOption(normal, abnormal[i]));
        }      
    }

    // 地区选择
    let regClickJudge = true;
    let regChoice = right.getElementsByClassName("reg-choice")[0];
    regChoice.onclick = function () {
        if (!regClickJudge) {
            return;
        }
        regClickJudge = false;
        setTimeout(function () {
            regClickJudge = true;
        }, 1000)

        if (event.target.nodeName == "LI" || falseEvent == "") {
            let pre = regChoice.getElementsByClassName("on-choice")[0];
            let now = event.target;
            pre.classList.remove("on-choice");
            now.classList.add("on-choice");
            let preIndex = pre.getAttribute("tle");
            let nowIndex = now.getAttribute("tle");
            rightForm[preIndex].classList.remove("on-show");
            rightForm[nowIndex].classList.add("on-show");
        }
    }
    
    bottom.onmouseover = function() {
        clearInterval(carIntervalId);
    }
    bottom.onmouseout = function() {
        carIntervalId = setInterval(function() {
            bottomClick();
        }, 2000);
    }
        
    // 车辆选择
    function bottomClick() {
        if (!carClickJudge) {
            return;
        }
        carClickJudge = false;
        setTimeout(function () {
            carClickJudge = true;
        }, 1000)
        
        let form;
        if (event) {
            form = event.target.parentNode.parentNode;
        } else {
            form = bottom.getElementsByClassName("car3")[0];
        }

        if (form.classList[1] == "car1") {
            carArr.push(carArr[0]);
            carArr.shift();
            for (let i = 0; i < carArr.length; i++) {
                bottom.children[i].setAttribute("class", carArr[i]);
            }
        } else if (form.classList[1] == "car3") {
            carArr.unshift(carArr[carArr.length - 1]);
            carArr.pop();
            for (let i = 0; i < carArr.length; i++) {
                bottom.children[i].setAttribute("class", carArr[i]);
            }
        }
    }
    
    // 地区编号转化地区名称
    function toArea(number) {
        if (number == "0") {
            return "全广州";
        } else if (number == "1") {
            return "花都区";
        } else if (number == "2") {
            return "南沙区";
        } else if (number == "3") {
            return "增城区";
        } else if (number == "4") {
            return "从化区";
        } else if (number == "5") {
            return "番禺区";
        } else if (number == "6") {
            return "白云区";
        } else if (number == "7") {
            return "黄埔区";
        } else if (number == "8") {
            return "荔湾区";
        } else if (number == "9") {
            return "海珠区";
        } else if (number == "10") {
            return "天河区";
        } else if (number == "11") {
            return "越秀区";
        } else {
            return "";
        }

    }

    function getData() {
        $.ajax({
            "url": serverUrl + "/analyse/abnormalTaxiAnalysis",
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            },
            "dataType": "json",
            "async": true,
            "crossDomain": true,
            "success": function (data) {
                console.log(data);
                if (data.code == 1) {
                    let leftChart = echarts.init(leftForm[0]);
                    leftChart.setOption(createLeftOption(data.data.bar));

                    let rightChart = [];
                    for (let i = 0; i < rightForm.length; i++) {
                        let pie = data.data.pies.pie[i];
                        rightChart[i] = echarts.init(rightForm[i]);
                        rightChart[i].setOption(createRightOption(pie));
                    }

                    let normal = data.data.cars.normal_distribution;
                    let abnormal = data.data.cars.abnormal;
                    creatCarChart(normal, abnormal);

                    carIntervalId = setInterval(function() {
                        bottomClick();
                    }, 2000);
                    
                } else {
                    alert(data.msg);
                }
            }
        })
    }
    getData();

});


