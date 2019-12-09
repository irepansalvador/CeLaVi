<!DOCTYPE html>
<meta charset="utf-8">

<body>
<h1> CeLVi Tutorial </h1>
<!--%%%%%%%%%%%%%% Index %%%%%%%%%%%%%%%%%  -->
<div class="subtoc">
	<p><strong>Contents</strong></p>
	<ol>
		<li><a class="tocxref" href="#h-1">Open Input files</a> 
			<ol>
				<li><a class="tocxref" href="#h-1.1">Cell Lineage Tree</a></li>
				<li><a class="tocxref" href="#h-1.2">3D coordinates</a></li>
			</ol>
		</li>
		<li><a class="tocxref" href="#h-2">Interacting with the Lineage Tree</a> 
			<ol>
				<li><a class="tocxref" href="#h-2.1">Collapse/Expand daughters of one cell</a></li>
				<li><a class="tocxref" href="#h-2.2">Collapse/Expand all descendants of one cell</a></li>
				<li><a class="tocxref" href="#h-2.3">Collapse/Expand all cells from a given tree depths</a></li>
			</ol>
		</li>
		<li><a class="tocxref" href="#h-3">Interacting with the 3D cells </a> 
			<ol>
				<li><a class="tocxref" href="#h-3.1">Rotate/zoom/pan</a></li>
				<li><a class="tocxref" href="#h-3.2">Modifying cell features</a></li>
				<li><a class="tocxref" href="#h-3.3">Highlight the lineage history of a cell</a></li>
			</ol>
		</li>
		<li><a class="tocxref" href="#h-4">Visualising clones</a> 
			<ol>
				<li><a class="tocxref" href="#h-4.1">Show a single clone</a></li>
				<li><a class="tocxref" href="#h-4.2">Show clones from a given tree depth</a></li>
				<li><a class="tocxref" href="#h-4.3">Show clones from a given time point</a></li>
				<li><a class="tocxref" href="#h-4.4">Save clones</a></li>
			</ol>
		</li>
	</ol>
</div>

<!-- %%%%%%%%%%%%%% Contents  %%%%%%%%%%%%%%%%%  -->

	<!-- INPUT FILES  -->
