// Config value for parsing CSV
var GE_csv_config={header: true,
	skipEmptyLines: true,
	complete: function(results, file) {
		console.log("Parsing complete:", results, file);
		}
	}

// handle upload button
function GeneExp_upload_button(el, callback) {
  var uploader = document.getElementById(el);  
  var reader = new FileReader();
  console.log(uploader);

  reader.onload = function(e) {
		var contents = e.target.result;
		var parse_results = Papa.parse(contents, GE_csv_config);
		GE_header = parse_results.meta.fields;
		// check if the header has the columns with proper names.
		// if not, throw an error
		if (containsAll(["gene"],GE_header))
			{console.log("column \"gene\" found");
			// IF COLUMNS FOUND, PROCEED READING THE FILE
			} else {
			console.log("column \"gene\" not found");
			// IF COLUMS ARE NOT FOUND THROW AN ERROR
			alert("[CSV format error]\n" +
				"1 column needs to be \"gene\".");
			}
		if (typeof root == 'undefined' || typeof ID_array == 'undefined' ) {
		alert("[Warning]\n"+
					"The lineage tree and/or coordinates files have not been loaded.\n"+
					"The lineage and 3D cells need to be loadad to cross-check IDs.");
					$("input[name=Metadata_File]").val("") // reset value of uploader
		} else {
		// --- test if cell IDs are in the lineage tree //
		//console.log(id_t);
		//var GE_cells=[]; // var to store the cell IDs from the cell type file
		// read the file to find the names and cross check
		var data_tmp = d3.csvParse(contents);
		console.log(data_tmp);
		// define the list of genes
		GE_genes = data_tmp.map(a => a.gene);
		console.log(GE_cells);
		//define the names of cells
		GE_cells = GE_header;
		var index = GE_cells.indexOf("gene");
		if (index > -1) {
			GE_cells.splice(index, 1);
			console.log(GE_cells);
			}
		count_leaves2(root,0);
		reset_cell_cols();
		if (containsAll(GE_cells,sel_ids))
			{console.log("all cell IDs found");
			} else { 
			alert(no_there.length + " of " + table_cells.length + 
					" cell IDs were not found in the lineage tree\n"+
					"(e.g. \"" + no_there[1] + "\")");
					$("input[name=GeneExp_File]").val("") // reset value of uploader
			}
		callback(contents);
		// Display the menu for searching genes
		autocomplete(document.getElementById("GeneInput"), GE_genes);
		var x = document.getElementById("GOI_submit");
		x.style.display = "block";
		}
//var data_tmp = d3.csvParse(contents);
//	console.log(data_tmp);
//	callback(contents);
		
	};

  uploader.addEventListener("change", handleFiles, false);  

  function handleFiles() {
    //d3.select("#area2").text("loading...");
    var file = this.files[0];
    reader.readAsText(file);
    console.log(file)      
  };
};
var data_GE;
var GE_header;
var GE_cells;
var GE_genes;
// load dataset and create table 
function load_dataset_4(csv) {
	data_GE = d3.csvParse(csv);
	console.log(data_GE);
	data_GE = data_GE.map(item => { Object.keys(item).forEach(k => item[k] = isNaN(item[k])? item[k] : Number(item[k]));
  return item; })
}

function Submit_GOI() 
	{
	console.log("Submit gene here");
	y = document.getElementById("GeneInput");
	console.log(y.value);
	// get the index of the gene of interest
	var goi = GE_genes.indexOf(y.value);
	// get the object with all GE values
	goi = data_GE[goi];
	// remove key "gene" to perform calculations with numbers
	delete goi["gene"];
	// get max value (will be useful for making dynamic heatmap scale
	var goi_max = Math.max(...Object.values(goi));
	console.log(goi);
	console.log(goi_max);
	}
function Add_gene_menu()
	{
	var gene_svg = d3.select("#GOI_submit")
		.classed("svg-container-slider", true) //container class to make it responsive
		.append("svg")
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 100 4")
		.classed("svg-content-responsive", true)
		.append("g");
	}

function autocomplete(inp, arr) {
	 /*the autocomplete function takes two arguments,
		*   the text field element and an array of possible
		*   autocompleted values:*/
	var currentFocus;
	/*execute a function when someone writes in the text field:*/
	inp.addEventListener("input", function(e) {
		var a, b, i, val = this.value;
		/*close any already open lists of
		* autocompleted values*/
		closeAllLists();
		if (!val) { return false;}
		currentFocus = -1;
		/*create a DIV element that will contain the items (values):*/
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		/*append the DIV element as a child of the autocomplete container:*/
		this.parentNode.appendChild(a);
		/*for each item in the array...*/
		for (i = 0; i < arr.length; i++) {
			/*check if the item starts with the same letters as the text field value:*/
			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				/*create a DIV element for each matching element:*/
				b = document.createElement("DIV");
				/*make the matching letters bold:*/
				b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
				b.innerHTML += arr[i].substr(val.length);
				/*insert a  input field that will hold the current
				 array item's value:*/
				b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
				/*execute a function when someone clicks on the item value
				(DIV element):*/
				b.addEventListener("click", function(e) {
					/*insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName("input")[0].value;
					/*close the list of autocompleted values, (or
					any other open lists of autocompleted values:*/
					closeAllLists();
				});
			a.appendChild(b);
			}
		}
	});
	/*execute a function presses a key on the keyboard:*/
	inp.addEventListener("keydown", function(e) {
	var x = document.getElementById(this.id + "autocomplete-list");
	if (x) x = x.getElementsByTagName("div");
	if (e.keyCode == 40) {
		/*If the arrow DOWN key is pressed, increase the currentFocus variable:*/
		currentFocus++;
		/*and and make the current item more visible:*/
		addActive(x);
		} else if (e.keyCode == 38) { //up
		/*If the arrow UP key is pressed, decrease the currentFocus variable:*/
		currentFocus--;
		/*and make the current item more visible:*/
		addActive(x);
		} else if (e.keyCode == 13) {
		/*If the ENTER key is pressed,prevent the form being submitted,*/
		e.preventDefault();
		if (currentFocus > -1) {
			/*and simulate a click on the "active" item:*/
			if (x) x[currentFocus].click();
			}
		}
	});
	function addActive(x) {
		/*a function to classify an item as "active":*/
		if (!x) return false;
		/*start by removing the "active" class on all items:*/
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (x.length - 1);
		/*add class "autocomplete-active":*/
		x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
		/*a function to remove the "active" class from all autocomplete items:*/
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(elmnt) {
		/*close all autocomplete lists in the document, except the one passed as an argument:*/
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	/*execute a function when someone clicks in the document:*/
	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
} 
