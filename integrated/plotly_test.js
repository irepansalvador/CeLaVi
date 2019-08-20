/* JAVASCRIPT CODE GOES HERE */


var data;  var layout = {margin: {l: 0,r: 0,b: 0,t: 0}};
    
Plotly.d3.csv(
  "./Epith_limb_last_stage_coords_centroid.csv",
  function(err, rows) {
    function unpack(rows, key) {
      return rows.map(function(row) {
        return row[key];
      });
    }

    function setValue(rows, key, color) {
      return rows.map(function(row) {
        return color;
      });
    }
    var trace1 = {
      x: unpack(rows, "x1"),
      y: unpack(rows, "y1"),
      z: unpack(rows, "z1"),
      mode: "markers",
      marker: {
        color: setValue(rows, "z1", "rgb(127, 230, 127)"),
        size: setValue(rows, "z1", 9),
        line: {color: "rgba(217, 217, 217, 0.14)",width: 0.5},
        opacity: 0.8
      },
      type: "scatter3d"
    };

    data = [trace1];
   Plotly.newPlot("area2", data, layout, {responsive: true});
      

    var plotly_scatter_div = document.getElementById("area2");

    var color_select = "#7b3294";

    plotly_scatter_div.on("plotly_click", function(data) {
      var pn = "",
        tn = "",
        colors = [];

      for (var i = 0; i < data.points.length; i++) {
        pn = data.points[i].pointNumber;
        tn = data.points[i].curveNumber;
        colors = data.points[i].data.marker.color;
      }
    colors[pn] = color_select;
    var update = {
        ["marker.color[" + pn + "]"]: color_select,
        ["marker.size[" + pn + "]"]: 15
      };
      setTimeout(function(x) {
        Plotly.restyle("area2", update, tn);
        console.log(pn , tn)
        }, 50);
    });
  });

