// Set-up the export button
function SavePNG() {
		console.log("Am I clicking here?");
		var width = svg_tree.node().getBBox().width + 30;
		var height = svg_tree.node().getBBox().height + 30;
	
		svgString =  addLogo(svg_tree,height)

		if (height < 500) {height = 500}
		if (width < 600) {width = 600}
		
		var svgString = getSVGString(svg_tree.node(), width, height);
		svgString2Image( svgString,1.5*width,1.5*height, 'png', save ); // passes Blob and filesize String to the callback
		function save( dataBlob, filesize ){
				saveAs( dataBlob, 'cell_lineage.png' ); // FileSaver.js function
		}
	 svg_tree.select("#exportLogo").remove();


	}
function SaveSVG() {
console.log("Am I clicking here?");
	var width = svg_tree.node().getBBox().width + 30;
	var height = svg_tree.node().getBBox().height + 30;
	svgString =  addLogo(svg_tree,height)

	
	if (width < 600) {width = 600}
	if (height < 500) {height = 500}
	
	var svgString = getSVGString(svg_tree.node(), width, height);
	var blob = new Blob([svgString], {"type": "image/svg+xml;base64,"+ btoa(svgString)});
  saveAs(blob, "Cell_lineage.svg");
  svg_tree.select("#exportLogo").remove();

	}


// Below are the functions that handle actual exporting:
// // getSVGString ( svgNode ) and svgString2Image( svgString, width,
// height, format, callback )
function getSVGString( svgNode, width, height ) {
	svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
	var cssStyleText = getCSSStyles( svgNode );
	appendCSS( cssStyleText, svgNode );

	var serializer = new XMLSerializer();
	var svgString = serializer.serializeToString(svgNode);
	svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=');
	// Fix root xlink without namespace
	svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); //Safari NS namespace fix
	svgString = "<svg width=\""+width+ "\" height=\""+height+ "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">"+svgString+"</svg>";
	return svgString;

	function getCSSStyles( parentElement ) {
		var selectorTextArr = [];
		
		// Add Parent element Id and Classes to the list
		selectorTextArr.push( '#'+parentElement.id );
		for (var c = 0; c < parentElement.classList.length; c++)
		if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
		selectorTextArr.push( '.'+parentElement.classList[c] );
		
		// Add Children element Ids and Classes to the list
		var nodes = parentElement.getElementsByTagName("*");
		for (var i = 0; i < nodes.length; i++) {
			var id = nodes[i].id;
			if ( !contains('#'+id, selectorTextArr) )
			selectorTextArr.push( '#'+id );
			
			var classes = nodes[i].classList;
			for (var c = 0; c < classes.length; c++)
			if ( !contains('.'+classes[c], selectorTextArr) )
			selectorTextArr.push( '.'+classes[c] );
		}

// Extract CSS Rules
var extractedCSSText = "";
for (var i = 0; i < document.styleSheets.length; i++) {
var s = document.styleSheets[i];

try {
if(!s.cssRules) continue;
} catch( e ) {
if(e.name !== 'SecurityError') throw e; // for Firefox
continue;
}

var cssRules = s.cssRules;
for (var r = 0; r < cssRules.length; r++) {
if ( contains( cssRules[r].selectorText,
selectorTextArr ) )
extractedCSSText += cssRules[r].cssText;
}
}


return extractedCSSText;

function contains(str,arr) {
return arr.indexOf( str ) === -1 ? false : true;
}

}

function appendCSS( cssText, element ) {
var styleElement = document.createElement("style");
styleElement.setAttribute("type","text/css"); 
styleElement.innerHTML = cssText;
var refNode = element.hasChildNodes() ?
element.children[0] : null;
element.insertBefore( styleElement, refNode );
}
}


function svgString2Image( svgString, width, height, format, callback ) {
	var format = format ? format : 'png';

	var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape( encodeURIComponent( svgString ) ) ); 
//Convert SVG string to data URL

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	canvas.width = width;
	canvas.height = height;
	console.log("before save");
	var image = new Image();
	image.onload = function() {
		console.log("save?");
		context.clearRect ( 0, 0, width, height );
		context.fillStyle = "#ffffff";
		context.fillRect(0, 0, width, height);
		context.drawImage(image, 0, 0, width, height);
		canvas.toBlob( function(blob) {
			var filesize = Math.round( blob.length/1024 ) + 'KB';
			if ( callback ) callback( blob, filesize );
		});
	};
	image.src = imgsrc;
}


function addLogo(svg,height) {
	var logo_xml = '<svg id="exportLogo" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" version="1.1" viewBox="0 0 180 80" width = "180" height="80" x="-90" y="-90" > <g opacity=".5"> <path opacity="1" stroke-linejoin="round" fill="#808080" stroke="#fff" stroke-linecap="round" stroke-width=".75934" d="m132.59 93.069a3.4251 3.4251 0 0 1 -3.4242 3.4251 3.4251 3.4251 0 0 1 -3.426 -3.4233 3.4251 3.4251 0 0 1 3.4224 -3.4269 3.4251 3.4251 0 0 1 3.4278 3.4215"/> <g><g stroke-linejoin="round" fill-rule="evenodd" stroke="#fff" stroke-linecap="round" stroke-width=".75934"> <path opacity="1" fill="#808080" d="m129.64 97.152a3.4251 3.4251 0 0 1 -3.4242 3.4251 3.4251 3.4251 0 0 1 -3.426 -3.4233 3.4251 3.4251 0 0 1 3.4224 -3.4269 3.4251 3.4251 0 0 1 3.4278 3.4215"/> <path opacity="1" d="m136.04 95.426a3.4251 3.4251 0 0 1 -3.4242 3.4251 3.4251 3.4251 0 0 1 -3.426 -3.4233 3.4251 3.4251 0 0 1 3.4224 -3.4269 3.4251 3.4251 0 0 1 3.4278 3.4215"/> <path opacity="1" d="m133.05 99.913a3.4251 3.4251 0 0 1 -3.4242 3.4251 3.4251 3.4251 0 0 1 -3.426 -3.4233 3.4251 3.4251 0 0 1 3.4224 -3.4269 3.4251 3.4251 0 0 1 3.4278 3.4215"/></g><text style="word-spacing:0px;letter-spacing:0px" xml:space="preserve" font-size="15.875px" line-height="277.79998779%" y="102.27293" x="66.835686" font-family="Arial" fill="#000000"><tspan y="102.27293" x="66.835686" fill="#000000">CeLaVi</tspan></text> </g> <g stroke="#000" stroke-width=".75681" fill="none"><path d="m49.44 98.779h5.2917"/><path d="m54.732 93.728 0.000001 9.6212"/><path d="m54.732 103.35h10.583"/><path d="m54.732 93.728h5.2917"/><path d="m60.024 90.12v7.216"/><path d="m60.024 97.336h5.2917"/><path d="m60.024 90.12h5.291"/> </g></g> </g></svg>'
	console.log("plotting height of " + height);
	svg.append("g").html(logo_xml);
	d3.select("#exportLogo")
		.attr("width", "120px")
		.attr("height", "100px")
		.attr("x", "-70")
		.attr("y", "-50")
	d3.select("#area1").select("svg").selectAll("g").select("#exportLogo").raise();
return svg;
}
