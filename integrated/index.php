<!DOCTYPE html>
<meta charset="utf-8">
<!-- JS scripts -->
<head>
	<meta charset="UTF-8">
	<title>CelaVi</title>
	<!-- Custom CSS styles -->
	<link href="style_2.css" rel="stylesheet" type="text/css" > 
	<link rel="stylesheet" href="./lib/d3-context-menu.css" />
	<link rel="stylesheet" href="./lib/introjs.css"/>
	<link rel="stylesheet" href="./lib/colpick.css"/>
	<script src="./lib/d3.v3.js"></script> 
	<!--	<script src="https://d3js.org/d3.v3.min.js"></script> -->
	<script src="./lib/d3.v4.min.js"></script>  <!--3d cells-->
	<script src="./lib/d3-3d.min.js"></script>
	<script src="./lib/jquery.min.js"></script>
	<script src="./lib/newick.js" type="text/javascript"></script>
	<script src="./lib/d3-hierarchy.min.js"></script>
	<script src="./lib/d3-context-menu.js"></script>
	<script src="https://d3js.org/d3-color.v1.min.js"></script>
	<script src="https://d3js.org/d3-interpolate.v1.min.js"></script>
	<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
	<script src="./lib/colpick.js"></script>
	<script src="./lib/virtualscroller.js"></script>
	<!-- Libs to export tree to png -->
	<script src="./lib/canvas-toBlob.js"></script>
	<script src="./lib/FileSaver.min.js"></script>
	<!-- Range slider code -->
	<script src="./lib/d3RangeSlider.js"></script>
	<!-- Range slider style -->
	<link href="./lib/d3RangeSlider.css" rel="stylesheet">
	<!-- Bootstrap -->
	<link href="./lib/bootstrap.min.css" rel="stylesheet">
	<!--Plotly-->
	<script src="./lib/plotly-latest.min.js"></script>
	<!--CSV parser-->
	<script src="./lib/papaparse.min.js"></script>
</head>

