function Nested_rels_HMscale(max_height) {
	// get the depths of the tree to plot the slider
	var mm = [];
	//    var m = Math.max.apply(null, depths);
	//    depths.forEach(function(d) {mm.push(d/m)});
	var m = depths.length;
	depths.forEach(function(d) {mm.push(d)});
	var slider_svg = d3.select("#HM_scale")
		.classed("svg-container-slider", true) //container class to make it responsive
		.append("svg")
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 100 4")
		.classed("svg-content-responsive-nospace", true)
		.append("g");
		    
	var www = d3.select("#HM_scale").selectAll("svg")
		// get the width of div element
		.style('width')
		// take of 'px'
		.slice(0, -2);
	var hhh = d3.select("#HM_scale").selectAll("svg")
		// get the width of div element
		.style('height')
		// take of 'px'
		.slice(0, -2);
		    
	var colorScale = d3.scaleSequential(d3.interpolateYlOrBr)
		.domain([1, max_height]);   
		    
	for (var ii = 1; ii <= max_height; ii++) 
		{HM_cols[ii] = colorScale(ii);
		console.log(colorScale(ii))};
		    
	var bars = slider_svg.selectAll("g")
		.data(d3.range(10), function(d) {console.log(d) ; return d; })
		.enter().append("rect")
		.attr("class", "bars")
		.attr("x", function(d, i) { return (i*5) +30; })
		.attr("y", 1)
		.attr("height", hhh/2)
		.attr("width", 5)
		.style("fill", function(d, i ) { return colorScale(d);});
		    
	slider_svg.selectAll("g")
		.data(d3.range(2), function(d) {console.log(d) ; return d; })
		.enter().append("text")
		.attr("x", function(d, i) { return i==0 ? (50)-30 : (i*50)+30 })
		.attr("y", 2.7)
		.attr("dy", ".35em")
		.attr("font-size", "3px")
		.attr("font-family", "sans serif")
		.text(function(d, i) { return i==0 ? "root" : "sister"});
	}           
