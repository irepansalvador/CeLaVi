// handle upload button
function Metadata_upload_button(el, callback) {
  var uploader = document.getElementById(el);  
  var reader = new FileReader();
  console.log(uploader);

  reader.onload = function(e) {
    var contents = e.target.result;
    callback(contents);
  };

  uploader.addEventListener("change", handleFiles, false);  

  function handleFiles() {
    //d3.select("#area2").text("loading...");
    var file = this.files[0];
    reader.readAsText(file);
    console.log(file)      
  };
};
var data_meta;
var table_div;

// load dataset and create table 
function load_dataset_3(csv) {
	data_meta = d3.csvParse(csv);
	console.log(data_meta);
	// create div where the table is going to go
	table_div = d3.select("body").append("div")	
		.attr("class", "viewport")
		.style("opacity",1 )
		.style("left", (w*0.6) +"px")
		.call(d3.drag()
		.on('start.interrupt', function () {
			table_div.interrupt();
			console.log('stop')
			})
		.on('start drag', function () {
			console.log('drag')
			table_div.style('top', d3.event.y + 'px')
			table_div.style('left', d3.event.x + 'px')
			}));;

	load_table(data_meta);
}


function load_table(data_meta) {
	console.log(data_meta);

	// variable states will contain the metadata to iterate later
	var sts = [];
	data_meta.forEach(function(d) 
		{sts.push(d.type)});
	var states = sts.filter(onlyUnique);
	console.log(states);

	var colorScale = d3.scale.category20();
	var scrollSVG = table_div.append("svg")
		.attr("class", "scroll-svg");

	var defs = scrollSVG.insert("defs", ":first-child");

	createFilters(defs);

	var chartGroup = scrollSVG.append("g")
		.attr("class", "chartGroup");
		//.attr("filter", "url(#dropShadow1)"); // sometimes causes issues in chrome

	chartGroup.append("rect")
		.attr("fill", "#FFFFFF");

	var rowEnter = function(rowSelection) {
		rowSelection.append("rect")
			.attr("rx", 3)
			.attr("ry", 3)
			.attr("width", "250")
			.attr("height", "24")
			.attr("fill-opacity", 0.55)
			.on("contextmenu",function(d){
				d3.event.preventDefault();
				plotMetadata(d)})
			.attr("stroke", "#999999")
			.attr("stroke-width", "2px");

		rowSelection.append("text")
			.attr("transform", "translate(10,15)");
	};
	var rowUpdate = function(rowSelection) {
		rowSelection.select("rect")
			.attr("fill", function(d) {
				return colorScale(d);
			});
		rowSelection.select("text")
			.text(function (d) {
				return (d);})
		};

	var rowExit = function(rowSelection) {
		};

	var virtualScroller = d3.VirtualScroller()
		.rowHeight(30)
		.enter(rowEnter)
		.update(rowUpdate)
		.exit(rowExit)
		.svg(scrollSVG)
		.totalRows(states.length)
		.viewport(d3.select(".viewport"));

	// tack on index to each data item for easy to read display
	states.forEach(function(nextState, i) {
		nextState.index = i;
	});

	virtualScroller.data(states, function(d) {console.log(d); return d; });

	chartGroup.call(virtualScroller);

	function createFilters(svgDefs) {
		var filter = svgDefs.append("svg:filter")
			.attr("id", "dropShadow1")
			.attr("x", "0")
			.attr("y", "0")
			.attr("width", "200%")
			.attr("height", "200%");
		filter.append("svg:feOffset")
			.attr("result", "offOut")
			.attr("in", "SourceAlpha")
			.attr("dx", "1")
			.attr("dy", "1");
		filter.append("svg:feColorMatrix")
			.attr("result", "matrixOut")
			.attr("in", "offOut")
			.attr("type", "matrix")
			.attr("values", "0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.2 0");
		filter.append("svg:feGaussianBlur")
			.attr("result", "blurOut")
			.attr("in", "matrixOut")
			.attr("stdDeviation", "1");
		filter.append("svg:feBlend")
			.attr("in", "SourceGraphic")
			.attr("in2", "blurOut")
			.attr("mode", "normal");
	}
};


function plotMetadata(d){
	var cells=[];
	console.log(d)
	data_meta.forEach(function(dd)
		{if (d==dd.type) 
			{cells.push(dd.cell)}
		})
	console.log(cells)
	//var rc = randomColour();
	var rc;
	// first get the colour from the table
	// select all the rows of the table and extract the data
	var mytypes = d3.select(".viewport").select("svg")
		.selectAll("g.row").selectAll("rect");
	// do a search of the node based on text and get the colour
	mytypes._groups.forEach(function(dd)
		{if (dd[0].__data__ == d)
			{rc = dd[0].attributes.fill.value;
			console.log(dd[0]);
			console.log(rc);
			}
		})
	
	
	cells.forEach(function(d,i)
		{
		ci = i;
		var D = d;
	//     console.log("looking for #"+D)
		d3.selectAll("#area1").selectAll("g").select("#"+D)
			.select("circle")
			.style("fill", rc)
			.style("fill-opacity", 0.8)
			.style("stroke", "black")
			.attr("r", 6);
		});
	//then use the random colour to paint all cells
		// pts is array with point number to be changed
		var pts = getPoints(cells);
		// change colour of the 3Dcell 
		setColours(pts, rc );

	}
