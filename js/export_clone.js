
function export_clone_json(d) 
	{
	
	console.log(d); //root contains everything you need
	
	
	var myRoot = JSON.stringify(d, getCircularReplacer(false)); //Stringify a first time to clone the root object (it's allow you to delete properties you don't want to save)
	var myvar= JSON.parse(myRoot);
	myvar= JSON.stringify(myvar, getCircularReplacer(true)); //Stringify a second time to delete the propeties you don't need
	
	console.log(myvar); //You have your json in myvar
	
	function download(content, fileName, contentType) {
		var a = document.createElement("a");
		var file = new Blob([content], {
			type: contentType
			});
		a.href = URL.createObjectURL(file);
		a.download = fileName;
		a.click();
		}
	var myclonejson = d.data.did + '.json';
	download(myvar, myclonejson, 'text/plain');
	}

const getCircularReplacer = (deletePorperties) => { //func that allows a circular json to be stringified
	const seen = new WeakSet();
	return (key, value) => {
		if (typeof value === "object" && value !== null) {
			if(deletePorperties){
			//	delete value.id; //delete all properties you don't want in your json (temporary solutio
				delete value.x0;
				delete value.y0;
				delete value.y;
				delete value.x;
				delete value.depth;
				delete value.size;
				delete value.pos;
				delete value.leaf;
				delete value.height;
				delete value.node;
				delete value.blength;
				delete value.data;
				delete value.parent;
				}
			if (seen.has(value)) {
				return;
				}
			seen.add(value);
			}
		return value;
		};
	};

