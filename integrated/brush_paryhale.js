
function my_slider_2()
	{
	var slider = d3.select("#slider")
		.classed("svg-container-slider", true); //container class to make it responsive

	var slider_svg = slider.append("svg")
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 100 8")
		.classed("svg-content-responsive-nospace", true);

	//Circle Data Set
	var lineData = [
		{ "cx": 0, "color" : "black" },
		{ "cx": 20, "color" : "black" },
		{ "cx": 40, "color" : "black" },
		{ "cx": 60, "color" : "black" },
		{ "cx": 80, "color" : "black" },
		{ "cx": 100,"color" : "black" }];
	
	var lines = slider_svg.selectAll("line")
		.data(lineData)
		.enter()
		.append("line");

//Add the lines attributes
	var lineAttributes = lines
		.attr("x1", function (d) { return (d.cx*0.96) + (2); })
		.attr("x2", function (d) { return (d.cx*0.96) + (2); })
		.attr("y1", 0)
		.attr("y2", 2)
		.attr("stroke-width", 0.1)
		.attr("stroke", "black");

	//Add the SVG Text Element to the svgContainer
	var text = slider_svg.selectAll("text")
		.data(lineData)
		.enter()
		.append("text");
//Add SVG Text Element Attributes
	var textLabels = text
		.attr("x", function(d) { return (d.cx*0.95); })
		.attr("y", 6)
		.text( function (d) { return  d.cx  })
		.attr("font-family", "sans-serif")
		.attr("font-size", "2px")
		.attr("fill", "black");

	/// Add the slider at the top of everithing else
	slider.append("input")
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 100 4")
		.classed("svg-content-responsive-nospace", true)
		.attr("type", "range")
		.attr("min", 0)
		.attr("max", 100)
		.attr("step",5)
		.attr("id", "time")
		.attr("value", 0)
		.on("input", slided);
}


function my_slider() 
	{
	var slider_menu = [
		{title: 'Collapse all cells',
		action: function(d, i) {depth_collapse(d)}
		},
    {title: 'Expand all cells',
    action: function(d, i) {depth_expanse(d)}
		},
    {title: 'Show clones from these depth',
    action: function(d,i) 
			{console.log("I have clicked in level "+ d)
			Tcount = 0;
			depth_mark(d);
			div.transition()		
				.duration(0)		
				.style("opacity", .9)
				.text(Tcount+' daughters')
				.style("left", (d3.event.pageX - 50 ) + "px")	
				.style("top", (d3.event.pageY - 48) + "px");
			update(d) 
			console.log("Total cells "+ Tcount)
			}
		}
	];
	// get the depths of the tree to plot the slider
	var mm = [];
	//    var m = Math.max.apply(null, depths);
	//    depths.forEach(function(d) {mm.push(d/m)});
	var m = depths.length;
	depths.forEach(function(d) {mm.push(d)});
	var slider_svg = d3.select("#slider")
		.classed("svg-container-slider", true) //container class to make it responsive
		.append("svg")
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 100 4")
		.classed("svg-content-responsive", true)
		.append("g");
	var www = d3.select("#slider").selectAll("svg")
		// get the width of div element
		.style('width')
		// take of 'px'
		.slice(0, -2);
	var hhh = d3.select("#slider").selectAll("svg")
		// get the width of div element
		.style('height')
		// take of 'px'
		.slice(0, -2);
	var x = d3.scaleLinear().range([0,  95/m]);
	var y = d3.randomNormal(hhh/15, 0);

	// Update the nodes...
	var slider_node = slider_svg.selectAll('g')
		.data(mm, function(d) 
			{return d});
		// Enter any new modes at the parent's previous position.
		var slidernodeEnter = slider_node.enter()
			.append('g')
			.attr("id",  function(d) {return d})
			.attr('class', 'node')
			.attr('cursor', 'pointer')
			.attr("transform", function(d) {return "translate(" + (x(d)+5) + "," + 2 + ")"; })
			.on('click', d3.contextMenu(slider_menu));
//            .on('click', click);
    
	// Add Circle for the nodes
	slidernodeEnter.append('circle')
		.attr('class', 'node')
		.style("fill", "purple")
		.style('stroke-width', 0.1)
		.style("stroke", "purple")
		.attr('r', 1.2);
    
// Text when adding nodes 
	slidernodeEnter.append('text')
		.attr("dy", ".4em").attr("dx",".5em")
		.attr("text-anchor", "end")
		.attr("font-size", "1.2px")
		.attr('fill', 'white')
		.attr("font-family", "sans serif")
		.text(function(d) {return d});
	// Toggle children on click.
	function slider_click(d) {
		console.log("I have clicked in level "+ d)};
	}
