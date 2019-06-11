 
// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
 console.log("ALL FILE API supported") // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}

// handle upload button
function Coords_upload_button(el, callback) {
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


//Store width, height and margin in variables
//var wLine = 650;
//var hLine = 1200;
var linechart = d3.select("#area2")
                .classed("svg-container-inbox", true) //container class to make it responsive
                .append("svg")
                //class to make it responsive
                //responsive SVG needs these 2 attributes and no width and height attr
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 600 500")
                .classed("svg-content-responsive", true); ;

var ww = d3.select("#area2").selectAll("svg")
      // get the width of div element
      .style('width')
      // take of 'px'
      .slice(0, -2);
var hh = d3.select("#area2").selectAll("svg")
      // get the width of div element
      .style('height')
      // take of 'px'
      .slice(0, -2);

var wLine = ww;
var hLine = hh;
var points = [];

console.log(hh);

var marginLine = {top: 20, right: 10, bottom: 20, left: 30};

var selections; 
//Set up date formatting and years
var dateFormat = d3.time.format("%Y");

// Scale the width and height
var xScaleLine = d3.time.scale()
                    .range([ marginLine.left, wLine - marginLine.right - marginLine.left ]);

var yScaleLine = d3.scale.linear()
                    .range([ marginLine.top, hLine - marginLine.bottom]);

// Creat Axes i.e. xAxis and yAxis
var xAxisLine = d3.svg.axis()
              .scale(xScaleLine)
              .orient("bottom")
              .ticks(5)
              .tickFormat(function(d) {
                return dateFormat(d);
              });

var yAxisLine = d3.svg.axis()
              .scale(yScaleLine)
              .orient("left");
/* -- 
// Setting x position for line labels
var xLabelLine = wLine - marginLine.right - marginLine.left;

// Configure line generator

var line = d3.svg.line()
    .x(function(d) {
      return xScaleLine(dateFormat.parse(d.year)); // come back here and replace "year"
    })
    .y(function(d) {
      return yScaleLine(+d.amount); // come back here and replace "amount"
    })

//Create an empty svg
-- */

var data; // This is a Global variable

var activeDistrict; // Will be used for linked hovering

// --- Show menu with custom functions in right click
var menu2 = [
	{
	title: 'Show ancestors',
    action: function(d, i) {
        $(this).attr("r", 6);
        $(this).attr("fill", "purple");
//	     console.log('The data for this circle is: ' + d.data.did);
        console.log("I think i clicked in "+myid(d));
        var yy = "#"+myid(d);
        show_anc(yy);
        }    
	}, 
    
    {
	title: 'Find common ancestor',
    action: function(d, i) {
        click2(d)
        $(this).attr("r", 6);
        $(this).attr("fill", "purple");
        if (double_element.length == 0){
       //     console.log('The data for this circle is: ' + d.data.id);
            yy = "#" + myid(d)
            common_anc1(yy)
            div.style("opacity", .9)
                .text('R-Click on another cell')
                .style("left", (d3.event.pageX + 30 ) + "px")	
                .style("top", (d3.event.pageY - 80) + "px")
                .transition()		
	            .style("opacity", 0)
                .duration(5000);
            } 
        else{
             yy = "#" + myid(d)
            common_anc2(yy)
//            console.log('Second circle is: ' + yy);
            double_element = [];
            }
        }
    }
];

// Load in csv data 

/*---------
d3.csv("div9.csv", function(data) {

  // Create new array of all years in timeline for linechart. Will be referenced later
  var years = [ "2011", "2012", "2013", "2014", "2015"];

  //Make dataset an empty array (for now) to hold our restructured dataset
  dataset = [];

  // Loop once for each row in data
  for (var i=0; i < data.length; i++) {

    //Create a new object with the district's name and empty array
    dataset[i] = {
      district: data[i].district,
      rate: []
    };

    //Loop through all the years 
    for (var j = 0; j < years.length; j++) {

      //If value is empty
      if (data[i][years[j]]) {
        //Add a new object to the Div 9 rate data array
        //for that district
        dataset[i].rate.push({
          year: years[j],
          amount: data[i][years[j]]

        }); // end of push( function
      } //end of if(
    } // end of for loop for years
  } // end of for loop for data

  // Set scale domains
  
  xScaleLine.domain([
    d3.min(years, function(d) {
      return dateFormat.parse(d);
    }),
    d3.max(years, function(d) {
      return dateFormat.parse(d);
    })
  ]);

  yScaleLine.domain([
    d3.max(dataset, function(d) {
      return d3.max(d.rate, function(d) {
        return +d.amount;
      });
    }),
    0
    ]);

  // Make a group for each district
  var groups = linechart.selectAll("g")
      .data(dataset)
      .enter()
      .append("g")
      .classed("national", function(d) {
        if (d.district == "UGANDA") return true;
        else return false;
      })
      .on("mouseover", function(d) {

        activeDistrict = d.district;

        // Setting positio for the district label
        var xPosition = wLine/2 + 35;
        var yPosition = marginLine.top - 10;

        linechart.append("text")
        .attr("id", "hoverLabel")
        .attr("x", xPosition)
        .attr("y", yPosition)
        .attr("text-anchor", "start")
        .attr("font-family", "ff-nuvo-sc-web-pro-1,ff-nuvo-sc-web-pro-2, sans-serif") 
        .attr("font-size", "20px")
        .text( activeDistrict); 

        d3.selectAll("rect")
        .classed("barLight", function(d) {
          if ( d.district == activeDistrict) return true;
          else return false;
        });

      }) // end of .on mouseover

      .on("mouseout", function() {
        d3.select("#hoverLabel").remove();

        d3.selectAll("rect")
        .attr("class", "barBase");

      }) // end of .on mouseout


  // Append a title with the district name (for easy tooltips)
      groups.append("title")
          .text(function(d) {
            return d.district;
          });

      //Within each group, create a new line/path,
      //binding just the div9 rate data to each one
      groups.selectAll("path")
        .data(function(d) {
          return [ d.rate ];
        })
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", line);

      //Axes
      linechart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (hLine - marginLine.bottom) + ")")
        .call(xAxisLine);
      
      linechart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (marginLine.left) + ",0)")
        .call(yAxisLine)
        .append("text")
        .attr("x", 0 - marginLine.left)
        .attr("y", marginLine.top - 10)
        .style ("text-anchor", "start")
        .text("% of candidates who obtained a Division 9 in ");

        //Labels for highlighted lines - probably better to wrap these into the line elements themselves 
        //with some logic for selecting the ones you want to highlight? Use anonymous function to match objects for highlighting?
        //National label
        linechart.append("text")
          .attr("transform", "translate(" + xLabelLine + ", " + yScaleLine(data[20][years[4]]) + ")")
          .attr("dy", ".15em")
          .attr("dx", ".25em")
          .attr("text-anchor", "start")
          .attr("class","labelNation")
          .text( + data[20][years[4]] );



});// end of d3.csv(---------*/

// DO the stuff
/* ---------- INITIAL CONDITIONS -------- */

var origin = [ww/2.5, hh/3], p = 10, j = 2, scale = ww/4, rad = 5,
    scatter = [], yLine = [], xGrid = [],
    beta = 0, alpha = 0, 
    key = function(d){ return d.id; },
    startAngle = Math.PI/5;

/* ----------- SVG OBJECT ----------- */
var svg_3d = d3.select("#area2").selectAll('svg')
    .call(d3.drag().on('drag', dragged)
        .on('start', dragStart)
        .on('end', dragEnd))
    .append('g');

/* ----------- ZOOM AND PAN ----------- */

var pan_x, pan_y, zoom_idx;

d3.select("#zoom_in").on("click", function() {
   pan_x = d3.zoomTransform(svg_3d).x;
   pan_y = d3.zoomTransform(svg_3d).y;
   zoom_idx = d3.zoomTransform(svg_3d).k;
   d3.zoomTransform(svg_3d).k = zoom_idx * 1.1 ;
   svg_3d.attr("transform", "translate(" + pan_x + "," + pan_y + ") scale("+ d3.zoomTransform(svg_3d).k + ")");
});

d3.select("#zoom_out").on("click", function() {
   pan_x = d3.zoomTransform(svg_3d).x;
   pan_y = d3.zoomTransform(svg_3d).y;
   zoom_idx = d3.zoomTransform(svg_3d).k;
   d3.zoomTransform(svg_3d).k = zoom_idx * 0.9 ;
   svg_3d.attr("transform", "translate(" + pan_x + "," + pan_y + ") scale("+ d3.zoomTransform(svg_3d).k + ")");
});
 
d3.select("#pan_right").on("click", function() {
   pan_x = d3.zoomTransform(svg_3d).x; pan_y = d3.zoomTransform(svg_3d).y;
   zoom_idx = d3.zoomTransform(svg_3d).k;
   d3.zoomTransform(svg_3d).x = pan_x + 20;
   svg_3d.attr("transform", "translate(" +  d3.zoomTransform(svg_3d).x + "," + pan_y + ") scale("+ zoom_idx + ")");
});

d3.select("#pan_left").on("click", function() {
    pan_x = d3.zoomTransform(svg_3d).x;
    pan_y = d3.zoomTransform(svg_3d).y;
    zoom_idx = d3.zoomTransform(svg_3d).k;
    d3.zoomTransform(svg_3d).x = pan_x - 20;
    svg_3d.attr("transform", "translate(" +  d3.zoomTransform(svg_3d).x + "," + pan_y + ") scale("+ zoom_idx + ")");
});

d3.select("#pan_up").on("click", function() {
    pan_y = d3.zoomTransform(svg_3d).y; 
    pan_x = d3.zoomTransform(svg_3d).x;
    zoom_idx = d3.zoomTransform(svg_3d).k;
    d3.zoomTransform(svg_3d).y = pan_y - 20;
    svg_3d.attr("transform", "translate(" +  pan_x + "," + d3.zoomTransform(svg_3d).y + ") scale("+ zoom_idx + ")");
});

d3.select("#pan_down").on("click", function() {
    pan_y = d3.zoomTransform(svg_3d).y; 
    pan_x = d3.zoomTransform(svg_3d).x;
    zoom_idx = d3.zoomTransform(svg_3d).k;
    d3.zoomTransform(svg_3d).y = pan_y + 20;
    svg_3d.attr("transform", "translate(" +  pan_x + "," + d3.zoomTransform(svg_3d).y + ") scale("+ zoom_idx + ")");
});

d3.select("#reset").on("click", function() {
    d3.zoomTransform(svg_3d).y = 0; 
    d3.zoomTransform(svg_3d).x = 0;
    d3.zoomTransform(svg_3d).k = 1;
    svg_3d.attr("transform", "translate(" +  d3.zoomTransform(svg_3d).x + "," + d3.zoomTransform(svg_3d).y + ") scale("+ d3.zoomTransform(svg_3d).k + ")");
});


// ----------------------------------------------

var color  = d3.scaleOrdinal(d3.schemeCategory10);
//  var color  =  [d3.color('crimson')];

var mx, my, mouseX, mouseY;

/* -------- GRID AND POINTS VARS ----------- */

var grid3d = d3._3d()
    .shape('GRID', j*2)
    .origin(origin)
    .rotateY( startAngle)
    .rotateX(-startAngle)
    .scale(scale);

var point3d = d3._3d()
    .x(function(d){ return d.x; })
    .y(function(d){ return d.y; })
    .z(function(d){ return d.z; })
    .origin(origin)
    .rotateY( startAngle)
    .rotateX(-startAngle)
    .scale(scale);
        
/* ------- YLAB VAR ----------- */

var yScale3d = d3._3d()
    .shape('LINE_STRIP')        
    .origin(origin)
    .rotateY( startAngle)
    .rotateX(-startAngle)
    .scale(scale);

/* -------- LOAD THE POINTS ----------- */

// load dataset and create plot
function load_dataset_2(csv) {
  // first restart the area to remove the points
  scatter = [];
  d3.selectAll("#area2").select("svg").selectAll("circle").remove()
  // parse the data set and plot it
  var data_3d = d3.csvParse(csv);
  console.log(data_3d);
  data_3d.forEach(function(d) 
            {
            scatter.push({x: +(d.Xnorm )*2, 
                          y: +(d.Ynorm)*2, 
                          z: +(d.Znorm)*2,
                          id: d.cell});
            });

init();
reset_cell_cols();
}



/*d3.csv("./paryhale/cells_3Dnorm_centroid.csv", function(file) {        
         file.forEach(function(d) 
            {
            scatter.push({x: +(d.Xnorm )*2, 
                          y: +(d.Ynorm)*2, 
                          z: +(d.Znorm)*2,
                          id: d.cell});
            }); 
           //console.log(file[0])
         });
    console.log(scatter)
*/

function processData(data, tt){

    /* ----------- GRID ----------- */

    var xGrid = svg_3d.selectAll('path.grid').data(data[0], key);

    xGrid
        .enter()
        .append('path')
        .attr('class', '_3d grid')
        .merge(xGrid)
        .attr('stroke', 'grey')
        .attr('stroke-width', 0.3)
        .attr('fill', function(d){ return d.ccw ? 'lightblue' : '#717171'; })
        .attr('fill-opacity', 0.2)
        .attr('d', grid3d.draw);

    xGrid.exit().remove();

    /* ----------- POINTS ----------- */

    points = svg_3d.selectAll('circle').data(scatter, key);

    points
        .enter()
        .append('circle')
        .attr('class', '_3d')
        .attr('opacity', 10)
     //   .attr('fill-opacity', 1)
        .attr('cx', posPointX)
        .attr('cy', posPointY)
        .attr('id',myid)
        .merge(points)
        .transition().duration(tt)
        .attr('r', rad)
//      .attr('stroke', function(d){ return d3.color(color(d.id)).darker(3); })
//      .attr('fill', function(d){ return color(d.id); })
        //.attr('fill', function(d){ return "grey" })
        .attr('opacity', 0.8)
        .attr('cx', posPointX)
        .attr('cy', posPointY)
        .attr('id',myid);

    /* ----------- Interactions ----------- */
    points.on('click', click2);

    points.on("contextmenu", d3.contextMenu(menu2) );

    //points.exit().remove();

    /* ----------- y-Scale ----------- */

    var yScale = svg_3d.selectAll('path.yScale').data(data[2]);

    yScale
        .enter()
        .append('path')
        .attr('class', '_3d yScale')
        .merge(yScale)
        .attr('stroke', 'black')
        .attr('stroke-width', .5)
        .attr('d', yScale3d.draw);

    yScale.exit().remove();

     /* ----------- y-Scale Text ----------- */

    var yText = svg_3d.selectAll('text.yText').data(data[2][0]);

    yText
        .enter()
        .append('text')
        .attr('class', '_3d yText')
        .attr('dx', '.3em')
        .merge(yText)
        .each(function(d){
            d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
        })
        .attr('x', function(d){ return d.projected.x; })
        .attr('y', function(d){ return d.projected.y; })
        .text(function(d){ return d[1] <= 0 ? d[1] : ''; });

    yText.exit().remove();

    d3.selectAll('._3d').sort(d3._3d().sort);
    }
  
function posPointX(d){
        return d.projected.x;
        }

function posPointY(d){
        return d.projected.y;
        }
 
function myid(d){
        return d.id;
        }

/* --------- RESTART RANDOM POINTS (AND FIXED GRID) ---------- */
function init(){
        var cnt = 0;
        xGrid = [], yLine = [];
        
        //---create grid --/
        for(var z = -1; z <= 1; z = z + 0.5){
            for(var i = -1; i < 1.5; i = i + 0.7){
                xGrid.push([i, 0.25, z]);
            }
        }
 
        //---determine y range based on j variable --/
        d3.range(0, j, 1).forEach(function(d){ yLine.push([-1, -d, -1]); });

        
        data = [
            grid3d(xGrid),
            point3d(scatter),
            yScale3d([yLine])
            ];top
        processData(data, 0);
    }

function dragStart(){
        mx = d3.event.x;
        my = d3.event.y;
       // console.log("started dragging!")
    }

function dragged(){
       // console.log("Dragging!")
        mouseX = mouseX || 0;
        mouseY = mouseY || 0;
        beta   = (d3.event.x - mx + mouseX) * Math.PI / 230 ;
        alpha  = (d3.event.y - my + mouseY) * Math.PI / 230  * (-1);
        data = [
            grid3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(xGrid),
            point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(scatter),
            yScale3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([yLine]),
        ];
        processData(data, 0);
    }

function dragEnd(){
        mouseX = d3.event.x - mx + mouseX;
        mouseY = d3.event.y - my + mouseY;
        //console.log("stopped dragging!")
    }

function common_anc1(d) {
    console.log("I have clicked in cell "+ d)
    d3.selectAll("#area1").select("g").select(d)
        .each(function(d) 
          {
            selections = d.ancestors().map(d => d.data.did)
            console.log("Parents are " + selections)
            double_element.push(selections)
          })
    }

function common_anc2(d) {
    console.log("I have clicked in cell "+ d)
    d3.selectAll("#area1").select("g").select(d)
        .each(function(d) 
          {
            selections = d.ancestors().map(d => d.data.did)
            console.log("Parents are " + selections)
            double_element.push(selections)
            a = findCommonElements(double_element)
            b = a[a.length-1]
            console.log("Last common ancestor is " + b)
            // paint common ancestor
            d3.selectAll("#area1").selectAll("#"+b)
                .select("circle").style("fill", "red")
            // paint all descendants
                .each(function(d)
                    {
                    //count_leaves(d);
                    selections = d.descendants().map(d => d.data.did)
                    for(var jj = 0; jj<selections.length; jj++)
                        {
                        console.log("daughters "+selections[jj])
                        d3.selectAll("#area1").selectAll("#"+selections[jj])
                        .select("circle").style("fill", "red")
                        var xx = "#"+selections[jj];
                        d3.selectAll("#area2").select(xx)
                            .attr('opacity', 10).attr('fill-opacity', 1).attr("fill", "purple");
                        d3.selectAll("#area2").select(xx).attr("r", 6);
                        }
                    })
          })
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
                            .select("circle").style("fill", "red")
                        }
                  })
            }

