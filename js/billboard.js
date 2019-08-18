define(["require", "tools"], function (require) {

  	let tools = require('tools');  

  	 // 广告牌推荐容器
  	let con = document.getElementsByClassName('billboard')[0]; 
  	
  	// 地区选择容器
  	let regionCon = con.getElementsByClassName('region-choice')[0];
  	// 天数类型容器
  	let dateTypeCon = con.getElementsByClassName("date-type-choice")[0];
  	// 目标时段容器
  	let timeIntervalCon = con.getElementsByClassName("time-interval-choice")[0];
    // 刷新按钮
    let refresh = con.getElementsByClassName("refresh")[0];
    // 广告牌推荐点数据 容器
    let dataCon = con.getElementsByClassName("data-container")[0];
    // 防止频繁监控
  	let clickJudge = true;
  	
  	function liFun() {
  		let input = this.getElementsByTagName("input")[0];
  		input.value = event.target.innerText;
  		imgFun.call(this);
  		if (this.getAttribute("class") == "region-choice") {
  			let area = event.target.getAttribute("tle");
  			input.setAttribute("tle", area);
  		}
  	}

  	function imgFun() {
  		let img = this.getElementsByTagName("img")[0];
  		let ul = this.getElementsByTagName("ul")[0];
        if (img.getAttribute("tle") == "xiala") {
        	img.setAttribute("tle", "shouqi");
        	img.setAttribute("src", "./images/shouqi.png");
        	if (this.getAttribute("class") == "region-choice") {
        		ul.setAttribute('style', "height: 20.5rem;padding-top: 1.5rem;");
        	} else {
        		ul.setAttribute('style', "height: 6rem;padding-top: 1.5rem;");
        	}	
        } else {
        	img.setAttribute("tle", "xiala");
        	img.setAttribute("src", "./images/xiala.png");
        	ul.setAttribute('style', "height: 0;");
        }
  	}

  	function chooseFun() {
  		if (event.target.nodeName == "IMG") {
  			imgFun.call(this);
  		} else if (event.target.nodeName == "LI") {
  			liFun.call(this);
  		}
  	}

  	regionCon.onclick = chooseFun.bind(regionCon);
  	dateTypeCon.onclick = chooseFun.bind(dateTypeCon);
  	timeIntervalCon.onclick = chooseFun.bind(timeIntervalCon);
    
    refresh.onclick = positionAjax;
    // 请求推荐点 
  	function positionAjax() {

  		// 点击频率限制，0.5秒
  		if (!clickJudge) {
    		return false;
    	}
    	clickJudge = false;
    	setTimeout(function() {
    		clickJudge = true;
    	}, 500);


  		// 地区代号
  		let a = con.getElementsByClassName("region-value")[0].getAttribute("tle");
  		// 日期类型
  		let b = con.getElementsByClassName("date-type-value")[0].value;
  		// 时段
  		let c = con.getElementsByClassName("time-interval-value")[0].value;
  		

  		let send = {
  			a: a,
  			b: b,
  			c: c
  		}

  		console.log(send);
        

  		// AJAX
  		// 获得返回的值data
        
        //insertFun(data)
  		//调用一个函数insertFun(data)将数据插入<div class="data-container">

  	}
    
    // 数据插入 
  	function insertFun(data) {
  		// 出现容器
  		dataCon.style.display = "block";
    	// 清空容器原本数据
    	dataCon.innerHTML = "";
    	// 插入得到的数据，生成节点,
    	dataCon.innerHTML = "data";

    	// 给生成的节点绑定地图显示点事件 
    	// 显示图表按钮绑定点击事件, 请求图表数据 formAjax()

  	}
    // 请求图表数据 
  	function formAjax() {
  		// 需要请求后台，加一个防止频繁点击，参考如上

  		// Ajax，获取图表数据data

  		// 用获取到的数据生成图表，调用formShow(data)函数	
  	}
  	// 生成图表
  	function formShow(data) {
  		// 图表容器
  		let formCon = document.getElementsByClassName("form-container")[0];
    	// 显示容器
    	formCon.style.display = "block";
    	// 清空数据
    	formCon.innerHTML = "";
    	// 插入数据
    	formCon.innerHTML += `data`
  	}

});