var ci;

// -- functions

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
    }

 function depth_collapse(d){
    // get all the nodes (opened) and get their height
    var xxx = d3.selectAll("#area1").select("svg")
        .selectAll("g")
        .select("circle").data()
        .filter(function(dd) {return dd.depth == d});
    var yyy = [];
    xxx.filter(function(dd) {yyy.push(dd.data.did)});
    var depths2 = yyy.filter( onlyUnique );
     console.log(depths2)
    depths2.forEach(function(d,i) 
        {
        ci = i;
        var D = d; console.log(D);
        var nn = d3.selectAll("#area1")
            .select("#"+D)
            .each(function(d)
                  {collapse(d);
                  console.log("clicked in ith element :",ci)});

        });
     update(root);
 }
function depth_expanse(d){
    // get all the nodes (opened) and get their height
    var xxx = d3.selectAll("#area1").select("svg")
        .selectAll("g")
        .select("circle").data()
        .filter(function(dd) {return dd.depth == d});
    var yyy = [];
    xxx.filter(function(dd) {yyy.push(dd.data.did)});
    var depths2 = yyy.filter( onlyUnique );
     console.log(depths2)
    depths2.forEach(function(d,i) 
        {
        ci = i;
        var D = d; console.log(D);
        var nn = d3.selectAll("#area1")
            .select("#"+D)
            .each(function(d)
                  {expand(d);
                  console.log("clicked in ith element :",ci)});

        });
     update(root);
 }

function depth_mark(d){
    // get all the nodes (opened) and get their height
    var xxx = d3.selectAll("#area1").select("svg")
        .selectAll("g")
        .select("circle").data()
        .filter(function(dd) {return dd.depth == d});
    var yyy = [];
    xxx.filter(function(dd) {yyy.push(dd.data.did)});
    var depths2 = yyy.filter( onlyUnique );
    console.log(depths2);
    
    depths2.forEach(function(d,i)
        {
        ci = i;
        var D = d;
   //     console.log("looking for #"+D)

        d3.selectAll("#area1").selectAll("g").select("#"+D)
            .select("circle")
            .style("fill", color(ci))
            .style("fill-opacity", 0.8)
            .style("stroke", stroke_cols[parseInt(ci/10)])
            .attr("r", 6);
        });

    depths2.forEach(function(d,i)
        {
        var D = d;
  //     console.log("looking for #"+D)
        var nn = d3.selectAll("#area1")
            .select("#"+D);
                   // then the 
        nn.each(function(d) {count_leaves2(d,0)});
        console.log("looking for "+ nn)   
    
        });
}

function slided(d) {
	var container_width =  d3.select("#area1").style('width').slice(0, -2);
	var slider_val = d3.select(this).property("value");
	var slider_scaled =( (600*0.9)*(slider_val/100));
	console.log(slider_scaled , slider_val);
	// remove the previous line
	d3.select("#area1").select("svg").selectAll("line").remove();

	// draw a line 
	var my_line = svg_tree.append("line")
		.attr("x1", slider_scaled )
		.attr("y1", 1000)
		.attr("x2", slider_scaled)
		.attr("stroke-width", 1)
		.attr("stroke", "black")
		.style("stroke-dasharray","5,5")//dashed array for line
		.attr("y2", 0);
	}

var color  = d3.scaleOrdinal(d3.schemeCategory10);
