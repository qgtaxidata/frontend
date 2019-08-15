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
		if (sidebar.getAttribute('tle') == "hiden") {
			sidebar.style.height = "17.7rem";

			sidebar.setAttribute('tle',"show");
			setTimeout(function() {
				sidebar.style.overflow = "visible";
			}, 1000)
		} else {
			sidebar.style.height = "0rem";
			sidebar.style.overflow = "hidden";
			sidebar.setAttribute('tle',"hiden");
		}
		sidebarClickJudge = false;
		setTimeout(function() {
			sidebarClickJudge = true;
		}, 1000);
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
			let pre = barRegList.getElementsByClassName("on-region")[0] || null;
			let now = event.target;
			if (pre == now) {
				return;
			}
			if (pre) {
				pre.classList.remove("on-region");
			}
			now.classList.add("on-region");
			if (event.target.innerText == "出租车司机收入排行榜") {
				formClose();
			}
		}
		let regDataCon =  document.getElementsByClassName("region")[0].getElementsByClassName("data-container")[0];
		if (event.target.innerText != "出租车司机收入排行榜") {
			regDataCon.style.display = "none";
		}
	}


	
	





});