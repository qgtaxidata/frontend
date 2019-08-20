define(["require", "tools"], function (require) {

    let tools = require('tools');

    let con = document.getElementsByClassName("abnormal")[0];
    let left = con.getElementsByClassName("left")[0];
    let right = con.getElementsByClassName("right")[0];
    let bottom = con.getElementsByClassName("bottom")[0];
    let leftForm = left.getElementsByClassName("form");
    let rightForm = right.getElementsByClassName("form");
    let bottomForm = bottom.getElementsByClassName("form");

    // rightChart.showLoading({
    //     text: '正在努力获取数据中...',		
    // });
    // rightChart.hideLoading();
    function createLeftOption() {
        let option = {
            title: {
                text: '阶梯瀑布图',
                left: 'center',
                subtext: 'QG 之回家的诱惑番外我们必回家'
            },
            color: "#4c93fd",
            grid: {
                bottom: '0',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                barWidth: '50%',
            }]
        };

        return option;
    }
    function createRightOption(title) {
        var option = {
            title: {
                text: title,
                left: 'center',
                textStyle: {
                    fontSize: "15",
                    fontStyle: "normal"
                }

            },
            legend: {
                orient: 'vertical',
                left: 'right',
                top: 'top',
                data: ['异常指数', '正常指数']
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: "60%",
                    data: [
                        { name: '异常指数', value: Math.random() * 100 },
                        { name: '正常指数', value: Math.random() * 100 }
                    ]
                },
            ]
        };
        return option;
    }
    function createBottomOption(title) {
        let timeArr = [];
        let data = [];
        let normal = [0.09, 0.37, 0.40, 0.39, 0.77, 0.09, 0.45, 0.13, 0.03, 0.38, 0.40, 0.22, 0.25, 0.69, 0.94, 0.36, 0.80, 0.92, 0.24, 0.52, 0.190, 0.194, 0.37, 0.90];
        for (let i = 0; i < 24; i++) {
            timeArr[i] = `${i > 9 ? i : ("0" + i)}:00`;
            data[i] = Math.random();
        }
        let option = {
            title: {
                text: title,
                left: 'right',
            },
            grid: {
                bottom: '0',
                containLabel: true
            },
            legend: {
                left: 'left',
                top: 'top',
                data: ['异常情况', '正常情况']
            },
            xAxis: {
                type: 'category',
                data: timeArr,
                axisTick: {
                    // alignWithLabel: true,   
                    interval: 6
                },
                axisLabel: {
                    interval: 6
                },
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: "异常情况",
                data: data,
                smooth: true,
                showSymbol: false,
                type: 'line',
                color: "#ff0000"
            }, {
                name: "正常情况",
                data: normal,
                smooth: true,
                showSymbol: false,
                type: 'line',
                color: "#4c93fd"
            }]
        };

        return option;

    }

    let leftChart = echarts.init(leftForm[0]);
    leftChart.setOption(createLeftOption());

    let rightChart = [];
    for (let i = 0; i < rightForm.length; i++) {
        rightChart[i] = echarts.init(rightForm[i]);
        rightChart[i].setOption(createRightOption(i));
    }

    let bottomChart = []
    for (let i = 0; i < bottomForm.length; i++) {
        bottomChart[i] = echarts.init(bottomForm[i]);
        bottomChart[i].setOption(createBottomOption(i));
    }

    // 地区选择，切换饼状图
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

        if (event.target.nodeName == "LI") {
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

    // 异常车辆选择，切换折线图
    let carClickJudge = true;
    let carArr = [];
    for (let item of bottom.children) {
        carArr.push(item.getAttribute("class"));
    }

    bottom.onclick = function () {
        if (!carClickJudge) {
            return;
        }
        carClickJudge = false;
        setTimeout(function () {
            carClickJudge = true;
        }, 1000)

        let form = event.target.parentNode.parentNode;

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

});


