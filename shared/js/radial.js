import * as d3 from "d3"
import { DateTime } from "luxon"
import * as suncalc from "suncalc"

export function radial(latlon, state, name, savings, nameSelect) {


	console.log("coords", latlon, "state", state, "location", name, "savings", savings)

	var isMobile;
	var windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

	if (windowWidth < 610) {
			isMobile = true;
	}	

	if (windowWidth >= 610){
			isMobile = false;
	}

	// console.log(`.${nameSelect} #graphicContainer`)

	var width = document.querySelector(`.${nameSelect} #graphicContainer`).getBoundingClientRect().width
	
	if (width > 620) {
		width = 620
	}
	var height = width			
	var margin = {top: 20, right: 20, bottom: 20, left: 20}

	var context = d3.select(`.${nameSelect} #outer-wrapper`)

	width = width,
  height = width;

  var chartKey = context.select("#chartKey");
	var dateParse = d3.timeParse("%Y-%m-%d")
	// var savings = "normal";

	var chartData = []

	const startDate = DateTime.fromISO("2021-01-01T09:24")

	function getTimezone(state, date) {
		
		var nonDstStart = DateTime.fromISO("2021-04-04T00:01")
		var nonDstEnd = DateTime.fromISO("2021-10-03T09:24")


		if (state === "QLD") {
			if (savings === "normal" || savings === "off") {
				return "UTC+10:00"
			}

			else if (savings === "on") {
				// non DST
				if (date < nonDstEnd && date > nonDstStart) {
					return "UTC+10:00"
				}
				// DST
				else {
					return "UTC+11:00"
				}
				
			}
			
		}

		else if (state === "WA") {
			
			// console.log("WA")

			if (savings === "normal" || savings === "off") {
				return "UTC+08:00"
			}

			else if (savings === "on") {
				// Non DST
				if (date < nonDstEnd && date > nonDstStart) {
					return "UTC+08:00"
				}

				// DST
				else {
					return "UTC+09:00"
				}
				
			}

		}

		else if (state === "NT") {
			
			if (savings === "normal" || savings === "off") {
				return "UTC+09:30"
			}
			
			else if (savings === "on") {
				// non DST
				if (date < nonDstEnd && date > nonDstStart) {
					return "UTC+09:30"
				}
				// DST
				else {
					return "UTC+10:30"
				}
				
			}	
		}

		else if (state === "NSW" || state === "VIC" || state === "ACT" || state === "TAS") {

			// Check if it's a non-DST time

			if (savings === "normal" || savings === "on") {
				if (date < nonDstEnd && date > nonDstStart) {
					return "UTC+10:00"
				}

				// else it's DST

				else {
					return "UTC+11:00"
				}
			}

			// else if (savings === "on") {
			// 	return "UTC+11:00"
			// }
			
			else if (savings === "off") {
				return "UTC+10:00"
			}
			
		}

		else if (state === "SA") {

			// Check if it's a non-DST time

			if (savings === "normal" || savings === "on") {

				if (date < nonDstEnd && date > nonDstStart) {
					return "UTC+09:30"
				}

				// else it's DST

				else {
					return "UTC+10:30"
				}
			}

			// else if (savings === "on") {
			// 	return "UTC+10:30"
			// }
			
			else if (savings === "off") {
				return "UTC+09:30"
			}


		}
		
	}

	// savings = "on"
	// var testDate = DateTime.fromISO("2021-10-20T09:24")
	// console.log("test TZ", getTimezone("WA", testDate))

	
	for (var i = 0; i < 365; i++) {
		var newDate = startDate.plus({"days":i})
		var timeZone = getTimezone(state, newDate)
		// console.log(newDate.toISO(), timeZone)
		var newData = {}
		newData["date"] = newDate

		var sunrise = suncalc.getTimes(newDate, latlon[1], latlon[0]).sunrise
		var sunset = suncalc.getTimes(newDate, latlon[1], latlon[0]).sunset

		var dawn = suncalc.getTimes(newDate, latlon[1], latlon[0]).nauticalDawn
		var dusk = suncalc.getTimes(newDate, latlon[1], latlon[0]).nauticalDusk

		var localSunrise = DateTime.fromJSDate(sunrise, { zone: timeZone}).toLocaleString(DateTime.TIME_24_SIMPLE)
		var localSunset = DateTime.fromJSDate(sunset, {zone: timeZone}).toLocaleString(DateTime.TIME_24_SIMPLE)
		var localDawn = DateTime.fromJSDate(dawn, { zone: timeZone}).toLocaleString(DateTime.TIME_24_SIMPLE)
		var localDusk = DateTime.fromJSDate(dusk, { zone: timeZone}).toLocaleString(DateTime.TIME_24_SIMPLE)

		// var sunrise = DateTime.fromJSDate(sunrise).toLocaleString(DateTime.TIME_24_SIMPLE)
		// var sunset = DateTime.fromJSDate(sunset).toLocaleString(DateTime.TIME_24_SIMPLE)
		// var sunrise = DateTime.fromISO("2021-01-01T" + sunrise)
		// var sunset = DateTime.fromISO("2021-01-01T" + sunset)
		newData["sunrise"] = DateTime.fromISO("2021-01-01T" + localSunrise)
		newData["sunset"] = DateTime.fromISO("2021-01-01T" + localSunset)
		newData["dawn"] = DateTime.fromISO("2021-01-01T" + localDawn)
		newData["dusk"] = DateTime.fromISO("2021-01-01T" + localDusk)
		chartData.push(newData)
	}

	console.log("1 Jan", chartData[0].sunrise.toISO())

	context.select("#graphicContainer svg").remove();

	var svg = context.select("#graphicContainer").append("svg")
				.attr("viewBox", [-width / 2, -height / 2, width, height])
				.attr("width", width )
				.attr("height", height )
				.attr("id", "svg")
				.attr("overflow", "hidden");					

	var lines = svg.append("g")

	var innerRadius = width * 0.15
	var outerRadius = width / 2 - margin.left

	var x = d3.scaleUtc()
	    .domain([Date.UTC(2021, 0, 1), Date.UTC(2022, 0, 1) - 1])
	    .range([0, 2 * Math.PI])
	    
	var y = d3.scaleUtc()
	    .domain([new Date(2021, 0, 1, 0), new Date(2021, 0, 1, 23)])
	    .range([innerRadius, outerRadius])



	var xAxis = g => g
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .call(g => g.selectAll("g")
      .data(x.ticks())
      .join("g")
        .each((d, i) => d.id = {id: "month" + i, href:  new URL(`#${"month" + i}`, location)} )
        .call(g => g.append("path")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.2)
            .attr("d", d => `
              M${d3.pointRadial(x(d), innerRadius)}
              L${d3.pointRadial(x(d), outerRadius)}
            `))
        .call(g => g.append("path")
            .attr("id", d => d.id.id)
            .datum(d => [d, d3.utcMonth.offset(d, 1)])
            .attr("fill", "none")
            .attr("d", ([a, b]) => `
              M${d3.pointRadial(x(a), outerRadius)}
              A${outerRadius},${outerRadius} 0,0,1 ${d3.pointRadial(x(b), outerRadius)}
            `))
        .call(g => g.append("text")
        	.attr("dy", "-1%")
          .append("textPath")
            .attr("startOffset", 6)
            .attr("xlink:href", d =>  {
            	return d.id.href
            })
            .text(d3.utcFormat("%B"))))
            
    var yAxis = g => g
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .call(g => g.selectAll("g")
      .data(y.ticks(7).reverse())
      .join("g")
        .attr("fill", "none")	
        .call(g => g.append("circle")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.2)
            .attr("r", y))
        .call(g => g.append("text")
            .attr("y", d => -y(d))
            .attr("dy", "0.35em")
            .attr("stroke", "#fff")
            .attr("stroke-width", 3)
            .attr("opacity", 0.8)
            .text((x, i) => `${DateTime.fromJSDate(x).toLocaleString(DateTime.TIME_24_SIMPLE)}`)
          .clone(true)
            .attr("y", d => y(d))
          .selectAll(function() { return [this, this.previousSibling]; })
          .clone(true)
            .attr("fill", "#000")
            .attr("stroke", "none")))
            
    var daylightArea = d3.areaRadial()
	    .curve(d3.curveLinearClosed)
	    .angle(d => { 
	    	return x(d.date)
	    })
	    .innerRadius(d => y(d.sunrise))
      .outerRadius(d => y(d.sunset))

 		var nightToDawn = d3.areaRadial()
	    .curve(d3.curveLinearClosed)
	    .angle(d => { 
	    	return x(d.date)
	    })
	    .innerRadius(y(DateTime.fromISO("2021-01-01T00:00:00.00")))
      .outerRadius(d => y(d.dawn))

    var dawnToSunrise = d3.areaRadial()
	    .curve(d3.curveLinearClosed)
	    .angle(d => { 
	    	return x(d.date)
	    })
	    .innerRadius(d => y(d.dawn))
      .outerRadius(d => y(d.sunrise)) 

    var sunsetToDusk = d3.areaRadial()
	    .curve(d3.curveLinearClosed)
	    .angle(d => { 
	    	return x(d.date)
	    })
	    .innerRadius(d => y(d.sunset))
      .outerRadius(d => y(d.dusk))

    var duskToNight = d3.areaRadial()
	    .curve(d3.curveLinearClosed)
	    .angle(d => { 
	    	return x(d.date)
	    })
	    .innerRadius(d => y(d.dusk))
      .outerRadius(y(DateTime.fromISO("2021-01-01T23:00:00.00")))   

	lines.append("path")
  		.datum(chartData)
	      .attr("fill", "#fc9803")
	      .attr("opacity", 1)
	      .attr("d", daylightArea)
	
	lines.append("path")
  		.datum(chartData)
	      .attr("fill", "#4575b4")
	      .attr("opacity", 1)
	      .attr("d", nightToDawn)

	lines.append("path")
  		.datum(chartData)
	      .attr("fill", "#abd9e9")
	      .attr("opacity", 1)
	      .attr("d", dawnToSunrise)

	lines.append("path")
  		.datum(chartData)
	      .attr("fill", "#abd9e9")
	      .attr("opacity", 1)
	      .attr("d", sunsetToDusk)       

	lines.append("path")
  		.datum(chartData)
	      .attr("fill", "#4575b4")
	      .attr("opacity", 1)
	      .attr("d", duskToNight)                  

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);    

} // end init