function click2(d) {
     d3.select('.status')
        .text('You clicked on ' + myid(d)); // Logs the x and y position of the datum.
        // $(this).hide();
    $(this).attr("r", 6);
    $(this).attr("fill", "purple").attr('opacity', 10).attr('fill-opacity', 1);
    var yy = "#"+myid(d);
    d3.selectAll("#area1").select(yy).select("circle")
        .style("stroke", "purple")
        .transition().duration(500).style("stroke-width", 5).attr("r",13)
        .transition().duration(800).style("stroke-width", 5).attr("r",9)
        ;        
    }

 //   d3.selectAll('button').on('click', init);

    // ----- experiments --/

function reset_cell_cols() {
    d3.selectAll("#area2")
        .selectAll("circle")
         //.attr('opacity', 10)
        .attr('fill-opacity', 0.3)
        .attr("fill", "grey");
    }



// Get the disparity vals

function disparity(){
    var myIDs;
    d3.csv("./disparity.csv", function(disp2) {
        
        var myDisp = d3.map(disp2,  function(d){return d.disparity;}).keys()
        // transform the values to floating numbers
        var res = myDisp.map(function(v) {return parseFloat(v, 10);});
        console.log(res);
        // store Max and min in vars
        var dispMax = d3.max(res); var dispMin = d3.min(res);
        
        var sequentialScale = d3.scaleSequential()
	       .domain([dispMin, dispMax])
	       .interpolator(d3.interpolateYlOrBr);
        
        d3.map(disp2, function(d){
            //console.log(d.disparity);
            d3.selectAll("#area2").select("#"+d.ID)
            .attr("fill-opacity",1)
            .attr('fill', function(d2) {
                return sequentialScale(d.disparity);
                });
        })
        //console.log(disp2);
    });

}


d3.csv("./disparity.csv", function(disp) {
    return {
        //myID : disp.ID,
        myDisp : +disp["disparity"]
        };
}, function(error, rows) {
    console.log(d3.values(rows));
});


/*init();
processData(data,0);
console.log("here?")*/