<!DOCTYPE html>
<meta charset="utf-8">

<body>
<h1> CeLaVi Tutorial </h1>
<h2> Interactive Cell Lineage Visualisation </h2>
<!--%%%%%%%%%%%%%% Index %%%%%%%%%%%%%%%%%  -->
<div class="subtoc">
	<p><strong>Contents</strong></p>
	<ol>
		<li><a class="tocxref" href="#h-1">Opening Input files</a> 
			<ol>
				<li><a class="tocxref" href="#h-1.1">Cell Lineage Tree file</a></li>
				<li><a class="tocxref" href="#h-1.2">3D coordinates file</a></li>
			</ol>
		</li>
		<li><a class="tocxref" href="#h-2">Interacting with the Lineage Tree</a> 
			<ol>
				<li><a class="tocxref" href="#h-2.1">Collapsing/Expanding daughters of one cell</a></li>
				<li><a class="tocxref" href="#h-2.2">Collapsing/Expanding all descendants of one cell</a></li>
				<li><a class="tocxref" href="#h-2.3">Collapsing/Expanding all cells from a given tree depth</a></li>
			</ol>
		</li>
		<li><a class="tocxref" href="#h-3">Interacting with cells in the 3D viewer</a> 
			<ol>
				<li><a class="tocxref" href="#h-3.1">Rotate/zoom/pan</a></li>
				<li><a class="tocxref" href="#h-3.2">Modifying cell features</a></li>
				<li><a class="tocxref" href="#h-3.3">Highlighting the lineage history of a cell</a></li>
			</ol>
		</li>
		<li><a class="tocxref" href="#h-4">Visualising clones</a> 
			<ol>
				<li><a class="tocxref" href="#h-4.1">Showing a single clone</a></li>
				<li><a class="tocxref" href="#h-4.2">Showing clones from a given tree depth</a></li>
				<li><a class="tocxref" href="#h-4.3">Showing clones from a given time point</a></li>
				<li><a class="tocxref" href="#h-4.4">Saving clones</a></li>
			</ol>
		</li>
	</ol>
</div>

<!-- %%%%%%%%%%%%%% Contents  %%%%%%%%%%%%%%%%%  -->

	<!-- INPUT FILES  -->
<div>
	<h2><a name="h-1">1</a> Opening Input Files</h3>
	
	<h3><a name="h-1.1">1.1</a> Cell Lineage Tree</h3>
		<p>
		To visualise a Cell Lineage in CeLaVi the user needs to upload tree in a
		Newick or Json format.
		The Newick format is the most common way of representing phylogenetic trees 
		using nested parentheses and commas.
		The Json format is a popular text-based format to represent structured data 
		based on JavaScript object syntax. <br>
		To upload a tree file, click in the "Upload tree (select format)" box and upload
		a tree in one of the 2 formats mentioned. Before selecting the tree
		file, specify if the file is in a Newick or Json format. Also, specify if
		the tree file contains "Absolute" or "Relative" branch lengths, or no
		branch lengths at all (to understand the difference between "Relative" and
		"Absolute" see to the "Branch Lengths" section).
		Finally, click on "Submit" to visualise the Cell Lineage Tree.
		</p>
	<h3><a name="h-1.2">1.2</a> 3D coordinates</h3>
		<p>
		The file containing the 3D coordinates of the cells must be in a comma-
		separated-value (csv) format.
		Each subsequent line corresponds to one cell. The columns report the
		cell ID followed by three coordinate values. The first 
		line is a header or descriptor line, which specifies the column’s 
		identity as “cell”, “X”, “Y”, and “Z”.
		</p>
		<p>
		The following video shows how to visualise the cell lineage of the nematode
		<i> Caenorhabditis elegans</i>, which is provided as a test dataset, in
		 either a newick (.nw) or a Json file formats.
		</p>
		<video width="400" controls>
		<source src="./Videos/Input_files.mp4" type="video/mp4">
		Your browser does not support the video tag.
		</video>
</div>

	<!-- Interact with cell lineage tree  -->
