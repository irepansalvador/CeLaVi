// handle upload button
function Metadata_upload_button(el, callback) {
  var uploader = document.getElementById(el);  
  var reader = new FileReader();
  console.log(uploader);

  //reader.onload = function(e) {
  //  var contents = e.target.result;
  //  callback(contents);
  //};
  reader.onload = function(e) {
		var contents = e.target.result;
		var parse_results = Papa.parse(contents, csv_config);
		header = parse_results.meta.fields;
		if (table_div !== undefined) {table_div.remove();}
		// check if the header has the columns with proper names.
		// if not, throw an error
		if (containsAll(["cell","type"],header))
			{console.log("columns are named properly");
			// IF COLUMNS FOUND, PROCEED READING THE FILE
			if (typeof root == 'undefined' || typeof ID_array == 'undefined' ) {
				alert("[Warning]\n"+
							"The lineage tree and/or coordinates files have not been loaded.\n"+
							"The lineage and 3D cells need to be loadad to cross-check IDs.");
							$("input[name=Metadata_File]").val("") // reset value of uploader
				} else {
				// --- test if cell IDs are in the lineage tree //
				//console.log(id_t);
				var table_cells=[]; // var to store the cell IDs from the cell type file
				// read the file to find the names and cross check
				var data_tmp = d3.csvParse(contents);
				console.log(data_tmp);
				data_tmp.forEach(function(d) 
					{table_cells.push(d.cell)
					});
				count_leaves2(root,0);
				reset_cell_cols();
				if (containsAll(table_cells,sel_ids))
					{console.log("all cell IDs found");
					} else { 
					alert(no_there.length + " of " + table_cells.length + 
							" cell IDs were not found in the lineage tree\n"+
							"(e.g. \"" + no_there[1] + "\")");
							$("input[name=Metadata_File]").val("") // reset value of uploader
					}
				}
			// add button to hide/table
		//	var x = document.getElementById("Hide_metadata");
		//	if (x.style.display === "none") {x.style.display = "block";}
			// LOAD THE TABLE
			callback(contents);
		} else {
			console.log("names are not named properly");
			// IF COLUMS ARE NOT FOUND THROW AN ERROR
			alert("[CSV format error]\n" +
				"Header columns need to be \"cell\", and \"type\".");
			}
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
		.attr("id", "metadata_table")
		.style("height","400px")
		.style("width", "220px")
		.attr("class", "viewport")
		.style("opacity",1 )
		.style("top", (h*0.45) +"px")
		.style("left",(w*0.85) +"px");

var table_min = table_div.append("div")
	.attr("id", "metadata_tableheader");

var theDiv = document.getElementById("metadata_tableheader");	
var content = document.createTextNode("Click and drag to move");
theDiv.appendChild(content);

// Create min/max button to display the table
table_min.append("button")
	.attr("class", "btn btn-light")
	.attr("id","min_button")

$("#min_button").text("-")
var min_click = true;

// function to minimise/maximise
$(document).ready(function(){
	$('#min_button').click(function() {
		if (min_click) {
			$("#min_button").text('+');
			min_click = false;
			$(".scroll-svg").slideToggle();
			table_div.transition()
				.duration(600)
				.style("height","31px")
		}else {
			$("#min_button").text('-');
			min_click = true;
			table_div.transition()
				.duration(600)
				.style("height","400px")
			$(".scroll-svg").slideToggle()
			}
		})
	});


	//	// Make the DIV element draggable:
	dragElement(document.getElementById("metadata_table"));

	load_table(data_meta);
}

// to convert the Hex colors of the table to RGB so they can be used
// dinamically when exploring the lineage
function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
		} : null;
	}

