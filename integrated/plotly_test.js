/* JAVASCRIPT CODE GOES HERE */

// DEFINE GLOBAL VARIABLES TO USE FOR THE 3D OBJECT
var data;
var my_cell_rad;
var my_cell_stroke_width;
var my_rad= 5;

var cell_check_button = document.querySelector("input[id=Cells_checkbox");
cell_check_button.addEventListener( 'change', function() {
	reset_cell_cols()});

// Initialise the layout of the viz
var layout = {
	margin: {l: 0,r: 0,b: 0,t: 0},
	scene: {camera: { eye: {x:0.1, y:0.1, z:2}},
		bgcolor: "white"
		}
};

var config = {
 	toImageButtonOptions: {
		format: "jpeg", // one of png, svg, jpeg, webp
		filename: 'cell_lineage',
		height: 600,
		width: 900,
		scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
		},
	responsive: true, displayModeBar: true, displaylogo: false
	};

var my_view;
var Npoints;   // Number of cells
var ID_array;
var points_array;
var plotly_scatter_div; // html div with the 3d obect

// MAIN FUNCTION 
Plotly.d3.csv(
	//"./Epith_limb_last_stage_coords_centroid.csv",
	"./cells_3Dnorm_centroid.csv",
	function(err, rows) {
		function unpack(rows, key) {
			return rows.map(function(row) {return row[key];});
		}
		function setValue(rows, key, color) {
			return rows.map(function(row) {return color;});
		}
		// Specify the name of the columns that will be read and assign to
		// XYZ
		var trace1 = {
			x: unpack(rows, "Xnorm"),
			y: unpack(rows, "Ynorm"),
			z: unpack(rows, "Znorm"),
			id: unpack(rows, "cell"),
			// cells' values to be plotted
			mode: "markers", marker: {
				color: setValue(rows, "z1", "lightgrey"),
				size: setValue(rows, "z1", 19),
				line: {
					color: setValue(rows, "z1", "darkblue"),
					width: 3},
				opacity: 1
			},
			text: unpack(rows, "cell"),
			hoverinfo:"text",
			type: "scatter3d"
		};
		Npoints = rows.length; // set global var of number of points
		points_array=[];
		for (var i = 0; i < Npoints; i++) {
			points_array.push(i);}
		ID_array= unpack(rows, "cell");
		data = [trace1];
		// to make the plot responsive to size changes
		Plotly.newPlot("area2", data, layout, config)	;
		// get the dic where the plot is going to be added to
		plotly_scatter_div = document.getElementById("area2");
		
		// FUNCTION THAT DEFINE BEHAVIOUR WHEN CLICKING ON CELLS
		plotly_scatter_div.on("plotly_click", function(dd) {
		if (d3.select("#Cells_checkbox").property("checked")==false)
			{
			var id_txt = "\"id\"" 
			// get the id of point clicked
			var pn = dd.points[0].pointNumber;
			var yy = data[0]["id"][pn];
			// trick to avoid bug feature, where after clicking we get stuck
			// on an infinite loop
			setTimeout(function(x) {
				click2(yy);
				setColours([pn], "red");
				setStroke([pn],"darkblue");
				console.log(pn)
				},130);
			}
		if (d3.select("#Cells_checkbox").property("checked"))
			{
			var pn = dd.points[0].pointNumber;
			var yy = data[0]["id"][pn];
			setTimeout(function(x) {
				show_anc_cols(yy);
				},130);
			}
		});
		/*
		// FUNCTION THAT DEFINE BEHAVIOUR WHEN HOVERING ON CELLS
		plotly_scatter_div.on("plotly_hover", function(dd) {
			var id_txt = "\"id\"" 
			// get the id of point clicked
			var pn = dd.points[0].pointNumber;
			var tn = dd.points[0].curveNumber;
			console.log(pn)
			my_test = 'data[0][\"id\"]"+"["+pn+"]';
			//console.log("Clicked = " + data[0]["id"][pn]);
			var yy = data[0]["id"][pn];
			var update = {
				["marker.color[" + pn + "]"]: "purple"};
			// Interact with cell lineage tree
			click2(yy);
			//show_anc_cols(yy);
			// trick to avoid bug feature, where after clicking we get stuck
			// on an infinite loop
			setTimeout(function(x) {
				Plotly.restyle("area2", update, tn);
				console.log(pn , tn)}, 15);
		});
		*/
	});


// FUNCTION TO SET PROPERTIES  OF CELLS BASED ON THEIR INDICES. 
// This is to be used interactively with the cell lineage tree, 
// For example when clicking/hovering on any given node of the tree.
// It takes the indices as an array and the colour as a string val