<div>
	<h2><a name="h-2">2</a> Interacting with the Lineage tree</h2>
		<p>
		The cells on the lineage tree can be "expanded" or "collapsed", to 
		show or hide their descendants, respectively.
		</p>
		<p>
		Once a cell lineage tree has been uploaded, the user can expand or collapse
		the internal nodes on the tree.
		By default, the tree shows only the 'daughters' or direct descendants of the
		root node.
		If the cell is coloured blue it means it has descendants, but that it is 
		'collapsed', so the daughters are not shown.
		A white coloured cell can be either an 'expanded' internal cell or a
		terminal cell in the lineage tree, i.e. one without any daughters.
		</p>
	<h3><a name="h-2.1">2.1</a> Collapsing/Expanding the daughters of one cell</h3>
		<p>
		Any internal cell in the tree can be in one of two states, "collapsed"
		(hiding its daughters) or "expanded" (showing its daughters).
		As terminal cells in the tree do not have daughters, by definition they
		are in the "expanded" state.
		Clicking on an internal cell in the lineage tree will switch between
		the "collapsed" and "expanded" states.
		</p>

	<h3><a name="h-2.2">2.2</a> Collapsing/Expanding all descendants of one cell</h3>
		<p>
		To expand all the descendants of one cell, it is tedious to click
		repeatedly on the cells to show the daughters, then the 
		grand-daughters, etc.<br>
		In order to expand/collapse all the descendants of a given cell
		we can use the "options menu" that is displayed when right clicking on a
		cell of the Lineage tree.
		To expand all descendants of a (collapsed) cell, select the option
		"Expand descendants" in the menu.
		To collapse all descendants of a (expanded) cell select the 
		option "Collapse all".
		</p>
		<p>
		The following video shows both functions: collapsing/expanding the daughters
		of a cell clicking on a cell in the lineage tree and collapsing/expanding
		all descendants recursively by right clicking and using the menu.
		</p>
		<video width="400" controls>
		<source src="./Videos/Collapse_all.mp4" type="video/mp4">
		Your browser does not support the video tag.
		</video>


	<h3><a name="h-2.3">2.3</a> Collapsing/Expanding all cells from a given tree depths</h3>
		<p>
		This is an option to expand/collapse daughters of many cells at once by using
		the "Tree depth" section below the cell lineage.
		When loading a tree, CeLaVi gets the maximum depth of the tree and
		displays the different depths of the tree as purple circles in the "Tree
		depth" section. <br>
		These circles, as well as showing the number of depth levels, can
		be used to collapse/expand all the cells at a given tree depth, by selecting
		the appropriate function from a menu that is displayed when clicking on any
		of the purple circles.
		After clicking the depth level of interest, the user selects the option
		"Collapse all cells" or "Expand all cells".
		The tree levels are defined in an ascending order, starting with the root
		at level 0, the daughters of the root cell as level 1, and so on. <br>
		NOTE: This option is only available when the tree is not in the "Show
		Branchlength (BL)" mode. For information on this see the section 
		"Branchlength mode"</br>
		In the following video both functions are shown.
		</p>
		</p>
		<video width="400" controls>
		<source src="./Videos/Tree_depth.mp4" type="video/mp4">
		Your browser does not support the video tag.
		</video>
</div>

<!-- Interact with the 3D cells  -->
<div>
	<h2><a name="h-3">3</a> Interacting with cells in the 3D viewer</h2>
		<p>
		The 3D visualisation is implemented using the 3D scatterplot function of
		plotly.js, a visualisation library based on d3.js and stack.gl 
		For more information on the plotly.js visualisation library visit 
		https://plot.ly/javascript/.
		</p>
	<h3><a name="h-3.1">3.1</a> Rotate/zoom/pan</h3>
		<p>
		With a 3D file of cell locations uploaded, the positions of all cells are
		shown on the right hand side in the 3D viewer.
		It is possible to Zoom in/out, rotate and pan the 3D scatterplot by selecting
		the function and dragging the mouse.
		All options are located in a panel at the top right of the 3D viewer area.
		</p>
	<h3><a name="h-3.2">3.2</a> Modifying cell representation</h3>
		<p>
		The user can modify the some of the features of the 3D cells using the
		"3D cell controls" panel, located in the top right of the viewer area.
		There are 3 boxes in this section, at the right there is a "Reset cols" 
		clickable button that resets the colour of the cells to the default
		(light grey).
		The box in the middle allows one to change the size of the cells in a
		stepwise manner using the buttons on the right of
		box or by directly typing an integer value into the box.
		The box on the left serves to change the stroke width of the outline
		of the cell in the same way.
		</p>

	<h3><a name="h-3.3">3.3</a> Highlighting the lineage history of a cell</h3>
		<p>
		An important feature of CeLaVi is the possibility of interactively
		interrogating the data.
		A fundamental function is to highlight the developmental lineage of any
		chosen cell in the 3D visualisation area.
		Clicking on any cell in the 3D visualisation will change its colour to 
		red and its lineage will be highlighted in red in the lineage tree.
		More specifically, the cell that has been clicked and all its ancestors 
		down to the root will be coloured in red. 
		<b>Note: To do this, the lineage tree (or at least the clade of the
		cell to be highlighted) needs to be completely expanded.</b>
		</p>

		<p> The following video, using the <i>Parhyale</i> limb data, shows how to interact 
		with the 3D plot and how to highlight the developmental lineage of a specific
		cell.</p>
		<video width="400" controls>
		<source src="./Videos/click_3D.mp4" type="video/mp4">
		Your browser does not support the video tag.
		</video>
