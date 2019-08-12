<!DOCTYPE html>
<meta charset="utf-8">
<!-- JS scripts -->

	<head>
		<meta charset="UTF-8">
		<title>Cell lineage visualisation</title>
		<!-- Custom CSS styles -->
		<link href="style.css" rel="stylesheet" type="text/css" >
		<link rel="stylesheet" href="./lib/d3-context-menu.css" />
        <script src="./lib/d3.v3.js"></script>
        <script src="./lib/d3.v4.min.js"></script> <!-- 3d cells-->
        <script src="./lib/d3-3d.min.js"></script>
        <script src="./lib/jquery.min.js"></script>
        <script src="./lib/newick.js" type="text/javascript"></script>
        <script src="./lib/d3-hierarchy.min.js"></script>
        <script src="./lib/d3-context-menu.js"></script>
        <script src="https://d3js.org/d3-color.v1.min.js"></script>
        <script src="https://d3js.org/d3-interpolate.v1.min.js"></script>
				<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
    		<!-- Bootstrap -->
    		<link href="./lib/bootstrap.min.css" rel="stylesheet">
    </head>

    <body>
		<div id= "container", class="svg-container">
			<h3> Cell lineage interactive visualisation</h3>
            <h6> <i> by Irepan Salvador-Martinez </i> </h6>

      <h6 class="pl-0">INPUT FILES</h6>
      <div class="row">
        <div class="col-sm-3 mb-2">
          <a href="#" data-toggle="tooltip" data-placement="right" title="Input file containing a JSON tree with or without branch lengths."><label for="temp">Tree file:</label></a>
          <div class="custom-file mb-3" id="temp">
            <input type="file" class="custom-file-input" id="JSON_uploader" name="treefile">
            <label class="custom-file-label" for="treefile">Input JSON tree file</label>
          </div>
				</div>
		 
				<div class="col-sm-3 mb-2">
          <a href="#" data-toggle="tooltip" data-placement="right" title="Input file containing a Newick tree with or without branch lengths."><label for="temp">Tree file:</label></a>
          <div class="custom-file mb-3" id="temp">
            <input type="file" class="custom-file-input" id="Newick_uploader" name="treefile">
            <label class="custom-file-label" for="treefile">or Input Newick tree file</label>
          </div>
				</div>

				<div class="col-sm-3 mb-2">
          <a href="#" data-toggle="tooltip" data-placement="left" title="Input file containing a Cell coordinates."><label for="temp">Coords file:</label></a>
          <div class="custom-file mb-3" id="temp">
            <input type="file" class="custom-file-input" id="3Dcoord_uploader" name="coords">
            <label class="custom-file-label" for="treefile">Input coordinates file</label>
          </div>
				</div>
      </div>

          
      <div class="status" align="right" > Click on a cell      </div>
            
     	<!-- Separate Areas -->
			<div id="area1"> <!-- cell lineage -->
            <h4>Cell lineage</h4>
			</div>
            
			<div id="area2"> <!-- cells in 3d -->
				<h4> Cells in 3D</h4>
				</div>
        <!-- LEFT PART OF THE CONTROLS, FOR THE TREE  -->
				<div id= "controls_1a" align="left" class="controls">
					<div class="row">
						<div class="col-sm-8 mb-2">
						<a href="#" data-toggle="tooltip" data-placement="left" title="Play with tree">Cell lineage tree controls:</a>
						<div class="row">
							<div class="col-sm-2.5" align="right">
								<div class="btn-group">
  								<button id="zoom_in_tree" type="button" class="btn btn-success"><></button>
									<button id="zoom_out_tree" type="button" class="btn btn-success">><</button>
  								<button id="pan_down_tree" type="button" class="btn btn-success">v</button>
  								<button id="pan_up_tree" type="button" class="btn btn-success">^</button>
								</div>
							</div>
							<div class="col-sm-1.5">
								<button id="BranchLenghts" onclick="show_bl()" class="btn btn-success" >Branch Lenghts</button> 
							</div>
							<div class="col-sm-1.5">
								<button id="CollapseAll" onclick="collapseAll()" class="btn btn-success" >Collapse All</button> 
							</div>
							<div class="col-sm-1.5">
								<button id="Reset" onclick="resetAll()" class="btn btn-success" >Reset Topology</button> 
							</div>
							<div class="col-sm-1.5">
								<button id="Reset_cols_Tree" class="btn btn-success" >Reset cols</button> 
							</div>
							<div class="col-sm-2">
								<label class="checkbox"><input id="Tree_checkbox" type="checkbox" value="">Show Descendants</label>
							</div>
							<div class "col-sm-1" id="controls_1">
							</div>
						</div>
						</div>
					<!-- RIGHT PART OF THE CONTROLS, FOR CELLS IN 3D -->
						<div class="col-sm-4 mb-2">
						<a href="#" data-toggle="tooltip" data-placement="right" title="Zoom and Pan cells in 3D">3D cells controls:</a>
						<div class="row">
							<div class="col-sm-1.5" align="right">
								<div class="btn-group">
  								<button id="zoom_in" type="button" class="btn btn-info">+</button>
									<button id="zoom_out" type="button" class="btn btn-info">-</button>
								</div>	
							</div>
							<div class="col-sm-2.5">
								<div class="btn-group">
  								<button id="pan_right" type="button" class="btn btn-info">></button>
  								<button id="pan_left" type="button" class="btn btn-info"><</button>
  								<button id="pan_down" type="button" class="btn btn-info">v</button>
  								<button id="pan_up" type="button" class="btn btn-info">^</button>
								</div>	
							</div>
							<div class="col-sm-3.5">
								<button id="reset" type="button" class="btn btn-info">Reset cols</button>
							</div>
							<div class="col-sm-3">
								<input type="number" class="form-control" id="CellSize" placeholder="" value="6" min="1" step="1" title="Size for rendering cells"  required>
							</div>
							<div class="col-sm-2.5">
								<input id="Cells_checkbox" type="checkbox" title="This option works better if the tree is completely expanded" value="">Show Lineage
							</div>
						</div>
					</div>
				</div>        
		</div> 
        <div id="slider">
           <h5>Tree depth</h5>
        </div>
        <div id="HM_scale">
           <h5>Lineage relationships</h5>
        </div>
        

		<div id="footer">
			<strong>Source</strong> : https://github.com/irepansalvador/
		</div>
		<!-- JS Libraries -->
		<!--<script src="d3.js" charset="utf-8"></script>-->
  
        <!-- Custom JS code -->
        <script src="cells_3d_paryhale.js"></script><!-- -->
		<script src="cell_lineage_v4_paryhale.js"></script>
        <script src="brush_paryhale.js"></script>
        <script src="Nested_rels_scale.js"></script>
        <script>Coords_upload_button("3Dcoord_uploader", load_dataset_2)</script>
        <script>Tree_upload_button("JSON_uploader", load_dataset_1)</script>
        <!-- Run functions to initialise the visualisation -->
        <script>
            init();
            //tree_from_New();
            processData(data,0);
            reset_cell_cols();
          //  console.log("here?");
        </script>
        
	</body>
