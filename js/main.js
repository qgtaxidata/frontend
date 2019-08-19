define(["require", "tools"], function (require) {

	let tools = require('tools');



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
			sidebar.style.height = "21rem";

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
				event.target.getElementsByTagName('ul')[0].style.height = "18.8rem"
			} else {
				sidebar.children[2].getElementsByTagName('ul')[0].style.height = "0";
			}
			let pre = barRegList.getElementsByClassName("on-region")[0] || null;
			if (pre) {
				pre.classList.remove("on-region");
			}
			formClose();
		} else if (event.target.nodeName == "LI") {
		}
		let regDataCon =  document.getElementsByClassName("region")[0].getElementsByClassName("data-container")[0];
		if (event.target.innerText != "出租车司机收入排行榜") {
			regDataCon.style.display = "none";
		}
	}

	// 图表容器
	let changeJudge = true;
	function formClose () {
		formCon.style.display = "none";
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
		
		next.setAttribute("class", "echartsCon onShow");
		onShow.setAttribute("class", "echartsCon pre");
		pre.setAttribute("class", "echartsCon next");
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
		
		pre.setAttribute("class", "echartsCon onShow");
		onShow.setAttribute("class", "echartsCon next");
		next.setAttribute("class", "echartsCon pre");		
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
		}
	}
	
	

});