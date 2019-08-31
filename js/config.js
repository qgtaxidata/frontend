// 公用地图
let map = new AMap.Map("map-container", {
	resizeEnable: true,
	center: [113.31739, 23.209],
	zoom: 11
});

// 图表容器
let formCon = document.getElementsByClassName("form-container")[0];

// 服务器地址
let serverUrl = "http://192.168.31.124:8080";

// 吴某人 http://192.168.1.101:8080
// 子锋 http://192.168.31.89:8080
// QG-red http://192.168.1.122:8080

// 公用时间
let timeDiffer = 80000000000;
let allTimeNow = new Date(Date.now() - timeDiffer);
let allTimeNowId = setInterval(function() {
	allTimeNow = new Date(Date.now() - timeDiffer);
}, 1000);

require.config({
	baseUrl : "js",
    paths : {
    	"main" : "main",
		"search": "search",
		"heatmap": "heatmap",
		"region": "region",
		"route": "route",
		"billboard": "billboard",
		"abnormal": "abnormal",
		"set": "set",
        "tools": "tools"
    }
})

require(['main']);
require(['search']);
require(["heatmap"]);
require(["region"]);
require(["route"]);
require(["billboard"]);
require(["abnormal"]);
require(['set']);


