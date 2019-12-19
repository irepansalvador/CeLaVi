console.log("here I am");

var tree_txt = "";
var cells3D_txt = "";
var metadata_txt = "";


function Examples(e)
	{
	// Remove the slider if exists
	d3.select("#slider").selectAll("input").remove();
	d3.select("#slider").selectAll("svg").remove();
	// remove the previous line
	d3.select("#area1").select("svg").select("g").selectAll("*").remove();
	d3.select("#area1").select("div").remove();
	// remove metadata table
	d3.select("#metadata_table").remove();


	console.log(e);
	var tree_file;
	var cells3D_file;
	var meta_file;
	// Select the options depending on the example chosen
	if (e == 1) {
		Abs_BL = 0;
		document.getElementById("Json_TREE").checked = "true";
		document.getElementById("Rel_BL").checked = "true";
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
		Abs_BL = 1;
		document.getElementById("Newick_TREE").checked = "true";
		document.getElementById("Abs_BL").checked = "true";
		tree_file = "test_data/Parhyale/Parhyale_tree.nw";
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
	if (e == 3) {
		document.getElementById("Json_CLONES").checked = "true";
		document.getElementById("No_BL").checked = "true";
		// 3D cells file
		cells3D_file = "test_data/Organoid/organoid_15Kcells_3D.csv";
		Upload_example_3Dcells();
		load_dataset_2(cells3D_txt);
		$("label[for='3Dcoord_uploader'").text("organoid_15Kcells_3D.csv");
		// tree file
		tree_file = "test_data/Organoid/organoid_15Kcells_clones.json";
		Upload_example_tree();
		load_dataset_clones(tree_txt);
		$("label[for=JSON_uploader").text("organoid_15Kcells_clones.json");
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

	}