var colorScale = d3.scale.category20();
function load_table(data_meta) {
	console.log(data_meta);

	// variable states will contain the metadata to iterate later
	var sts = [];
	data_meta.forEach(function(d) 
		{sts.push(d.type);
//		table_cells.push(d.cell);
		});
	var states = sts.filter(onlyUnique);
	console.log(states);

	var colorScale2 = d3.scale.category20();
	var scrollSVG = table_div.append("svg")
		.attr("class", "scroll-svg");

	var defs = scrollSVG.insert("defs", ":first-child");

	createFilters(defs);

	var chartGroup = scrollSVG.append("g")
		.attr("class", "chartGroup");
		//.attr("filter", "url(#dropShadow1)"); // sometimes causes issues in chrome

	chartGroup.append("rect")
		.attr("fill", "rgb(255, 255, 255)");

	var rowEnter = function(rowSelection) {
		rowSelection.append("rect")
			.attr("rx", 3)
			.attr("ry", 3)
			.attr("width", "200")
			.attr("height", "24")
			.attr("fill-opacity", 0.55)
			.attr("cursor" , "pointer")
			.on("mouseover.t", function(d) {
				setAlpha(points_array, 0);
				setAlphaStroke(points_array, 0.15);
				highlightMetadata(d);
				})
			.on("mouseout.c", function (d) {
				setAlphaStroke(points_array, 1);
				setAlpha(points_array, 1);
				})
			.on("click", function(d) {
				plotMetadata(d)})
			.attr("clicked", 0)
			.attr("stroke", "rgb(153, 153, 153)")
			.attr("stroke-width", "2px");

		rowSelection.append("text")
			.attr("transform", "translate(10,15)");
	};
	var rowUpdate = function(rowSelection) {
		rowSelection.select("rect")
			.attr("fill", function(d) {
				return colorScale2(d);
			});
		rowSelection.select("text")
			.text(function (d) {
				return (d);})
			.attr("cursor" , "pointer")
			.on("mouseover.t", function(d) {
				setAlpha(points_array, 0);
				setAlphaStroke(points_array, 0.15);
				highlightMetadata(d);
				})
			.on("mouseout.c", function (d) {
				setAlphaStroke(points_array, 1);
				setAlpha(points_array, 1);
				})
			.on("click", function(d) {
				plotMetadata(d)})
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

	virtualScroller.data(states, function(d) 
		{
		//console.log(d);
		return d; 
		});

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

function highlightMetadata(d){
	if (document.getElementById("Cells_checkbox").checked == true)
		{document.getElementById("Cells_checkbox").click()}
	var cells=[];
	console.log(d)
	data_meta.forEach(function(dd)
		{if (d==dd.type) 
			{cells.push(dd.cell)}
		})
	console.log(cells)
	var pts = getPoints(cells);
	// make cells visible  
	setAlpha(pts, 1);
	setAlphaStroke(pts, 1);
	}

function plotMetadata(d){
	if (document.getElementById("Cells_checkbox").checked == true)
		{document.getElementById("Cells_checkbox").click()}
	var cells=[];
	console.log(d)
	data_meta.forEach(function(dd)
		{if (d==dd.type) 
			{cells.push(dd.cell)}
		})
	console.log(cells)
	//var rc = randomColour();
	var rc;
	var isclicked;
	// first get the colour from the table
	// select all the rows of the table and extract the data
	var mytypes = d3.select(".viewport").select("svg")
		.selectAll("g.row").selectAll("rect");
	// do a search of the node based on text and get the colour
	mytypes._groups.forEach(function(dd)
		{if (dd[0].__data__ == d)
			{rc = dd[0].attributes.fill.value;
			var result = hexToRgb(rc);
			var x = "rgb("+ result.r + "," + result.g + ","  + result.b + ")" ;
			isclicked =  dd[0].attributes.clicked.value;
			console.log(dd[0]);
			console.log(rc + " , " + x );
			rc = x;
			console.log(isclicked);
			if (isclicked == 1) {dd[0].attributes.clicked.value=0}
			if (isclicked == 0) {dd[0].attributes.clicked.value=1}
			}
		})
	
	// if the value was not clicked
	if (isclicked == 0)
		{cells.forEach(function(d,i)
			{
			ci = i;
			var D = d;
		//     console.log("looking for #"+D)
			d3.selectAll("#area1").selectAll("g").select("#"+D)
				.select("circle")
				.style("fill", rc)
				.style("fill-opacity", 0.8)
				.style("stroke", "rgb(0,0,0)")
			.attr("r", 4);
			});
		//then use the random colour to paint all cells
			// pts is array with point number to be changed
			var pts = getPoints(cells);
			// change colour of the 3Dcell 
			setColours(pts, rc );
		}

	// if the value was clicked unclick it! 
	if (isclicked == 1)
		{cells.forEach(function(d,i)
			{
			ci = i;
			var D = d;
		//     console.log("looking for #"+D)
			d3.selectAll("#area1").selectAll("g").select("#"+D)
				.select("circle")
				.style("fill","rgb(255, 255, 255)")
				.style("fill-opacity", 0.8)
				.style("stroke", "rgb(0,0,255)")
				.attr('r', function(d) {
					return (5- (d.depth/3)) })
		//	.attr("r", 4);
			});
		//then use the random colour to paint all cells
			// pts is array with point number to be changed
			var pts = getPoints(cells);
			// change colour of the 3Dcell 
			setColours(pts,"rgb(255, 255, 255)");
		}
	}


function dragElement(elmnt) {
	console.log("just a test");
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	//Move the DIV from anywhere inside the DIV:
	elmnt.onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		//get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		//call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
		}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		//calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		}

		function closeDragElement() {
		//stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
		}
	}