<body onload="introJs().start();">
	<!-- Splash screen 
	<div id="splashscreen">
		<img src="CeLaVi_welcome.png" onclick="enter_link(); javascript:introJs().start();   " />
	</div> -->
	<div id= "container" class="svg-container">
		<div class="row">
			<div class="col-sm-1" >
				<img src="./lib/CeLaVi_v4.png" alt="CeLaVi_logo" width="90" style="padding-bottom: 5px;">
			</div>
			<div class="col-sm-10">
				<div id="name">
					<h2><i>CeLaVi:</i> Cell Lineage interactive Visualisation</h2>
					<p> <i> by Irepan Salvador-Martinez et al.</i> </p>
				</div>
			</div>
			<div class="col-sm-1" >
				<img src="./lib/CeLaVi_v4.png" alt="CeLaVi_logo" width="90" style="padding-bottom: 5px;">
			</div>
		</div>
		<!-- Button to hide INPUT -->
		<div id="container_INPUT">
			<div class="row">
				<div class="col-sm-2 mb-2">
					<button  id ="HideINPUT" onclick="HideINPUT()">HIDE Input Options</button>
				</div>
				<div class="col-sm-2 mb-2">
					<div class="dropdown">
						<button class="dropbtn">Load Example files</button>
						<div class="dropdown-content">
							<a href="#" onclick="Examples(1)">C. elegans</a>
							<a href="#" onclick="Examples(2)">Ciona gastrula</a>
							<a href="#" onclick="Examples(3)">Parhyale limb</a>
							<a href="#" onclick="Examples(4)">Organoid</a>
						</div>
					</div>
				</div>
				<div data-step="10" data-intro="Please visit the tutorial to get more details. ENJOY!"  class="col-sm-2 mb-2">
					<a class="btn btn-large btn-primary" href="http://compus-mentis.org/visualisation/integrated/tutorial.html" target="_blank">
					<span style="display: block;">Visit Tutorial</span>
					</a>
				</div>
				<div class="col-sm-2 mb-2" style="display: none">
					<button id="example-button" value="#00FF00">Color Picker</button>
					
				</div>
				<div class="col-sm-2 mb-2">
					<a class="btn btn-large btn-primary" href="javascript:void(0);" onclick="javascript:ShowINPUT(); introJs().start();">Quick Tour</a>
				</div>
				<div class="col-sm-2 mb-2" id="Hide_metadata" style="display: none">
					<button id="HideMeta" onclick="HideMETADATA()">Hide Cell Annotations</button>
				</div>
				<div class="col-sm-2 mb-2" id="GOI_submit" style="display: none">
					<form autocomplete="off" action="javascript:Submit_GOI();" >
						<div class="autocomplete" >
							<input id="GeneInput" type="text" name="myGene" placeholder="Type gene">
						</div>
						<input type="submit">
					</form>
				</div>
			</div>
		</div>
		<div id="container_INPUT">
			<div id="input_submit">
				<div class="row">
					<div class="col-sm-3 mb-2">
						<a href="#" data-toggle="tooltip" data-placement="right" title="Input file cell lineage tree with or without branch lengths."><label for="temp">Tree file:</label></a>
						<div data-step="1" data-intro="To start, select a lineage tree file (newick or json format). You can download the TEST files clicking the link under this box or clicking on Load Example files. To exit click 'skip' or click outside this box" class="custom-file mb-3" id="temp">
							<input type="file" class="custom-file-input" id="JSON_uploader" name="TREE_FILE">
							<label class="custom-file-label" for="JSON_uploader">Upload tree (".nw", ".newick", ".json")</label>
						</div>
					</div>
					<div data-step="5" data-intro="Select a file with XYZ coordinates to start 3D visualisation"  class="col-sm-3 mb-2">
						<a href="#" data-toggle="tooltip" data-placement="left" title="Reads a csv file with 4 columns: The first column is the cell ID (same as in the tree), and the other columns are coordinates X, Y and Z "><label for="temp">Coords file:</label></a>
						<div class="custom-file mb-3" id="temp">
							<input type="file" class="custom-file-input" id="3Dcoord_uploader" name="coordsfile">
							<label class="custom-file-label" for="3Dcoord_uploader">Input coordinates file</label>
						</div>
					</div>
					<div class="col-sm-1 mb-2">
					</div>
					<div data-step="6" data-intro="Optionally you can load a metadata file with a categorical feature you want to plot (e.g. cell type)" class="col-sm-2 mb-2">
						<a href="#" data-toggle="tooltip" data-placement="right" title="Reads a csv file with N columns: The first column is the cell ID (same as in the tree and 3D coords), and the rest of the columns contain additional info on the cells (e.g. cell type)"><label for="temp">Additional info file:</label></a>
						<div class="custom-file mb-3" id="temp">
							<input type="file" class="custom-file-input" id="Metadata_uploader" name="Metadata_File">
							<label class="custom-file-label" for="Metadata_uploader">Input Additional Info file</label>
						</div>
					</div>
					<div data-step="7" data-intro="Here you can upload a gene expression datafile to plot a virtual insitu image"  class="col-sm-2 mb-2">
						<a href="#" data-toggle="tooltip" data-placement="right" title="Reads Gene expression matrix"><label for="temp">Gene Expression file:</label></a>
						<div class="custom-file mb-3" id="temp">
							<input type="file" class="custom-file-input" id="GeneExp_uploader" name="GeneExp_File">
							<label class="custom-file-label" for="GeneExp_uploader">Input Gene Exp file</label>
						</div>
					</div>
				</div>
			</div>
		</div>
		<a href="./test_data.zip" download>Download TEST files (zip folder)</a>
		<!-- <div class="status" align="Center" ></div> -->    
		<div id="container2"> <!-- added -->
			<div id="container1">	
				<div id="area1"> <!-- cell lineage -->
					<h4>Lineage viewer</h4> 
					<h6></h6>
				</div>
				<div id="area2" class="svg-container-inbox"> <!-- cells in 3d -->
					<h4> 3D viewer</h4>
				</div>
			</div>
		</div>
		<div id="container_A">
		<!-- LEFT PART OF THE CONTROLS, FOR THE TREE  -->
			<div id= "controls_1a" align="left" class="svg-buttons">
				<div class="row">
					<div  data-step="8" data-intro="These options allow you to control the visualisation of the lineage tree" class="col-sm-4 mb-2">
						<h6> Cell lineage tree controls: </h6>
						<div class="row">
							<div align="left">
								<div class="btn-group">
  								<button onmousedown="zoom_in_start()"  onmouseup="end()" id="zoom_in_tree" title="Expand the tree horizontally" type="button" class="btn btn-success"><></button>
									<button onmousedown="zoom_out_start()" onmouseup="end()" id="zoom_out_tree" title="Contract the tree horizontally" type="button" class="btn btn-success">><</button>
  								<button onmousedown="pan_down_start()" onmouseup="end()" id="pan_down_tree" title="Expand the tree vertically" type="button" class="btn btn-success">v</button>
  								<button onmousedown="pan_up_start()"   onmouseup="end()" id="pan_up_tree" title="Contract the tree vertically" type="button" class="btn btn-success">^</button>
								</div>
							</div>
							<div>
								<button id="BranchLenghts" title="Alternate between showing Tree depth (default) and Branch Lenghts" type="button" onclick="show_bl()" class="btn btn-success" >Show BL</button> 
							</div>
							<div>
								<button id="Reset"  title= "Click to reset to the default topology 