function setColours(points,new_colour) {
	//console.log(points)
	// get current value of camera, so it can be set again
	myview = plotly_scatter_div.layout.scene.camera;
	// For each point change the colour value for layout
	points.forEach(function(d) 
		{data[0]["marker"]["color"][d] = new_colour;
		//console.log("Clicked = " + data[0]["id"][d]);
		});
	// Update plot based on the new values
	Plotly.update("area2", data, myview,0);
	};

function setSizes(points,new_size) {
	//console.log(points)
	// get current value of camera, so it can be set again
	myview = plotly_scatter_div.layout.scene.camera;
	// For each point change the colour value for layout
	points.forEach(function(d) 
		{data[0]["marker"]["size"][d] = new_size;
		//console.log("Clicked = " + data[0]["id"][d]);
		});
	// Update plot based on the new values
	Plotly.update("area2", data, myview,0);
	};

function setStroke(points,new_colour) {
	//console.log(points)
	// get current value of camera, so it can be set again
	myview = plotly_scatter_div.layout.scene.camera;
	// For each point change the colour value for layout
	points.forEach(function(d) 
		{data[0]["marker"]["line"]["color"][d] = new_colour;
		//console.log("Clicked to change stroke = " + data[0]["id"][d]);
		});
	// Update plot based on the new values
	Plotly.update("area2", data, myview,0);
	};

function setStrokeWidth(new_width) {
	//console.log(points)
	// get current value of camera, so it can be set again
	myview = plotly_scatter_div.layout.scene.camera;
	// get current colour of cells to be set again
	var my_cells_cols = data[0]["marker"]["line"]["color"];
	data[0]["marker"]["line"]= {color: my_cells_cols , width: new_width };
	// Update plot based on the new values
	Plotly.update("area2", data, myview,0);
	};

// ----------------- Interactions

d3.select("#reset").on("click", function() {
	console.log("CKICKED ON RESET");
	reset_cell_cols();
});

function reset_cell_cols() {
	setColours(points_array, "lightgrey");
	setStroke(points_array, "darkblue");
	}

// Add an event listener to the button created in the html part
d3.select("#CellSize").on("input", changeSize );
// A function that update the color circle
function changeSize() {
    my_cell_rad = this.value;
    setSizes(points_array,my_cell_rad); 
}
// Add an event listener to the button created in the html part
d3.select("#CellStroke").on("input", changeStrokeWidth );
// A function that update the color circle
function changeStrokeWidth() {
	my_cell_stroke_width = this.value;
	setStrokeWidth(my_cell_stroke_width)
	console.log("I should see this " + my_cell_stroke_width);
	};



function click2(d) {
    var yy = "#"+d;
    d3.selectAll("#area1").select(yy).select("circle")
        .style("stroke", "purple")
        .style("stroke-width", 5).attr("r",my_rad+1);
    show_anc(yy);
    }

function show_anc(d) {
	console.log("I have clicked in cell "+ d)
	d3.selectAll("#area1").select("g").select(d)
	.each(function(d) 
		{
		selections = d.ancestors().map(d => d.data.did)
		console.log("Parents are " + selections)
		for(var jj = 0; jj<selections.length; jj++)
			{
			//console.log("This should be a loop"+jj)
			d3.selectAll("#area1").selectAll("#"+selections[jj])
				.select("circle").style("fill", "red").attr("r",my_rad);
			}
		})
	}
function show_anc_cols(d) {
	var parent_level = 0;
	d3.selectAll("#area1").select("g").select("#"+d)
		.each(function(d) 
		{
		selections = d.ancestors().map(d => d.data.did)
		selections_rev = selections.reverse();
		console.log(selections_rev);
		var norm_cols = (max_H/selections.length) * 0.7; // to have a normalised scale of cols

		for(var jj = 0; jj<selections.length; jj++)
			{var nj = jj + 1; // to call the colour variable                 
			// select the node to paint its children
			var node_j = xxx = d3.selectAll("#area1").selectAll("g")
				.select("circle").data()
				.filter(function(d) 
					{return d.data.did == selections[jj]});
				// call the function to paint cells from diff levels of relationships
				count_leaves2(node_j[0], (max_H*0.3) + (nj*norm_cols) );
				console.log("This should be a loop"+jj,node_j[0], (max_H*0.3) + (nj*norm_cols)) 
				d3.selectAll("#area1").selectAll("#"+selections[jj])
					.select("circle").style("fill", "red")
					.attr('opacity', 10).attr('fill-opacity', 1).attr("r",my_rad);
			}
		})
	}

/*
function checkID(id) {
	const idx = ID_array.findIndex(x => x === id);
	return idx;
	}
*/
function getPoints(ids) {
	var pts = [];
	ids.forEach(function(d) 
		{pts.push(ID_array.findIndex(x => x === d));
		});
	return pts;
	}

