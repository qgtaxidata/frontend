define(["require", "tools", "heatmap", "billboard", "route","search"], function (require) {

	let tools = require('tools');

	let clearFun = {
		heatmap: require("heatmap").clear,
		billboard: require("billboard").clear,
		route: require("route").clear,
		search: require("search").clear
	}



	let sidebarClick = document.getElementsByClassName('sidebar-click')[0];
	let sidebar = document.getElementsByClassName('sidebar')[0];
	let onSidebar = "search";
	let sidebarClickJudge = true;
	let barRegList = sidebar.getElementsByClassName('bar-reg-list')[0];
	sidebarClick.onclick = function () {
		if (!sidebarClickJudge) {
			return;
		}
		sidebarClickJudge = false;
		setTimeout(function() {
			sidebarClickJudge = true;
		}, 1000);

		if (sidebar.getAttribute('tle') == "hiden") {
			sidebar.style.height = "24.3rem";

			sidebar.setAttribute('tle',"show");
			setTimeout(function() {
				sidebar.style.overflow = "visible";
			}, 1000)
		} else {
			sidebar.style.height = "0rem";
			sidebar.style.overflow = "hidden";
			sidebar.setAttribute('tle',"hiden");
		}
	}

	sidebar.onclick = function() {
		if (event.target != this && event.target.nodeName == "DIV") {
			sidebar.getElementsByClassName("on-sidebar")[0].classList.remove("on-sidebar");
			event.target.classList.add("on-sidebar");
			document.getElementsByClassName(onSidebar)[0].style.display = "none";
			onSidebar = event.target.getAttribute('tle');
			document.getElementsByClassName(onSidebar)[0].style.display = "block";
			if (event.target == barRegList.parentNode) {
				event.target.getElementsByTagName('ul')[0].style.height = "15.7rem"
			} else {
				sidebar.children[2].getElementsByTagName('ul')[0].style.height = "0";
			}
			formClose();
			clearFun.heatmap();
			clearFun.billboard();
			clearFun.route();
			clearFun.search();
		} else if (event.target.nodeName == "LI") {
		}
		let regDataCon =  document.getElementsByClassName("region")[0].getElementsByClassName("data-container")[0];
		if (event.target.innerText != "出租车司机收入排行榜") {
			if (regDataCon.style.display != "none") {
				regDataCon.style.display = "none";
			}
		}
	}

	// 图表容器
	let changeJudge = true;

	function formClose () {
		formCon.style.display = "none";
		if(onSidebar == "region") {
			let pre = barRegList.getElementsByClassName("on-region")[0] || null;
			// if (pre && pre.innerText != "出租车司机收入排行榜") {
			// 	pre.classList.remove("on-region");
			// }
		}
	}
	function formNext() {

		if (!changeJudge) {
			return;
		}
		changeJudge = false;
		setTimeout(function() {
			changeJudge = true;
		}, 1500)

		let onShow = formCon.getElementsByClassName("onShow")[0];
		let pre = formCon.getElementsByClassName("pre")[0];
		let next = formCon.getElementsByClassName("next")[0];

		let page = formCon.getElementsByClassName("page")[0];
		let onPage = page.getElementsByClassName("onPage")[0];
		let nextPage = page.getElementsByClassName("nextPage")[0];
		let prePage = page.getElementsByClassName("prePage")[0];
		
		next.setAttribute("class", "echartsCon onShow");
		onShow.setAttribute("class", "echartsCon pre");
		pre.setAttribute("class", "echartsCon next");

		nextPage.setAttribute("class", "onPage");
		onPage.setAttribute("class", "prePage");
		prePage.setAttribute("class", "nextPage");
	}
	function formPre() {

		if (!changeJudge) {
			return;
		}
		changeJudge = false;
		setTimeout(function() {
			changeJudge = true;
		}, 1500)

		let onShow = formCon.getElementsByClassName("onShow")[0];
		let pre = formCon.getElementsByClassName("pre")[0];
		let next = formCon.getElementsByClassName("next")[0];

		let page = formCon.getElementsByClassName("page")[0];
		let onPage = page.getElementsByClassName("onPage")[0];
		let nextPage = page.getElementsByClassName("nextPage")[0];
		let prePage = page.getElementsByClassName("prePage")[0];
		
		pre.setAttribute("class", "echartsCon onShow");
		onShow.setAttribute("class", "echartsCon next");
		next.setAttribute("class", "echartsCon pre");	

		prePage.setAttribute("class", "onPage");
		onPage.setAttribute("class", "nextPage");
		nextPage.setAttribute("class", "prePage");	
	}
	function pageClick() {
		
		let clickChoice = event.target.getAttribute("class");
		if(clickChoice == "prePage") {
			formPre();
		} else if(clickChoice == "nextPage") {
			formNext();
		} else {
			return;
		}
	}

	formCon.onclick = function() {
		if(event.target && event.target.getAttribute("click") == "formClose") {
			formClose();
			event.stopPropagation();
		} else if(event.target && event.target.getAttribute("click") == "formNext") {
			formNext();
			event.stopPropagation();
		} else if(event.target && event.target.getAttribute("click") == "formPre") {
			formPre();
			event.stopPropagation();
		} else if(event.target && event.target.getAttribute("click") == "pageClick") {
			pageClick();
			event.stopPropagation();
		}
	}
	

	

});