<div>
	<h2><a name="h-1">1</a> Open Input Files</h3>
	
	<h3><a name="h-1.1">1.1</a> Cell Lineage Tree</h3>
		<p>
		To visualise a Cell Lineage in CeLVi the user needs to upload tree in a
		newick or Json format.
		The Newick format is the most common way of representing phylogenetic trees 
		using parentheses and commas.
		The Json format is a popular text-based format to represent structured data 
		based on JavaScript object syntax. <br>
		To upload a tree, click in the "Upload tree (select format)" box and upload
		a tree in one of the 2 formats already mentioned. Before selecting the tree
		file, specify if the file is in a Newick or Json format. Also, specify if
		the tree file contains "Abosolute" or "Relative" branch lengths, or no
		branch lengths at all (for the difference between "Relative" and "Absolute"
		go to the "Branch Lengths" section).
		After this, click on Submit to visualise the Cell Lineage Tree.
		</p>
	<h3><a name="h-1.2">1.2</a> 3D coordinates</h3>
		<p>
		The file containing the 3D coordinates of the cells must be in a comma-
		separated-value (csv) format, where each line corresponds to one cell and
		each column to the cell ID or one of the coordinates’ value. The first 
		line is a header or descriptor line, which specifies the column’s 
		identity as “cell”, “X”, “Y”, and “Z”.
		</p>
		<p>
		The following video shows how to visualise the cell lineage of the nematode C.
		elegans, provided as a test dataset, opening a newick (.nw) file.
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
		The cells on the Lineage tree can be "expanded" or "collapsed", to 
		show or hide their descendants, respectively.
		</p>
		<p>
		Once a cell lineage tree has been uploaded the user can expand or collapse
		the internal nodes on the tree.
		By default the tree shows only the 'daughters' or direct descendants of the
		root node. The colour of a cell in the lineage tree serves for quickly 
		identifying if such cell has descendants or not. If the cell is blue coloured
		it means it has descendants but it is 'collapsed', so the daughters are not 
		shown. A white coloured cell can be wether an 'expanded' internal cell or a
		terminal cell in the lineage tree, i.e. without any daughters.
		</p>
	<h3><a name="h-2.1">2.1</a> Collapse/Expand the daughters of one cell</h3>
		<p>
		Any internal cell in the tree can be in one of two states, "collapsed"
		(hiding its daughters) or "expanded" (showing its daughters).
		As terminal cells in the tree do not have daughters by definition
		can only be in the "expanded" state.
		Clicking on an internal cell in the lineage tree will switch between
		the "collapsed" and "expanded" states.
		</p>

	<h3><a name="h-2.2">2.2</a> Collapse/Expand all descendants of one cell</h3>
		<p>
		If one wants to expand all the descendants of one cell it becomes tedious
		to recursively click on the cells to show the daughters, then the 
		grand-daughters, etc.<br>
		In order to expand/collapse recursively all the descendants of a given cell
		we can use the "options menu" that is displayed when right clicking on a
		cell of the Lineage tree.
		To recursively expand all descendants of a (collapsed) cell select the option
		"Expand descendants" in the menu.
		To recursively collapse all descendants of a (expanded) cell select the 
		option "Collapse all".
		</p>

		<p>
		The following video shows both functions: collapsing/expanding the daughters
		of a cell clicking on a cell in the lineage tree, and collapsing/expanding
		all descendants recursively by using the menu.
		</p>
		<video width="400" controls>
		<source src="./Videos/Collapse_all.mp4" type="video/mp4">
		Your browser does not support the video tag.
		</video>


	<h3><a name="h-2.3">2.3</a> Collapse/Expand all cells from a given tree depths</h3>
		<p>
		This is an option to expand/collapse daughters of many cells at once by using
		the "Tree depth" section at the bottom of the cell lineage.
		When loading a tree, CeLVi gets the maximum depth of the tree and
		displays the different depths of the tree in the "Tree depth" section as
		purple circles. <br>
		This circles, apart from being informative of the number of depth levels, can
		be used to collapse/expand all the cells at a given tree depth, by selecting
		the appropriate function from a menu that is displayed when clicking on any
		of the purple circles.
		After clicking the depth level of interest, select the option
		"Collapse all cells" or "Expand all cells".
		The tree levels are defined in a descending level, starting with the root
		at level 0, the daughters of the root cell as level 1, and so on. <br>
		NOTE: This option is only available when the tree is not on the "Show
		Branchlengt (BL)" mode. For information on this see the section 
		"Branchlenght mode"</br>
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
	<h2><a name="h-3">3</a> Interacting with the 3D cells</h2>
		<p>
		The 3D visualisation is implemented using the 3D scatterplot function of
		plotly.js, a visualisation library based on d3.js and stack.gl 
		For more information on the plotly.js visualisation library visit 
		https://plot.ly/javascript/.
		</p>
	<h3><a name="h-3.1">3.1</a> Rotate/zoom/pan</h3>
		<p>
		As part of the defaults features provided by the plotly.js library,
		it is possible Zoom in/out, rotate and
		pan the 3D scatterplot. All these options are located in a panel at the 
		top right of the 3D plotting area.
		</p>
	<h3><a name="h-3.2">3.2</a> Modifying cell features</h3>
		<p>
		The user can modify the some of the features of the 3D cells using the
		"3D cell controls" section.
		There are 3 boxes in this section, at the right there is a "Reset cols" 
		clickable button that sets the colour of the cells back to the default
		(light grey).
		The box at the middle serves to change the size of the cells, the size can be
		increased/decreased in a stepwise manner using the buttons on the right of
		box or by directly typing an integer value into the box.
		The box at the left serves to change the stroke width of the cell in the same
		way.
		</p>

	<h3><a name="h-3.3">3.3</a> Highlight the lineage history of a cell</h3>
		<p>
		An important feature of CeLVi is the possibility to interactively
		interrogate the data.
		A basic feature is to highlight the developmental lineage of any specific
		cell that is shown in the 3D plot area.
		Clicking on any 3D cell will change its colour to red and its lineage will
		be also highlighted in red in the Lineage tree. More specifically, the cell 
		that has been clicked and all its ancestors up to the root will be 
		coloured in red. 
		<b>Note: To do this, the Lineage tree needs to be completely expanded (or at least
		the clade of the cell to be highlighted).</b>
		</p>

		<p> The following video shows, using the Parhyale limb data, how to interact 
		with the 3D plot and how to highlight the developmental lineage of a specific
		cell</p>
		<video width="400" controls>
		<source src="./Videos/click_3D.mp4" type="video/mp4">
		Your browser does not support the video tag.
		</video>