(only showing daughters of root)" type="button" onclick="resetAll()" class="btn btn-success" >Reset Topology</button> 
							</div>
							<div class="col-sm-2">
								<div class="dropdown">
									<button class="dropbtn">Save Image</button>
									<div class="dropdown-content">
										<a href="#" onclick="SaveSVG()">SVG</a>
										<a href="#" onclick="SavePNG()">PNG</a>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div  data-step="9" data-intro="These options allow you to save clones" class="col-sm-3 mb-2">
						<h6> Clones Controls: </h6>
						<div class="row">
							<div class ="col-sm-6" >
								<label for="saved_clones">Saved clones:</label>
								<div class "row">
									<svg width="30" height="30">
										<rect id="square_clone" width="25" height="25" style="fill:#bccbde;stroke-width:3;stroke:rgb(0,0,0)" />
									</svg>  
									<select id="saved_clones">
									</select> 
								</div>
							</div>
							<div class="col-sm-3" align="left">
								<button id="Reset_clones"  title= "Click to reset the list of saved clones" type="button" onclick="resetClones()" class="btn btn-info" >Reset Clones</button> 
							</div>
							<div class="col-sm-2">
								<button id="reset" title="Set the colour of the cells back to default (white)" type="button" class="btn btn-info">Reset Colors</button>
							</div>
						</div>
					</div>


					<!-- RIGHT PART OF THE CONTROLS, FOR CELLS IN 3D -->
					<div data-step="10" data-intro="And these allow you to control the visualisation of the cells in 3D"  class="col-sm-5 mb-2">
						<h6> 3D cells controls: </h6>
						<div class="row">
							<div class="col-sm-3">
								<a> Cell size</a>
								<input type="number" class="form-control" id="CellSize" placeholder="" value="9" min="1" step="1" title="Size for rendering cells"  required>
							</div>
							<div class="col-sm-3">
								<a> Stroke width </a>
								<input type="number" class="form-control" id="CellStroke" placeholder="" value="1" min="1" step="1" max="5" title="Stroke width"  required>
							</div>
							<div class="col-sm-2" title="This option requires that the lineage tree is completely expanded" >
								<input id="Cells_checkbox" type="checkbox" value="">Show Lineage
							</div>
							<div class="col-sm-2">
								<div class="dropdown">
									<button class="dropbtn">Save Image</button>
									<div class="dropdown-content">
										<a href="#" onclick="Save3DPNG()">PNG</a>
									</div>
								</div>
							</div>
							<div class="col-sm-2" title="" >
								<input id="Show_grid" type="checkbox" value="">Show Axes
							</div>


						</div>
					</div>
				</div>        
			</div>
		</div> 
		<div id="container_A">
			<div class="row">
				<div class="col-sm-6"  id="slider" title="Click on the purple circles (Tree depth mode) 
or on the slider (Branch Lenght mode) to show
clones at a given depth/time">
					<h5>Tree depth</h5>
				</div>
				<div  class="col-sm-6"  id="HM_scale" title="">
					<h5></h5>
				</div>
			</div>       
		</div>
		<div id="footer">
			<h6>The development of celavi.pro is funded by
				the Human Frontiers Science Program (HFSP)</h6>
			<img src="HFSP_logo.jpg" alt="HFSP_logo" width="80" >
			<br>
			<strong>Source</strong> : https://github.com/irepansalvador/
		</div>
	</div>
	<!-- JS Libraries -->
	<!--<script src="d3.js" charset="utf-8"></script>-->
	<!-- Custom JS code -->
	<!--<script src="cells_3d_paryhale.js"></script> -->
	<script src="cell_lineage_v4_paryhale.js"></script>
	<script src="plotly_test.js"></script>
	<script src="brush_paryhale.js"></script>
	<script src="Nested_rels_scale.js"></script>
	<script>Coords_upload_button("3Dcoord_uploader", load_dataset_2)</script>
	<!--	<script>Tree_upload_button("JSON_uploader"); </script> -->
	<script src="clones_slider.js"></script>
	<script src="Tree_submit.js"></script>
	<script src="table_scroller.js"></script>
	<script>Metadata_upload_button("Metadata_uploader", load_dataset_3)</script>
	<script src="gene_matrix_loader.js"></script>
	<script>GeneExp_upload_button("GeneExp_uploader", load_dataset_4)</script>
	<!-- Examples uploader-->
	<script src="./examples.js"></script>
	<!-- export png -->
	<script src="./tree_png_download.js"></script>
	<script src="./lib/intro.js"></script>
</body>
