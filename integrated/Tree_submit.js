$(document).ready(function () 
	{ 
	$("#Json_TREE").click(function()
		{console.log("you clicked json, restart file");
		$("input[name=TREE_FILE]").val("");
		});
	});
$(document).ready(function () 
	{ 
	$("#Newick_TREE").click(function()
		{console.log("you clicked Newick, restart file");
		$("input[name=TREE_FILE]").val("");
		});
	});
$(document).ready(function ()
	{ 
	$("#Json_CLONES").click(function()
		{console.log("you clicked clones, restart file");
		$("input[name=TREE_FILE]").val("");
		});
	});
$(document).ready(function ()
	{ 
	$("#Rel_BL").click(function()
		{console.log("you clicked for Relative Branch lenghts");
		//set_bl();
				//		Abs_BL = 0;
//		update(root);
		});
	});
$(document).ready(function ()
	{ 
	$("#Abs_BL").click(function()
		{console.log("you clicked for Absolute Branch lenghts");
		//set_bl();
//		Abs_BL = 1;
//		update(root);
		});
	});

function HideINPUT()
	{
	var x = document.getElementById("input_submit");
  if (x.style.display === "none") {
	    x.style.display = "block";
	 } else {
	    x.style.display = "none";
	  }
	}

function Submit_Function() 
	{
	// Remove the slider if exists
	d3.select("#slider").selectAll("input").remove();
	d3.select("#slider").selectAll("svg").remove();
	// remove the previous line
	d3.select("#area1").select("svg").selectAll("line").remove();

	// Get the format of the file
	console.log("SUBMITTED!!!");
	var uploader = document.getElementById("JSON_uploader"); 
	console.log(uploader);

	//Get the Branch length option
	var BL_option = $("input[name='Abs_Rel']:checked").val(); 
	if (BL_option == "abs") {Abs_BL = 1;}
	if (BL_option == "rel") {Abs_BL = 0;}
	if (BL_option == "no") {Abs_BL = 2;}

	//Create a reader function depending on the format of the tree
	var json_reader = new FileReader();
	json_reader.onload = function(e) {
		var contents = e.target.result;
		load_dataset_json(contents);
	};
	var newick_reader = new FileReader();
	newick_reader.onload = function(e) {
		var contents = e.target.result;
		var newick = Newick.parse(contents);
		load_dataset_newick(newick);
	};
	var clones_reader = new FileReader();
	clones_reader.onload = function(e) {
		var contents = e.target.result;
		load_dataset_clones(contents);
	};

	// function to call the reader 
	function handleFiles() {
		var tree_format = $("input[name='Tree_INPUT']:checked").val();
		console.log(tree_format);
		if (tree_format=="json")
			{
			//d3.select("#area2").text("loading...");
			var file = uploader.files[0];
			json_reader.readAsText(file);
			console.log(file);
			}
		if (tree_format=="newick")
			{
			//d3.select("#area2").text("loading...");
			var file = uploader.files[0];
			newick_reader.readAsText(file);
			console.log(file);
			}
		if (tree_format=="clones")
			{
			//d3.select("#area2").text("loading...");
			var file = uploader.files[0];
			clones_reader.readAsText(file);
			console.log(file);
			}
		};

	// HERE I CALL THE READER FUNCTION
	handleFiles();
	};

