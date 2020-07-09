$(document).ready(function () 
	{ 
	$("#Json_TREE").click(function()
		{console.log("you clicked json, restart file");
//		$("input[name=TREE_FILE]").val("");
		});
	});
$(document).ready(function () 
	{ 
	$("#Newick_TREE").click(function()
		{console.log("you clicked Newick, restart file");
//		$("input[name=TREE_FILE]").val("");
		});
	});
$(document).ready(function ()
	{ 
	$("#Json_CLONES").click(function()
		{console.log("you clicked clones, restart file");
//		$("input[name=TREE_FILE]").val("");
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
function HideMETADATA()
	{
	var x = document.getElementById("metadata_table");
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
		// check if the format is correct
		IsJsonString(contents);
		// --------------------
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
			try {json_reader.readAsText(file);
				} catch (e) {
				alert("Error loading file\nHave you selected a file already?")
				}
			console.log(file);
			}
		if (tree_format=="newick")
			{
			//d3.select("#area2").text("loading...");
			var file = uploader.files[0];
			try {newick_reader.readAsText(file);
					console.log("file selected");
					// test newick ----------------------
					var form_data = new FormData();                  
					form_data.append('file', file);
					//alert(form_data);                             
					$.ajax({
						url: 'upload.php', // point to server-side PHP script 
						dataType: 'text',  // what to expect back from the PHP script, if anything
						cache: false,
						contentType: false,
						processData: false,
						data: form_data,                         
						type: 'post',
						success: function(php_script_response){
							alert(php_script_response); // display response from the PHP script, if any
							}
						});
			//-----------------------------------
			} catch (e) { alert(e);
			alert("Error loading file\nHave you selected a file already?")
			}
			console.log(file);
			}
		if (tree_format=="clones")
			{
			//d3.select("#area2").text("loading...");
			var file = uploader.files[0];
			try{clones_reader.readAsText(file);
				} catch (e) {
				alert("Error loading file\nHave you selected a file already?")
				}
			console.log(file);
			}
		};

	// HERE I CALL THE READER FUNCTION
	handleFiles();
	// print the name of the file on the box
	var str = $("input[name=TREE_FILE]").val()
	var res = str.split("\\");
	$("label[for=JSON_uploader").text(res[res.length-1]);
	};

// FUNCTIONS TO CHECK FILE FORMATS
function IsJsonString(str) {
	// define function to print error
	var printError = function(error, explicit) {
		alert(`[${explicit ? 'JSON format error' : 
				'INEXPLICIT'}] ${error.name}: ${error.message}`);
		};
	try {JSON.parse(str); 
		} catch (e) {
		if (e instanceof SyntaxError) {
			printError(e, true);
			} else {
			printError(e, false);
			}
		}
	}
