/* JAVASCRIPT CODE GOES HERE */

// DEFINE GLOBAL VARIABLES TO USE FOR THE 3D OBJECT
var data;
var my_rad = 5;
// Initialise the layout of the viz
var layout = {
	margin: {l: 0,r: 0,b: 0,t: 0},
	scene: {camera: { eye: {x:1.25, y:1.25, z:1.25}},
		bgcolor: "white"
		}
};
var my_view;
var Npoints;   // Number of cells
var ID_array;
var points_array;
var plotly_scatter_div; // html div with the 3d obect

// MAIN FUNCTION 
Plotly.d3.csv(
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
				line: {color: "darkblue",width: 1},
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
		Plotly.newPlot("area2", data, layout, {responsive: true});
		// get the dic where the plot is going to be added to
		plotly_scatter_div = document.getElementById("area2");
		
		// FUNCTION THAT DEFINE BEHAVIOUR WHEN CLICKING ON CELLS
		plotly_scatter_div.on("plotly_click", function(dd) {
			var id_txt = "\"id\"" 
			// get the id of point clicked
			var pn = dd.points[0].pointNumber;
			var tn = dd.points[0].curveNumber;
			console.log(pn)
			my_test = 'data[0][\"id\"]"+"["+pn+"]';
			console.log("Clicked = " + data[0]["id"][pn]);
			var yy = data[0]["id"][pn];
			var update = {
				["marker.color[" + pn + "]"]: "purple"};

			// Interact with cell lineage tree
			d3.selectAll("#area1").select(yy).select("circle")
				.style("stroke", "purple")
				.style("stroke-width", 5);

			// trick to avoid bug feature, where after clicking we get stuck
			// on an infinite loop
			setTimeout(function(x) {
				Plotly.restyle("area2", update, tn);
				console.log(pn , tn)
				}, 50);
		});
	});


// FUNCTION TO SET PROPERTIES  OF CELLS BASED ON THEIR INDICES. 
// This is to be used interactively with the cell lineage tree, 
// For example when clicking/hovering on any given node of the tree.
// It takes the indices as an array and the colour as a string val

function setColours(points,new_color) {
	//console.log(points)
	// get current value of camera, so it can be set again
	myview = plotly_scatter_div.layout.scene.camera;
	// For each point change the colour value for layout
	points.forEach(function(d) 
		{data[0]["marker"]["color"][d] = new_color;
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



// ----------------- Interactions

d3.select("#reset").on("click", function() {
	console.log("CKICKED ON RESET");
	reset_cell_cols();
});

function reset_cell_cols() {
	setColours(points_array, "lightgrey");
	}

// Add an event listener to the button created in the html part
d3.select("#CellSize").on("input", changeSize );
// A function that update the color circle
function changeSize() {
    my_rad = this.value;
    setSizes(points_array,my_rad); 
}



function click2(d) {
     d3.select('.status')
        .text('You clicked on ' + myid(d)); // Logs the x and y position of the datum.
   // console.log(d);    // $(this).hide();
    var yy = "#"+myid(d);
    d3.selectAll("#area1").select(yy).select("circle")
        .style("stroke", "purple")
        .style("stroke-width", 5).attr("r",my_rad+1);
    
    d3.selectAll("#area2").select(yy)
        .attr("fill", "purple").attr('opacity', 10).attr('fill-opacity', 1)
        .attr("r",my_rad);
    show_anc(yy);
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