</div>

<!-- Visualising clones  -->
<div>
	<h2><a name="h-4">4</a> Visualising clones</h2>
	<h3><a name="h-4.1">4.1</a> Show a single clone</h3>
		<p>
		There are two ways to visualise the spatial distribution of all the
		descendants of a given cell in the cell lineage.
		The first one is by right clicking on any cell in the Lineage tree
		to display the options menu.
		From the menu select the option "Show descendants". This will mark all the
		descendant cells on the 3D cell section by changing their colour (the default
		option is changing to light blue).With this option we can mark many clones 
		at the same time, as marking a new clone will not reset the default colour of
		the rest of the cells.
		</p>
		<p>
		Another option is to click on the "Show descendants" click box at the bottom.
		This option mark clones automatically when passing the mouse cursor on top
		of any cell in the Lineage tree (without clicking).
		In this case, when marking a new clone, the colour of the cells that do not
		belong to that clone will change to default colour (light grey) so is not
		possible to visualise more than one clone with this function.
		</p>
		<p> The following video shows the both options to highlight a single clone
		in the 3D cell section how to interact 
		with the 3D plot and how to highlight the developmental lineage of a specific
		cell</p>
		<video width="400" controls>
		<source src="./Videos/single_clones.mp4" type="video/mp4">
		Your browser does not support the video tag.
		</video>
	<h3><a name="h-4.2">4.2</a> Show clones from a given tree depth</h3>
		<p>
		It is possible to mark all the clones at a given tree depth by using the
		"Tree depth" section at the bottom of the Lineage Tree.
		In the video below it is shown using the Parhyale dataset. Clicking on the
		level depth 1 circle we can then select the option "Show clones from this
		depth". This marks the spatial distribution of the 20 clones that make this
		dataset. We can also use this option to see how a clone gets divided in 
		subclones in the subsequent cell divisions. For this we beed to expand only
		the clon(es) we are interested to follow and then select the "Show clones
		from this depth" for increasing depths (see video below).
		</p>
	<h3><a name="h-4.3">4.3</a> Show clones from a given time point</h3>
		<p>
		In case the Cell Lineage file contains branchlenghts (BL) information, it is
		also possible to show all the clones produced from a given time point.
		First, click the button "Show BL" to change the topology of the Lineage tree
		to show the branch lenghts. The "Tree depth" section at the bottom of the 
		Lineage Tree will change from showing the tree depths as prurple circles 
		to show a horizontal slider.
		The horizontal slider represents developmental time, and can be clicked
		to mark the clones at the point the pointer intersect the Lineage
		tree. To facilitate the visualisation, a vertical dashed line is plotted 
		on top of the Lineage Tree. As the same as when showing the clones at a
		given depth, it is possible to expand only the clones in the lineage tree 
		that want to be visualised. 
		</p>
		<p>
		In the following video it can be seen how to show clones at a given
		tree depth and also at given time point.
		</p>
		<video width="400" controls>
		<source src="./Videos/various_clones.mp4" type="video/mp4">
		Your browser does not support the video tag.
		</video>
	<h3><a name="h-4.4">4.4</a> Save clones</h3>
		<p>
		If the user is interested in one or some specific clones, it is possible
		to save them to a list that can be used to visualise later.
		To do this, in the Lineage tree we right click in the cell of interest
		and select the option "Save clone". This will save the identifier of this
		cell into a list that can be displayed by clicking in the button "Saved
		clones".
		Then we can visualise a saved clone by clicking on any element of
		the list. This will show the selected clone by colouring the cells with a
		random generated colour.
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
