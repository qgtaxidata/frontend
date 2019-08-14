let map = new AMap.Map("map-container", {
	resizeEnable: true,
	center: [113.31739, 23.209],
	zoom: 11
});

let serverUrl = "http://192.168.1.104:8080";

let allTimeNow = new Date(Date.now() - 79200000000);
let allTimeNowId = setInterval(function() {
	allTimeNow = new Date(Date.now() - 79200000000);
}, 1000);

require.config({
	baseUrl : "js",
    paths : {
    	"main" : "main",
		"search": "search",
		"heatmap": "heatmap",
		"region": "region",
		"route": "route",
        "tools": "tools",
        "set": "set"
    }
})

require(['main']);
require(['search']);
require(["heatmap"]);
require(["region"]);
require(["route"]);
require(['set']);