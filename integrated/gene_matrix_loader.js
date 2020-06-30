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
}
