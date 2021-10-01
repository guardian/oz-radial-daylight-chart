import { radial } from "shared/js/radial";
import * as d3 from "d3"

var coords = [151.208755,-33.870453]
var state = 'NSW'
var location = 'Sydney'
var savings = "normal"

radial(coords, state, location, savings, 'multi')

var locations = {
	"Sydney": {"coords":[151.208755,-33.870453], "state":"NSW"},
	"Perth": {"coords":[115.6813544,-32.0391738], "state":"WA"},
	"Melbourne":{"coords":[144.6671645,-37.7279276], "state":"VIC"},
	"Brisbane":{"coords":[152.7123263,-27.3818618], "state":"QLD"},
	"Adelaide":{"coords":[138.3302926,-35.0004435], "state":"SA"},
	"Canberra":{"coords":[148.9893562,-35.3138986], "state":"ACT"},
	"Hobart":{"coords":[147.3197801,-42.8823399], "state":"TAS"},
	"Darwin":{"coords":[130.8630967,-12.4258916], "state":"NT"},
}

var context = d3.select(".multi")

context.select("#locationSelect").on("change", function() {
    	var locationData = locations[this.options[this.selectedIndex].value]
    	coords = locationData.coords
    	state = locationData.state
    	location = this.options[this.selectedIndex].value

    	radial(coords, state, location, savings, 'multi')
	})

context.select("#savingsSelect").on("change", function() {
    	savings = this.options[this.selectedIndex].value
    	radial(coords, state, location, savings, 'multi')

	})


var to=null
var lastWidth = document.querySelector(".multi #graphicContainer").getBoundingClientRect()
window.addEventListener('resize', function() {
	var thisWidth = document.querySelector(".multi #graphicContainer").getBoundingClientRect()
	if (lastWidth != thisWidth) {
		window.clearTimeout(to);
		to = window.setTimeout(function() {
			    radial(coords, state, location, savings, 'multi')
			}, 100)
	}

})



