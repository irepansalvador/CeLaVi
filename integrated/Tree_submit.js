var fileTypes = ['nw', 'newick', 'json'];  //acceptable file types
var tree_format;
var Abs_BL;
//var Abs_Rel = "no";

var treefile = document.getElementById('JSON_uploader');
start_files();
// disable tree options if tree is not loaded yet
document.getElementById("zoom_in_tree").disabled = true;
document.getElementById("zoom_out_tree").disabled = true;
document.getElementById("pan_down_tree").disabled = true;
document.getElementById("pan_up_tree").disabled = true;
document.getElementById("BranchLenghts").disabled = true;
document.getElementById("Reset").disabled = true;

// disable 3d options if cells are not loaded 
document.getElementById("reset").disabled = true;
document.getElementById("CellSize").disabled = true;
document.getElementById("CellStroke").disabled = true;
document.getElementById("Cells_checkbox").disabled = true;

function activate_tree_controls() {
	var selectobject = document.getElementById("saved_clones");
		for (var i=selectobject.length-1; i>0; i--) {
			if (selectobject[i].value !== 'Saved clones')
				{selectobject[i].remove(i);}
		}
	d3.select("#area1").select("h6").text("");
	d3.select('.status').remove();
		//ENABLE  tree options if tree is loaded yet
//	var tree_format = $("input[name='Tree_INPUT']:checked").val();
	if (tree_format=="json" || "newick")
		{
		document.getElementById("zoom_in_tree").disabled = false;
		document.getElementById("zoom_out_tree").disabled = false;
		document.getElementById("pan_down_tree").disabled = false;
		document.getElementById("pan_up_tree").disabled = false;
		document.getElementById("Reset").disabled = false;
		// disable 3d options if cells are not loaded 
		document.getElementById("reset").disabled = true;
		document.getElementById("CellSize").disabled = true;
		document.getElementById("CellStroke").disabled = true;
		document.getElementById("Cells_checkbox").disabled = true;
	if (Abs_BL < 2) {
			document.getElementById("BranchLenghts").disabled = false;
			}
		if (Abs_BL == 2) {
		document.getElementById("BranchLenghts").disabled = true;
			}
		}
	}

function start_files() {
		zoom_reset();

	document.getElementById('JSON_uploader').value = '';
	document.getElementById("3Dcoord_uploader").value = "";
	document.getElementById("3Dcoord_uploader").nextElementSibling.textContent = "Input coordinates file";
	// remove button to hide/table
//	var x = document.getElementById("Hide_metadata");
//	if (x.style.display === "block") {x.style.display = "none";}
	d3.select("#HM_scale").selectAll("svg").remove();
	d3.select("#HM_scale").attr("title", "");
	d3.select("#HM_scale").select("h5").text("");
	if (document.getElementById("Cells_checkbox").checked == true)
		{document.getElementById("Cells_checkbox").click()}
	// make he div.tooltip invisible (that shows number of descendants,
	// etc)
	div.style("opacity", 0)
		.text('');
}

treefile.addEventListener('change', showtreeopts);
function showtreeopts() 
	{console.log("lets see");
	var tmpname = treefile.files[0].name;
	document.getElementById("JSON_uploader").nextElementSibling.textContent = tmpname;
	// get the file extension
	var extension = treefile.files[0].name.split('.').pop().toLowerCase(),
		isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types
	if (isSuccess) {
		if (extension == "json") {
			tree_format = "json"
			Submit_Function(tree_format);
			}
		else if (extension == "nw" || extension == "newick") 
			{
			tree_format = "newick";
			Submit_Function(tree_format);
			}
		console.log("file has correct extension "  + extension)
		}
	else {showAlert("[Error] File does not have any of the accepted extensions " +
				"(i.e. \".nw\", \".newick\", \".json\")");
				console.log("file has not correct extension")}
	}

function Submit_Function(tree_format) 
	{
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
	// remove 3d plot if exists 
	ID_array=undefined; points_array= undefined;
	if (data.length>0)
		{data[0].x = data[0].y = data[0].z = data[0].id = data[0].text = [];
		data[1].x = data[1].y = data[1].z = data[1].id = data[1].text = [];
		Plotly.newPlot(area2, data, layout)};
	// remove any svg on the scale div
	d3.select("#HM_scale").selectAll("svg").remove();
	// Hide the menu for searching gene
	GE_genes=[]; data_GE=[]; 
	autocomplete(document.getElementById("GeneInput"), GE_genes);
	var x = document.getElementById("GOI_submit");
	x.style.display = "none";
	d3.select("#HM_scale").select("h5").text("");

	// Get the format of the file
	console.log("SUBMITTED!!!");
	var uploader = document.getElementById("JSON_uploader"); 
	console.log(uploader);

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
	// function to call the reader 
	function handleFiles() {
//		var tree_format = $("input[name='Tree_INPUT']:checked").val();
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
			activate_tree_controls();
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
							showAlert(php_script_response); // display response from the PHP script, if any
							}
						});
			//-----------------------------------
			} catch (e) { alert(e);
			alert("Error loading file\nHave you selected a file already?")
			}
			console.log(file);
			activate_tree_controls();
		}
	};

	// HERE I CALL THE READER FUNCTION
	handleFiles();
	// print the name of the file on the box
	var str = $("input[name=TREE_FILE]").val()
	var res = str.split("\\");
	$("label[for=JSON_uploader").text(res[res.length-1]);
	// restart files
	start_files();
	};

// FUNCTIONS TO CHECK FILE FORMATS
function IsJsonString(str) {
	// define function to print error
	var printError = function(error, explicit) {
		alert(`[${explicit ? 'JSON format error. Make sure the file selected is in JSON format' : 
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

var input_show = true;
// function to minimise/maximise
$(document).ready(function(){
	$('#HideINPUT').click(function() {
		if (input_show) {
			$("#HideINPUT").text('SHOW Input Options');
			input_show = false;
			$(".input_cont").slideToggle();
		}else {
			$("#HideINPUT").text('HIDE Input Options');
			input_show = true;
			$(".input_cont").slideToggle()
			}
		})
	});