</div>

<!-- Visualising clones  -->
<div>
	<h2><a name="h-4">4</a> Visualising clones</h2>
	<h3><a name="h-4.1">4.1</a> Showing a single clone</h3>
		<p>
		There are two ways to visualise the spatial distribution of all the
		descendants of a given cell in the cell lineage.
		The first is by right clicking on any cell in the Lineage tree
		to display the options menu.
		From the menu select the option "Show descendants". This will mark all the
		descendant cells on the 3D visualisation section by changing their colour 
		(the default option is changing to light blue). With this option we can 
		mark many clones at the same time, as marking a new clone will not reset 
		previously selected clones to the default colour.
		</p>
		<p>
		Another option is to click on the "Show descendants" click box at the bottom.
		This optionautomatically marks clones when passing the mouse cursor over
		any cell in the lineage tree (without clicking).
		In this case, when marking a new clone, the colour of the cells that do not
		belong to that clone will change to default colour (light grey) meaning one
		can only visualise one clone at a time with this function.
		</p>
		<p> The following video shows the both options to highlight a single clone
		in the 3D cell section; how to interact with the 3D plot; and how to 
		highlight the developmental lineage of a specific cell.</p>
		<video width="400" controls>
		<source src="./Videos/single_clones.mp4" type="video/mp4">
		Your browser does not support the video tag.
		</video>
	<h3><a name="h-4.2">4.2</a> Showing clones from a given tree depth</h3>
		<p>
		It is possible to mark all the clones at a given tree depth by interacting
		with the "Tree depth" section below the Lineage Tree.
		In the accompanying video this function is shown using the <i>Parhyale</i> 
		dataset.
		Clicking on the depth level 1 circle we can then select the option
		"Show clones from this depth".
		This marks the spatial distribution of the 20 clones that comprise this
		dataset. We can also use this option to see how a clone gets divided into 
		subclones in the subsequent cell divisions. For this we need to expand only
		the clone(s) we are interested in following, and then select the option 
		"Show clones from this depth" for increasing depths (see video).
		</p>
	<h3><a name="h-4.3">4.3</a> Showing clones arising at a given time point</h3>
		<p>
		When the Cell Lineage file contains branch lengths (BL) information
		essentially timing of divisions), it is also to show all the clones
		produced at a given time point. To do this, first click the button "Show 
		BL" to change the topology of the Lineage tree so that it shows the branch
		lengths. The "Tree depth" section at the bottom of the 
		Lineage Tree will change from showing the tree depths as purple circles 
		to showing an horizontal slider.
		The horizontal slider represents developmental time and can be clicked
		to mark the clones at the point the pointer intersects the Lineage
		tree. To facilitate the visualisation, a vertical dashed line is plotted 
		on top of the Lineage Tree. As when showing the clones at a
		given depth, it is possible to expand only those clones in the lineage tree 
		that the user wants to visualise. 
		</p>
		<p>
		The following video shows how to visualise clones at a given
		tree depth or at a given time point.
		</p>
		<video width="400" controls>
		<source src="./Videos/various_clones.mp4" type="video/mp4">
		Your browser does not support the video tag.
		</video>
	<h3><a name="h-4.4">4.4</a> Saving clones</h3>
		<p>
		If the user is interested in one or several specific clones, it is possible
		to save these to a list that can be used to visualise them later.
		In the Lineage tree we right click on the cell of interest
		and select the option "Save clone". This will save the identifier of this
		cell into a list that can be displayed by clicking on the button "Saved
		clones".
		We can then visualise a saved clone by clicking on any element of
		this list. This will highlight the selected clone by colouring the cells
		within the clone with a randomly chosen colour.
		</p>
		<p>
		The video below shows how to save clones and how to select them from the list
		to display them.
		</p>
		<video width="400" controls>
		<source src="./Videos/save_clones.mp4" type="video/mp4">
		Your browser does not support the video tag.
		</video>
</div>




</body>
