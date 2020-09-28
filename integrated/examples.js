console.log("here I am");

var tree_txt = "";
var cells3D_txt = "";
var metadata_txt = "";
var GEmatrix_txt = "";



function Examples(e)
	{
	zoom_reset();
	Abs_rel = undefined;
	Abs_BL= undefined; show_BL = 0;

	d3.select("#area1").select("h4").remove();
	d3.select("#area1").select("#clonesdiv").remove();
	// Remove the slider if exists
	d3.select("#slider").selectAll("input").remove();
	d3.select("#slider").selectAll("svg").remove();
	// remove the previous line
	d3.select("#area1").select("svg").select("g").selectAll("*").remove();
	d3.select("#area1").select("div").remove();
	// remove metadata table
	d3.select("#metadata_table").remove();
	// remove any svg on the scale div
	d3.select("#HM_scale").selectAll("svg").remove();
	// Hide the menu for searching gene
	GE_genes=[]; data_GE=[]; 
	autocomplete(document.getElementById("GeneInput"), GE_genes);
	var x = document.getElementById("GOI_submit");
	x.style.display = "none";
	d3.select("#HM_scale").select("h5").text("");
	// make tooltip invisible
	div.style("opacity", 0)
		.text('');
	resetClones();
	console.log(e);
	var tree_file;
	var cells3D_file;
	var meta_file;
	// Select the options depending on the example chosen
	if (e == 1) {
		activate_tree_controls();
		tree_file = "test_data/C_elegans/C_elegans_tree.json";
		Upload_example_tree();
		load_dataset_json(tree_txt);
		$("label[for=JSON_uploader").text("C_elegans_tree.json");
		// 3D cells file
		cells3D_file = "test_data/C_elegans/C_elegans_3D_cells.csv";
		Upload_example_3Dcells();
		load_dataset_2(cells3D_txt);
		$("label[for='3Dcoord_uploader'").text("C_elegans_3D_cells.csv");
		// metadata
		meta_file = "test_data/C_elegans/C_elegans_cell_types.csv";
		Upload_example_metadata();
		load_dataset_3(metadata_txt);
		}
	if (e == 2) {
		Abs_BL =2;
		tree_file = "test_data/Ciona/Ciona_cell_lineage.nw";
		activate_tree_controls();
		Upload_example_tree();
		var newick = Newick.parse(tree_txt);
		load_dataset_newick(newick);
		$("label[for=JSON_uploader").text("Ciona_cell_lineage.nw");
		// 3D cells file
		cells3D_file = "test_data/Ciona/Ciona_3D_coords.csv";
		Upload_example_3Dcells();
		load_dataset_2(cells3D_txt);
		$("label[for='3Dcoord_uploader'").text("Ciona_3D_coords.csv");
		// Gene expression
		GE_file = "test_data/Ciona/Ciona_GEmatrix_500genes.csv";
		Upload_example_GEmatrix();
		load_dataset_4(GEmatrix_txt);
		// metadata
		meta_file = "test_data/Ciona/Ciona_metadata.csv";
		Upload_example_metadata();
		load_dataset_3(metadata_txt);
		}
	if (e == 3) {
		tree_file = "test_data/Parhyale/Parhyale_tree.nw";
		activate_tree_controls();
		Upload_example_tree();
		var newick = Newick.parse(tree_txt);
		load_dataset_newick(newick);
		$("label[for=JSON_uploader").text("Parhyale_tree.nw");
		// 3D cells file
		cells3D_file = "test_data/Parhyale/Parhyale_3D_cells.csv";
		Upload_example_3Dcells();
		load_dataset_2(cells3D_txt);
		$("label[for='3Dcoord_uploader'").text("Parhyale_3D_cells.csv");
	}
	if (e == 4) {
		activate_tree_controls();
		depth_label = 1;
		// tree file
		tree_file = "test_data/Organoid/organoid_10Kcells_clones.json";
		Upload_example_tree();
		load_dataset_json(tree_txt);
		$("label[for=JSON_uploader").text("organoid_10Kcells_clones.json");
	//	load_dataset_clones(tree_txt);
		// 3D cells file
		cells3D_file = "test_data/Organoid/organoid_10Kcells_3D.csv";
		Upload_example_3Dcells();
		load_dataset_2(cells3D_txt);
		$("label[for='3Dcoord_uploader'").text("organoid_10Kcells_3D.csv");
	}
	console.log(tree_file);

	function Upload_example_tree() {
		// Upload tree file
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
				tree_txt = xmlhttp.responseText;
				}
			};
		// force it to wait for response with false
		xmlhttp.open("GET", tree_file, false);
		xmlhttp.send();
		}

	function Upload_example_3Dcells() {
		// Upload 3D cells  file
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
				cells3D_txt = xmlhttp.responseText;
				}
			};
		// force it to wait for response with false
		xmlhttp.open("GET", cells3D_file, false);
		xmlhttp.send();
		}

	function Upload_example_metadata() {
		// Upload 3D cells  file
	console.log("where iiii am");
	var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
				metadata_txt = xmlhttp.responseText;
				}
			};
		// force it to wait for response with false
		xmlhttp.open("GET", meta_file, false);
		xmlhttp.send();
		}
	function Upload_example_GEmatrix() {
		// Upload gene expression  file
		console.log("where i am");
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
				GEmatrix_txt = xmlhttp.responseText;
				}
			};
		// force it to wait for response with false
		xmlhttp.open("GET", GE_file, false);
		xmlhttp.send();
		}


	}

