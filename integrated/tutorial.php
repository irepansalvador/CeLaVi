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
					<li><a class="tocxref" href="#h-3.1">Modifying cell features</a></li>
				</ol>
			</li>
		</ol>
	</div>

<!-- %%%%%%%%%%%%%% Contents  %%%%%%%%%%%%%%%%%  -->

	<!-- INPUT FILES  -->
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
		click on the "Upload tree" button.
		</p>
		<video width="400" controls>
		<source src="./Videos/Input_files.mp4" type="video/mp4">
		Your browser does not support the video tag.
		</video>
	
	<!-- Interact with cell lineage tree  -->
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

		
	<h2><a name="h-3">3</a> Interacting with the3D cells</h2>
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
	<h3><a name="h-3.1">3.1</a> Modifying cell features</h3>
		<p>
		After loading the 3D cells file, the user can modify the size of the cells
		by using the "3D cell controls" section.
		There are 3 boxes in this section, at the right there is a "Reset cols" 
		clickable button that sets the colour of the cells back to the default
		(light grey).
		The box at the middle serves to change the size of the cells, the size can be
		increased/decreased in a stepwise manner using the buttons on the right of
		box or by directly typing an integer value into the box.
		The box at the left serves to change the stroke width of the cell in the same
		way.
		</p>

	<h3><a name="h-3.1">3.1</a> Rotate/zoom/pan</h3>
		<p>
		
		</p>
		<video width="400" controls>
		<source src="./Videos/click_3D.mp4" type="video/mp4">
		Your browser does not support the video tag.
		</video>

</body>
