//Store width, height and margin in variables
//var w = 1200;
//var h = 1100;
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var treemap = d3.treemap();


var margin = {top: 15, right: 15, bottom:5, left: 30};

var svg_tree = d3.select("#area1")
    .classed("svg-container-inbox", true) //container class to make it responsive
    .append("svg")
    //class to make it responsive
    //responsive SVG needs these 2 attributes and no width and height attr
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 600 500")
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")");

/*-- append svg to body
var svg_tree = d3.select("#area1").append("svg")
    .attr("width", w)
    .attr("height", h+100)
  //  .attr("id", "treeG")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
---*/

var w = d3.select("#area1").selectAll("svg")
      // get the width of div element
      .style('width')
      // take of 'px'
      .slice(0, -2);
var h = d3.select("#area1").selectAll("svg")
      // get the width of div element
      .style('height')
      // take of 'px'
      .slice(0, -2);


// Scale the width and height
var xScale = d3.scale.linear()
                .range([0,w - margin.right - margin.left]);

var yScale = d3.scale.ordinal()
                .rangeRoundBands([margin.top, h - margin.bottom],0.2);

// Creat Axes i.e. xAxis and yAxis
var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom");

var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left");

var depths;

// --- Show menu with custom functions in right click

var double_element = [];

var menu = [
	{
	title: 'Show/Expand descendants',
    action: function(d, i) {
	//	console.log('The data for this circle is: ' + d.data.did);
        expand(d)  
        div.transition()		
            .duration(0)		
            .style("opacity", .9)
            .text(count_leaves2(d)+' daughters')
            .style("left", (d3.event.pageX + 10 ) + "px")	
            .style("top", (d3.event.pageY - 28) + "px");
        update(d)      
        }
	},
	{
	title: 'Collapse all',
    action: function(d, i) {
        collapse(d)
        update(d)
        }
	},
    {
	title: 'Find common ancestor',
    action: function(d, i) {
        if (double_element.length == 0){
       //     console.log('The data for this circle is: ' + d.data.did);
            yy = d.data.did.toUpperCase()
            common_anc1("#"+yy)
            div.transition()		
                .duration(0)		
                .style("opacity", .9)
                .text('R-Click on another cell')
                .style("left", (d3.event.pageX + 30 ) + "px")	
                .style("top", (d3.event.pageY - 80) + "px")
            } 
        else 
            {
             yy = d.data.did.toUpperCase()
            common_anc2("#"+yy)
//            console.log('Second circle is: ' + yy);
            double_element = [];
            }
        }
    }
];

//###################################################################################
//#############         JSON OPTION                                ##################
//###################################################################################
/*
d3.json("json-celllineage_DEATH.js", function(error, p0) {
    if (error) throw error;
    root = d3.hierarchy(p0, function(d) 
        { return d.children; });
    root.x0 = h / 2;
    root.y0 = 0;

    // shows only the root children 
    //expand(root); 
    //root.children.forEach(expand);
    update(root);
    
    // get all the heights
    get_height();
    my_slider();
    MAKE_HMscale();
   
    //console.log(depths);
    // collapse all   
//    root.children.forEach(collapse);
//    update(root);
});

*/

var newick = Newick.parse("((((((((((ABALAAAALAL:142,ABALAAAALAR:142)ABALAAAALA:142,(ABALAAAALPA:127,ABALAAAALPP:127)ABALAAAALP:142)ABALAAAAL:100,((ABALAAAARLA:114,ABALAAAARLP:114)ABALAAAARL:142,(ABALAAAARRA:114,ABALAAAARRP:114)ABALAAAARR:142)ABALAAAAR:100)ABALAAAA:53,(((ABALAAAPALL:114,ABALAAAPALR:114)ABALAAAPAL:104,(ABALAAAPARL:133,ABALAAAPARR:133)ABALAAAPAR:104)ABALAAAPA:91,((ABALAAAPPLL:133,ABALAAAPPLR:133)ABALAAAPPL:104,(ABALAAAPPRL:114,ABALAAAPPRR:114)ABALAAAPPR:104)ABALAAAPP:91)ABALAAAP:53)ABALAAA:49,((((ABALAAPAAAL:161,ABALAAPAAAR:161)ABALAAPAAA:123,(ABALAAPAAPA:146,ABALAAPAAPP:146)ABALAAPAAP:123)ABALAAPAA:98,(ABALAAPAPA:123,(ABALAAPAPPA:104,ABALAAPAPPP:104)ABALAAPAPP:123)ABALAAPAP:98)ABALAAPA:55,((ABALAAPPAA:133,(ABALAAPPAPA:104,ABALAAPPAPP:104)ABALAAPPAP:133)ABALAAPPA:89,((ABALAAPPPAA:171,ABALAAPPPAP:171)ABALAAPPPA:95,((ABALAAPPPPAA:228,ABALAAPPPPAP:228)ABALAAPPPPA:133,ABALAAPPPPP:133)ABALAAPPPP:95)ABALAAPPP:89)ABALAAPP:55)ABALAAP:49)ABALAA:34,(((((ABALAPAAAAA:228,ABALAPAAAAP:228)ABALAPAAAA:85,(ABALAPAAAPA:142,ABALAPAAAPP:142)ABALAPAAAP:85)ABALAPAAA:95,((ABALAPAAPAA:193,ABALAPAAPAP:193)ABALAPAAPA:85,((ABALAPAAPPAA:212,ABALAPAAPPAP:212)ABALAPAAPPA:133,ABALAPAAPPP:133)ABALAPAAPP:85)ABALAPAAP:95)ABALAPAA:53,((ABALAPAPAA:104,((ABALAPAPAPAA:218,ABALAPAPAPAP:218)ABALAPAPAPA:133,ABALAPAPAPP:133)ABALAPAPAP:104)ABALAPAPA:76,(((ABALAPAPPAAA:209,ABALAPAPPAAP:209)ABALAPAPPAA:133,ABALAPAPPAP:133)ABALAPAPPA:95,(ABALAPAPPPA:152,ABALAPAPPPP:152)ABALAPAPPP:95)ABALAPAPP:76)ABALAPAP:53)ABALAPA:45,(((ABALAPPAAA:133,(ABALAPPAAPA:190,ABALAPPAAPP:190)ABALAPPAAP:133)ABALAPPAA:93,((ABALAPPAPAA:209,ABALAPPAPAP:209)ABALAPPAPA:85,(ABALAPPAPPA:142,ABALAPPAPPP:142)ABALAPPAPP:85)ABALAPPAP:93)ABALAPPA:55,(((ABALAPPPAAA:171,ABALAPPPAAP:171)ABALAPPPAA:100,((ABALAPPPAPAA:218,ABALAPPPAPAP:218)ABALAPPPAPA:136,ABALAPPPAPP:136)ABALAPPPAP:100)ABALAPPPA:74,(((ABALAPPPPAAA:209,ABALAPPPPAAP:209)ABALAPPPPAA:133,ABALAPPPPAP:133)ABALAPPPPA:95,(ABALAPPPPPA:152,ABALAPPPPPP:152)ABALAPPPPP:95)ABALAPPPP:74)ABALAPPP:55)ABALAPP:45)ABALAP:34)ABALA:28,((((((ABALPAAAAAA:157,ABALPAAAAAP:157)ABALPAAAAA:117,(ABALPAAAAPA:157,ABALPAAAAPP:157)ABALPAAAAP:117)ABALPAAAA:76,((ABALPAAAPAA:199,ABALPAAAPAP:199)ABALPAAAPA:117,(ABALPAAAPPA:190,ABALPAAAPPP:190)ABALPAAAPP:117)ABALPAAAP:76)ABALPAAA:57,(((ABALPAAPAAA:142,ABALPAAPAAP:142)ABALPAAPAA:114,(ABALPAAPAPA:104,ABALPAAPAPP:104)ABALPAAPAP:114)ABALPAAPA:57,((ABALPAAPPAA:142,ABALPAAPPAP:142)ABALPAAPPA:123,(ABALPAAPPPA:123,ABALPAAPPPP:123)ABALPAAPPP:123)ABALPAAPP:57)ABALPAAP:57)ABALPAA:70,((((ABALPAPAAAA:108,ABALPAPAAAP:108)ABALPAPAAA:119,(ABALPAPAAPA:155,ABALPAPAAPP:155)ABALPAPAAP:119)ABALPAPAA:57,((ABALPAPAPAA:114,(ABALPAPAPAPA:199,ABALPAPAPAPP:199)ABALPAPAPAP:114)ABALPAPAPA:114,(ABALPAPAPPA:152,ABALPAPAPPP:152)ABALPAPAPP:114)ABALPAPAP:57)ABALPAPA:57,(((ABALPAPPAAA:148,(ABALPAPPAAPA:171,ABALPAPPAAPP:171)ABALPAPPAAP:148)ABALPAPPAA:98,(ABALPAPPAPA:100,ABALPAPPAPP:100)ABALPAPPAP:98)ABALPAPPA:57,((ABALPAPPPAA:195,ABALPAPPPAP:195)ABALPAPPPA:95,(ABALPAPPPPA:81,ABALPAPPPPP:81)ABALPAPPPP:95)ABALPAPPP:57)ABALPAPP:57)ABALPAP:70)ABALPA:34,((((ABALPPAAAA:140,(ABALPPAAAPA:110,ABALPPAAAPP:110)ABALPPAAAP:140)ABALPPAAA:43,(ABALPPAAPA:127,(ABALPPAAPPA:142,ABALPPAAPPP:142)ABALPPAAPP:127)ABALPPAAP:43)ABALPPAA:66,(((ABALPPAPAAA:152,ABALPPAPAAP:152)ABALPPAPAA:127,(ABALPPAPAPA:136,ABALPPAPAPP:136)ABALPPAPAP:127)ABALPPAPA:24,((ABALPPAPPAA:138,ABALPPAPPAP:138)ABALPPAPPA:121,((ABALPPAPPPAA:237,ABALPPAPPPAP:237)ABALPPAPPPA:129,ABALPPAPPPP:129)ABALPPAPPP:121)ABALPPAPP:24)ABALPPAP:66)ABALPPA:70,((((ABALPPPAAAA:148,ABALPPPAAAP:148)ABALPPPAAA:136,(ABALPPPAAPD:157,ABALPPPAAPV:157)ABALPPPAAP:136)ABALPPPAA:57,((ABALPPPAPAD:152,ABALPPPAPAV:152)ABALPPPAPA:114,(ABALPPPAPPA:114,(ABALPPPAPPPA:171,ABALPPPAPPPP:171)ABALPPPAPPP:114)ABALPPPAPP:114)ABALPPPAP:57)ABALPPPA:57,(((ABALPPPPAAD:127,ABALPPPPAAV:127)ABALPPPPAA:142,((ABALPPPPAPAA:209,ABALPPPPAPAP:209)ABALPPPPAPA:146,ABALPPPPAPP:146)ABALPPPPAP:142)ABALPPPPA:24,((ABALPPPPPAA:119,ABALPPPPPAP:119)ABALPPPPPA:131,((ABALPPPPPPAA:165,ABALPPPPPPAP:165)ABALPPPPPPA:72,(ABALPPPPPPPA:165,ABALPPPPPPPP:165)ABALPPPPPPP:72)ABALPPPPPP:131)ABALPPPPP:24)ABALPPPP:57)ABALPPP:70)ABALPP:34)ABALP:28)ABAL:34,(((((((ABARAAAAAAA:161,ABARAAAAAAP:161)ABARAAAAAA:114,(ABARAAAAAPA:171,ABARAAAAAPP:171)ABARAAAAAP:114)ABARAAAAA:85,((ABARAAAAPAA:142,ABARAAAAPAP:142)ABARAAAAPA:133,ABARAAAAPP:133)ABARAAAAP:85)ABARAAAA:57,(((ABARAAAPAAA:133,ABARAAAPAAP:133)ABARAAAPAA:95,(ABARAAAPAPA:104,ABARAAAPAPP:104)ABARAAAPAP:95)ABARAAAPA:76,((ABARAAAPPAA:142,ABARAAAPPAP:142)ABARAAAPPA:104,(ABARAAAPPPA:133,ABARAAAPPPP:133)ABARAAAPPP:104)ABARAAAPP:76)ABARAAAP:57)ABARAAA:57,((((ABARAAPAAAA:136,ABARAAPAAAP:136)ABARAAPAAA:100,(ABARAAPAAPA:117,ABARAAPAAPP:117)ABARAAPAAP:100)ABARAAPAA:76,(((ABARAAPAPAAD:256,ABARAAPAPAAV:256)ABARAAPAPAA:98,ABARAAPAPAP:98)ABARAAPAPA:100,(ABARAAPAPPA:184,ABARAAPAPPP:184)ABARAAPAPP:100)ABARAAPAP:76)ABARAAPA:57,(((ABARAAPPAAA:146,ABARAAPPAAP:146)ABARAAPPAA:100,(ABARAAPPAPA:117,ABARAAPPAPP:117)ABARAAPPAP:100)ABARAAPPA:76,(((ABARAAPPPAAD:256,ABARAAPPPAAV:256)ABARAAPPPAA:98,ABARAAPPPAP:98)ABARAAPPPA:100,(ABARAAPPPPA:174,ABARAAPPPPP:174)ABARAAPPPP:100)ABARAAPPP:76)ABARAAPP:57)ABARAAP:57)ABARAA:47,(((((ABARAPAAAAA:167,ABARAPAAAAP:167)ABARAPAAAA:95,(ABARAPAAAPA:171,ABARAPAAAPP:171)ABARAPAAAP:95)ABARAPAAA:85,((ABARAPAAPAA:212,ABARAPAAPAP:212)ABARAPAAPA:91,(ABARAPAAPPA:117,ABARAPAAPPP:117)ABARAPAAPP:91)ABARAPAAP:85)ABARAPAA:57,(((ABARAPAPAAA:176,(ABARAPAPAAPA:146,ABARAPAPAAPP:146)ABARAPAPAAP:176)ABARAPAPAA:76,(ABARAPAPAPA:123,ABARAPAPAPP:123)ABARAPAPAP:76)ABARAPAPA:76,((ABARAPAPPAA:205,ABARAPAPPAP:205)ABARAPAPPA:66,(ABARAPAPPPA:104,ABARAPAPPPP:104)ABARAPAPPP:66)ABARAPAPP:76)ABARAPAP:57)ABARAPA:57,((((ABARAPPAAAA:146,ABARAPPAAAP:146)ABARAPPAAA:100,(ABARAPPAAPA:165,ABARAPPAAPP:165)ABARAPPAAP:100)ABARAPPAA:76,((ABARAPPAPAA:136,(ABARAPPAPAPA:214,ABARAPPAPAPP:214)ABARAPPAPAP:136)ABARAPPAPA:85,(ABARAPPAPPA:152,ABARAPPAPPP:152)ABARAPPAPP:85)ABARAPPAP:76)ABARAPPA:57,(((ABARAPPPAAA:142,ABARAPPPAAP:142)ABARAPPPAA:85,(ABARAPPPAPA:142,ABARAPPPAPP:142)ABARAPPPAP:85)ABARAPPPA:76,((ABARAPPPPAA:146,ABARAPPPPAP:146)ABARAPPPPA:81,((ABARAPPPPPAA:38,ABARAPPPPPAP:38)ABARAPPPPPA:136,ABARAPPPPPP:136)ABARAPPPPP:81)ABARAPPPP:76)ABARAPPP:57)ABARAPP:57)ABARAP:47)ABARA:28,((((((ABARPAAAAAL:152,ABARPAAAAAR:152)ABARPAAAAA:114,(ABARPAAAAPA:152,ABARPAAAAPP:152)ABARPAAAAP:114)ABARPAAAA:85,((ABARPAAAPAA:142,ABARPAAAPAP:142)ABARPAAAPA:114,ABARPAAAPP:114)ABARPAAAP:85)ABARPAAA:57,((ABARPAAPAA:104,ABARPAAPAP:104)ABARPAAPA:66,(ABARPAAPPA:85,ABARPAAPPP:85)ABARPAAPP:66)ABARPAAP:57)ABARPAA:70,((((ABARPAPAAAA:161,ABARPAPAAAP:161)ABARPAPAAA:114,(ABARPAPAAPA:114,(ABARPAPAAPPA:161,ABARPAPAAPPP:161)ABARPAPAAPP:114)ABARPAPAAP:114)ABARPAPAA:76,(ABARPAPAPA:104,ABARPAPAPP:104)ABARPAPAP:76)ABARPAPA:57,((ABARPAPPAA:123,ABARPAPPAP:123)ABARPAPPA:76,(ABARPAPPPA:95,ABARPAPPPP:95)ABARPAPPP:76)ABARPAPP:57)ABARPAP:70)ABARPA:34,((((ABARPPAAAA:91,ABARPPAAAP:91)ABARPPAAA:98,(ABARPPAAPA:81,(ABARPPAAPPA:389,ABARPPAAPPP:389)ABARPPAAPP:81)ABARPPAAP:98)ABARPPAA:57,((ABARPPAPAA:95,ABARPPAPAP:95)ABARPPAPA:85,(ABARPPAPPA:95,ABARPPAPPP:95)ABARPPAPP:85)ABARPPAP:57)ABARPPA:70,(((ABARPPPAAA:91,ABARPPPAAP:91)ABARPPPAA:98,(ABARPPPAPA:81,(ABARPPPAPPA:389,ABARPPPAPPP:389)ABARPPPAPP:81)ABARPPPAP:98)ABARPPPA:57,((ABARPPPPAA:95,ABARPPPPAP:95)ABARPPPPA:85,(ABARPPPPPA:95,ABARPPPPPP:95)ABARPPPPP:85)ABARPPPP:57)ABARPPP:70)ABARPP:34)ABARP:28)ABAR:34)ABA:32,((((((((ABPLAAAAAAA:161,ABPLAAAAAAP:161)ABPLAAAAAA:123,(ABPLAAAAAPA:114,(ABPLAAAAAPPA:161,ABPLAAAAAPPP:161)ABPLAAAAAPP:114)ABPLAAAAAP:123)ABPLAAAAA:66,(ABPLAAAAPA:114,ABPLAAAAPP:114)ABPLAAAAP:66)ABPLAAAA:57,((ABPLAAAPAA:133,ABPLAAAPAP:133)ABPLAAAPA:66,(ABPLAAAPPA:104,ABPLAAAPPP:104)ABPLAAAPP:66)ABPLAAAP:57)ABPLAAA:57,((((ABPLAAPAAAA:152,ABPLAAPAAAP:152)ABPLAAPAAA:114,ABPLAAPAAP:114)ABPLAAPAA:66,((ABPLAAPAPAA:152,ABPLAAPAPAP:152)ABPLAAPAPA:114,(ABPLAAPAPPA:104,(ABPLAAPAPPPA:218,ABPLAAPAPPPP:218)ABPLAAPAPPP:104)ABPLAAPAPP:114)ABPLAAPAP:66)ABPLAAPA:57,((ABPLAAPPAA:114,ABPLAAPPAP:114)ABPLAAPPA:66,(ABPLAAPPPA:85,ABPLAAPPPP:85)ABPLAAPPP:66)ABPLAAPP:57)ABPLAAP:57)ABPLAA:47,(((((ABPLAPAAAAA:165,(ABPLAPAAAAPA:224,ABPLAPAAAAPP:224)ABPLAPAAAAP:165)ABPLAPAAAA:85,((ABPLAPAAAPAD:226,ABPLAPAAAPAV:226)ABPLAPAAAPA:163,ABPLAPAAAPP:163)ABPLAPAAAP:85)ABPLAPAAA:76,(ABPLAPAAPA:95,ABPLAPAAPP:95)ABPLAPAAP:76)ABPLAPAA:57,(((ABPLAPAPAAA:988,ABPLAPAPAAP:988)ABPLAPAPAA:85,ABPLAPAPAP:85)ABPLAPAPA:66,(ABPLAPAPPA:85,(ABPLAPAPPPA:171,((ABPLAPAPPPPAA:161,ABPLAPAPPPPAP:161)ABPLAPAPPPPA:180,ABPLAPAPPPPP:180)ABPLAPAPPPP:171)ABPLAPAPPP:85)ABPLAPAPP:66)ABPLAPAP:57)ABPLAPA:57,(((ABPLAPPAAA:85,ABPLAPPAAP:85)ABPLAPPAA:66,(ABPLAPPAPA:85,ABPLAPPAPP:85)ABPLAPPAP:66)ABPLAPPA:57,(((ABPLAPPPAAA:152,ABPLAPPPAAP:152)ABPLAPPPAA:104,(ABPLAPPPAPA:104,(ABPLAPPPAPPA:228,ABPLAPPPAPPP:228)ABPLAPPPAPP:104)ABPLAPPPAP:104)ABPLAPPPA:76,(ABPLAPPPPA:104,ABPLAPPPPP:104)ABPLAPPPP:76)ABPLAPPP:57)ABPLAPP:57)ABPLAP:47)ABPLA:28,((((((ABPLPAAAAAA:133,ABPLPAAAAAP:133)ABPLPAAAAA:85,(ABPLPAAAAPA:123,ABPLPAAAAPP:123)ABPLPAAAAP:85)ABPLPAAAA:85,((ABPLPAAAPAA:152,ABPLPAAAPAP:152)ABPLPAAAPA:85,((ABPLPAAAPPAA:228,ABPLPAAAPPAP:228)ABPLPAAAPPA:133,ABPLPAAAPPP:133)ABPLPAAAPP:85)ABPLPAAAP:85)ABPLPAAA:57,(((ABPLPAAPAAA:148,ABPLPAAPAAP:148)ABPLPAAPAA:98,(ABPLPAAPAPA:157,ABPLPAAPAPP:157)ABPLPAAPAP:98)ABPLPAAPA:76,((ABPLPAAPPAA:152,ABPLPAAPPAP:152)ABPLPAAPPA:76,(ABPLPAAPPPA:123,(ABPLPAAPPPPA:228,ABPLPAAPPPPP:228)ABPLPAAPPPP:123)ABPLPAAPPP:76)ABPLPAAPP:76)ABPLPAAP:57)ABPLPAA:72,((((ABPLPAPAAAA:167,ABPLPAPAAAP:167)ABPLPAPAAA:89,(ABPLPAPAAPA:157,ABPLPAPAAPP:157)ABPLPAPAAP:89)ABPLPAPAA:66,((ABPLPAPAPAA:142,ABPLPAPAPAP:142)ABPLPAPAPA:85,(ABPLPAPAPPA:152,ABPLPAPAPPP:152)ABPLPAPAPP:85)ABPLPAPAP:66)ABPLPAPA:57,(((ABPLPAPPAAA:104,ABPLPAPPAAP:104)ABPLPAPPAA:76,ABPLPAPPAP:76)ABPLPAPPA:66,((ABPLPAPPPAA:114,ABPLPAPPPAP:114)ABPLPAPPPA:95,(ABPLPAPPPPA:123,ABPLPAPPPPP:123)ABPLPAPPPP:95)ABPLPAPPP:66)ABPLPAPP:57)ABPLPAP:72)ABPLPA:32,(((((ABPLPPAAAAA:129,(ABPLPPAAAAPA:209,ABPLPPAAAAPP:209)ABPLPPAAAAP:129)ABPLPPAAAA:104,ABPLPPAAAP:104)ABPLPPAAA:66,((ABPLPPAAPAA:142,ABPLPPAAPAP:142)ABPLPPAAPA:114,(ABPLPPAAPPA:133,ABPLPPAAPPP:133)ABPLPPAAPP:114)ABPLPPAAP:66)ABPLPPAA:66,((((ABPLPPAPAAAA:228,ABPLPPAPAAAP:228)ABPLPPAPAAA:123,ABPLPPAPAAP:123)ABPLPPAPAA:104,(ABPLPPAPAPA:161,ABPLPPAPAPP:161)ABPLPPAPAP:104)ABPLPPAPA:66,((ABPLPPAPPAA:148,ABPLPPAPPAP:148)ABPLPPAPPA:104,(ABPLPPAPPPA:171,ABPLPPAPPPP:171)ABPLPPAPPP:104)ABPLPPAPP:66)ABPLPPAP:66)ABPLPPA:72,((((ABPLPPPAAAA:133,ABPLPPPAAAP:133)ABPLPPPAAA:104,((ABPLPPPAAPAA:85,ABPLPPPAAPAP:85)ABPLPPPAAPA:114,ABPLPPPAAPP:114)ABPLPPPAAP:104)ABPLPPPAA:57,((ABPLPPPAPAA:95,ABPLPPPAPAP:95)ABPLPPPAPA:104,ABPLPPPAPP:104)ABPLPPPAP:57)ABPLPPPA:66,(((ABPLPPPPAAA:142,ABPLPPPPAAP:142)ABPLPPPPAA:95,(ABPLPPPPAPA:114,ABPLPPPPAPP:114)ABPLPPPPAP:95)ABPLPPPPA:57,((ABPLPPPPPAA:142,ABPLPPPPPAP:142)ABPLPPPPPA:95,(ABPLPPPPPPA:142,ABPLPPPPPPP:142)ABPLPPPPPP:95)ABPLPPPPP:57)ABPLPPPP:66)ABPLPPP:72)ABPLPP:32)ABPLP:28)ABPL:34,(((((((ABPRAAAAAAA:142,ABPRAAAAAAP:142)ABPRAAAAAA:133,(ABPRAAAAAPD:161,ABPRAAAAAPV:161)ABPRAAAAAP:133)ABPRAAAAA:66,((ABPRAAAAPAD:148,ABPRAAAAPAV:148)ABPRAAAAPA:108,(ABPRAAAAPPA:119,(ABPRAAAAPPPA:180,ABPRAAAAPPPP:180)ABPRAAAAPPP:119)ABPRAAAAPP:108)ABPRAAAAP:66)ABPRAAAA:57,(((ABPRAAAPAAD:131,ABPRAAAPAAV:131)ABPRAAAPAA:115,((ABPRAAAPAPAA:199,ABPRAAAPAPAP:199)ABPRAAAPAPA:140,ABPRAAAPAPP:140)ABPRAAAPAP:115)ABPRAAAPA:57,((ABPRAAAPPAA:114,ABPRAAAPPAP:114)ABPRAAAPPA:104,((ABPRAAAPPPAA:171,ABPRAAAPPPAP:171)ABPRAAAPPPA:76,(ABPRAAAPPPPA:171,ABPRAAAPPPPP:171)ABPRAAAPPPP:76)ABPRAAAPPP:104)ABPRAAAPP:57)ABPRAAAP:57)ABPRAAA:57,((((ABPRAAPAAAA:142,ABPRAAPAAAP:142)ABPRAAPAAA:114,ABPRAAPAAP:114)ABPRAAPAA:66,((ABPRAAPAPAA:152,ABPRAAPAPAP:152)ABPRAAPAPA:114,(ABPRAAPAPPA:123,(ABPRAAPAPPPA:190,ABPRAAPAPPPP:190)ABPRAAPAPPP:123)ABPRAAPAPP:114)ABPRAAPAP:66)ABPRAAPA:57,((ABPRAAPPAA:114,ABPRAAPPAP:114)ABPRAAPPA:66,(ABPRAAPPPA:100,ABPRAAPPPP:100)ABPRAAPPP:66)ABPRAAPP:57)ABPRAAP:57)ABPRAA:38,(((((ABPRAPAAAAA:161,(ABPRAPAAAAPA:218,ABPRAPAAAAPP:218)ABPRAPAAAAP:161)ABPRAPAAAA:95,((ABPRAPAAAPAD:228,ABPRAPAAAPAV:228)ABPRAPAAAPA:152,ABPRAPAAAPP:152)ABPRAPAAAP:95)ABPRAPAAA:76,(ABPRAPAAPA:95,ABPRAPAAPP:95)ABPRAPAAP:76)ABPRAPAA:57,(((ABPRAPAPAAA:963,ABPRAPAPAAP:963)ABPRAPAPAA:100,ABPRAPAPAP:100)ABPRAPAPA:66,(ABPRAPAPPA:100,(ABPRAPAPPPA:146,((ABPRAPAPPPPAA:152,ABPRAPAPPPPAP:152)ABPRAPAPPPPA:180,ABPRAPAPPPPP:180)ABPRAPAPPPP:146)ABPRAPAPPP:100)ABPRAPAPP:66)ABPRAPAP:57)ABPRAPA:57,(((ABPRAPPAAA:100,ABPRAPPAAP:100)ABPRAPPAA:66,(ABPRAPPAPA:100,ABPRAPPAPP:100)ABPRAPPAP:66)ABPRAPPA:57,(((ABPRAPPPAAA:161,ABPRAPPPAAP:161)ABPRAPPPAA:104,(ABPRAPPPAPA:114,(ABPRAPPPAPPA:218,ABPRAPPPAPPP:218)ABPRAPPPAPP:114)ABPRAPPPAP:104)ABPRAPPPA:76,(ABPRAPPPPA:104,ABPRAPPPPP:104)ABPRAPPPP:76)ABPRAPPP:57)ABPRAPP:57)ABPRAP:38)ABPRA:38,((((((ABPRPAAAAAA:136,ABPRPAAAAAP:136)ABPRPAAAAA:85,(ABPRPAAAAPA:129,ABPRPAAAAPP:129)ABPRPAAAAP:85)ABPRPAAAA:85,((ABPRPAAAPAA:161,ABPRPAAAPAP:161)ABPRPAAAPA:85,((ABPRPAAAPPAA:214,ABPRPAAAPPAP:214)ABPRPAAAPPA:133,ABPRPAAAPPP:133)ABPRPAAAPP:85)ABPRPAAAP:85)ABPRPAAA:57,(((ABPRPAAPAAA:142,ABPRPAAPAAP:142)ABPRPAAPAA:95,(ABPRPAAPAPA:148,ABPRPAAPAPP:148)ABPRPAAPAP:95)ABPRPAAPA:76,((ABPRPAAPPAA:152,ABPRPAAPPAP:152)ABPRPAAPPA:85,(ABPRPAAPPPA:142,(ABPRPAAPPPPA:214,ABPRPAAPPPPP:214)ABPRPAAPPPP:142)ABPRPAAPPP:85)ABPRPAAPP:76)ABPRPAAP:57)ABPRPAA:57,((((ABPRPAPAAAA:152,ABPRPAPAAAP:152)ABPRPAPAAA:114,(ABPRPAPAAPA:142,ABPRPAPAAPP:142)ABPRPAPAAP:114)ABPRPAPAA:57,((ABPRPAPAPAA:133,ABPRPAPAPAP:133)ABPRPAPAPA:104,(ABPRPAPAPPA:146,ABPRPAPAPPP:146)ABPRPAPAPP:104)ABPRPAPAP:57)ABPRPAPA:57,(((ABPRPAPPAAA:133,ABPRPAPPAAP:133)ABPRPAPPAA:104,(ABPRPAPPAPA:133,ABPRPAPPAPP:133)ABPRPAPPAP:104)ABPRPAPPA:57,((ABPRPAPPPAA:133,ABPRPAPPPAP:133)ABPRPAPPPA:114,(ABPRPAPPPPA:123,ABPRPAPPPPP:123)ABPRPAPPPP:114)ABPRPAPPP:57)ABPRPAPP:57)ABPRPAP:57)ABPRPA:38,(((((ABPRPPAAAAA:127,(ABPRPPAAAAPA:224,ABPRPPAAAAPP:224)ABPRPPAAAAP:127)ABPRPPAAAA:104,ABPRPPAAAP:104)ABPRPPAAA:66,((ABPRPPAAPAA:152,ABPRPPAAPAP:152)ABPRPPAAPA:114,(ABPRPPAAPPA:133,ABPRPPAAPPP:133)ABPRPPAAPP:114)ABPRPPAAP:66)ABPRPPAA:66,((((ABPRPPAPAAAA:228,ABPRPPAPAAAP:228)ABPRPPAPAAA:123,ABPRPPAPAAP:123)ABPRPPAPAA:104,(ABPRPPAPAPA:161,ABPRPPAPAPP:161)ABPRPPAPAP:104)ABPRPPAPA:66,((ABPRPPAPPAA:146,ABPRPPAPPAP:146)ABPRPPAPPA:104,(ABPRPPAPPPA:171,ABPRPPAPPPP:171)ABPRPPAPPP:104)ABPRPPAPP:66)ABPRPPAP:66)ABPRPPA:57,((((ABPRPPPAAAA:123,ABPRPPPAAAP:123)ABPRPPPAAA:110,((ABPRPPPAAPAA:275,ABPRPPPAAPAP:275)ABPRPPPAAPA:117,ABPRPPPAAPP:117)ABPRPPPAAP:110)ABPRPPPAA:57,((ABPRPPPAPAA:89,ABPRPPPAPAP:89)ABPRPPPAPA:110,ABPRPPPAPP:110)ABPRPPPAP:57)ABPRPPPA:66,(((ABPRPPPPAAA:129,ABPRPPPPAAP:129)ABPRPPPPAA:104,(ABPRPPPPAPA:104,ABPRPPPPAPP:104)ABPRPPPPAP:104)ABPRPPPPA:57,((ABPRPPPPPAA:129,ABPRPPPPPAP:129)ABPRPPPPPA:104,(ABPRPPPPPPA:129,ABPRPPPPPPP:129)ABPRPPPPPP:104)ABPRPPPPP:57)ABPRPPPP:66)ABPRPPP:57)ABPRPP:38)ABPRP:38)ABPR:34)ABP:32)P0A:28,(((((((EALAAD:247,EALAAV:247)EALAA:123,EALAP:123)EALA:104,(EALPA:123,EALPP:123)EALP:104)EAL:98,(((EARAAD:247,EARAAV:247)EARAA:123,EARAP:123)EARA:104,(EARPA:123,EARPP:123)EARP:104)EAR:98)EA:36,(((EPLAA:123,EPLAP:123)EPLA:104,(EPLPA:142,(EPLPPA:247,EPLPPP:247)EPLPP:142)EPLP:104)EPL:108,((EPRAA:123,EPRAP:123)EPRA:104,(EPRPA:142,(EPRPPA:247,EPRPPP:247)EPRPP:142)EPRP:104)EPR:108)EP:36)E:39,(((((((MSAAAAAAL:231,MSAAAAAAR:231)MSAAAAAA:91,((MSAAAAAPAA:133,MSAAAAAPAP:133)MSAAAAAPA:98,MSAAAAAPP:98)MSAAAAAP:91)MSAAAAA:66,((MSAAAAPAA:95,MSAAAAPAP:95)MSAAAAPA:104,(MSAAAAPPA:123,MSAAAAPPP:123)MSAAAAPP:104)MSAAAAP:66)MSAAAA:57,(((MSAAAPAAA:85,MSAAAPAAP:85)MSAAAPAA:98,(MSAAAPAPA:114,MSAAAPAPP:114)MSAAAPAP:98)MSAAAPA:81,(MSAAAPPA:174,MSAAAPPP:174)MSAAAPP:81)MSAAAP:57)MSAAA:57,((((MSAAPAAAA:85,MSAAPAAAP:85)MSAAPAAA:104,((MSAAPAAPAA:199,MSAAPAAPAP:199)MSAAPAAPA:76,MSAAPAAPP:76)MSAAPAAP:104)MSAAPAA:66,((MSAAPAPAA:209,MSAAPAPAP:209)MSAAPAPA:114,(MSAAPAPPA:95,MSAAPAPPP:95)MSAAPAPP:114)MSAAPAP:66)MSAAPA:57,((MSAAPPAA:182,MSAAPPAP:182)MSAAPPA:93,((MSAAPPPAA:133,MSAAPPPAP:133)MSAAPPPA:144,(MSAAPPPPA:190,MSAAPPPPP:190)MSAAPPPP:144)MSAAPPP:93)MSAAPP:57)MSAAP:57)MSAA:51,(((((MSAPAAAAD:247,MSAPAAAAV:247)MSAPAAAA:98,MSAPAAAP:98)MSAPAAA:72,MSAPAAP:72)MSAPAA:57,(((MSAPAPAAA:380,MSAPAPAAP:380)MSAPAPAA:98,MSAPAPAP:98)MSAPAPA:72,(MSAPAPPA:117,MSAPAPPP:117)MSAPAPP:72)MSAPAP:57)MSAPA:66,(((MSAPPAAA:134,MSAPPAAP:134)MSAPPAA:83,(MSAPPAPA:144,MSAPPAPP:144)MSAPPAP:83)MSAPPA:57,((MSAPPPAA:125,MSAPPPAP:125)MSAPPPA:83,(MSAPPPPA:125,MSAPPPPP:125)MSAPPPP:83)MSAPPP:57)MSAPP:66)MSAP:51)MSA:36,((((((MSPAAAAAA:190,MSPAAAAAP:190)MSPAAAAA:85,(MSPAAAAPA:114,MSPAAAAPP:114)MSPAAAAP:85)MSPAAAA:66,((MSPAAAPAA:161,MSPAAAPAP:161)MSPAAAPA:95,(MSPAAAPPA:123,MSPAAAPPP:123)MSPAAAPP:95)MSPAAAP:66)MSPAAA:57,(((MSPAAPAAA:152,MSPAAPAAP:152)MSPAAPAA:104,(MSPAAPAPA:114,MSPAAPAPP:114)MSPAAPAP:104)MSPAAPA:76,MSPAAPP:76)MSPAAP:57)MSPAA:66,((((MSPAPAAAA:81,MSPAPAAAP:81)MSPAPAAA:95,((MSPAPAAPAA:199,MSPAPAAPAP:199)MSPAPAAPA:76,MSPAPAAPP:76)MSPAPAAP:95)MSPAPAA:66,((MSPAPAPAA:218,MSPAPAPAP:218)MSPAPAPA:104,(MSPAPAPPA:95,MSPAPAPPP:95)MSPAPAPP:104)MSPAPAP:66)MSPAPA:57,((MSPAPPAA:142,MSPAPPAP:142)MSPAPPA:85,((MSPAPPPAA:142,MSPAPPPAP:142)MSPAPPPA:142,(MSPAPPPPA:180,MSPAPPPPP:180)MSPAPPPP:142)MSPAPPP:85)MSPAPP:57)MSPAP:66)MSPA:51,(((((MSPPAAAAD:247,MSPPAAAAV:247)MSPPAAAA:95,MSPPAAAP:95)MSPPAAA:66,(MSPPAAPA:133,MSPPAAPP:133)MSPPAAP:66)MSPPAA:62,(((MSPPAPAAA:380,MSPPAPAAP:380)MSPPAPAA:95,MSPPAPAP:95)MSPPAPA:66,(MSPPAPPA:114,MSPPAPPP:114)MSPPAPP:66)MSPPAP:62)MSPPA:70,(((MSPPPAAA:133,MSPPPAAP:133)MSPPPAA:76,(MSPPPAPA:142,MSPPPAPP:142)MSPPPAP:76)MSPPPA:62,((MSPPPPAA:123,MSPPPPAP:123)MSPPPPA:76,(MSPPPPPA:123,MSPPPPPP:123)MSPPPPP:76)MSPPPP:62)MSPPP:70)MSPP:51)MSP:36)MS:39)EMS:34,((((((CAAAAA:104,CAAAAP:104)CAAAA:60,(CAAAPA:108,CAAAPP:108)CAAAP:60)CAAA:68,((CAAPAA:285,CAAPAP:285)CAAPA:89,(CAAPPD:104,CAAPPV:104)CAAPP:89)CAAP:68)CAA:51,((((CAPAAAA:136,CAPAAAP:136)CAPAAA:123,(CAPAAPA:152,CAPAAPP:152)CAPAAP:123)CAPAA:98,((CAPAPAA:142,CAPAPAP:142)CAPAPA:123,(CAPAPPA:152,CAPAPPP:152)CAPAPP:123)CAPAP:98)CAPA:68,(((CAPPAAA:133,CAPPAAP:133)CAPPAA:104,(CAPPAPA:155,CAPPAPP:155)CAPPAP:104)CAPPA:98,((CAPPPAA:155,CAPPPAP:155)CAPPPA:104,(CAPPPPD:171,CAPPPPV:171)CAPPPP:104)CAPPP:98)CAPP:68)CAP:51)CA:53,((((CPAAAA:98,CPAAAP:98)CPAAA:70,(CPAAPA:95,CPAAPP:95)CPAAP:70)CPAA:68,((CPAPAA:104,CPAPAP:104)CPAPA:79,(CPAPPD:114,CPAPPV:114)CPAPP:79)CPAP:68)CPA:51,((((CPPAAAA:136,CPPAAAP:136)CPPAAA:123,(CPPAAPA:152,CPPAAPP:152)CPPAAP:123)CPPAA:98,((CPPAPAA:142,CPPAPAP:142)CPPAPA:123,(CPPAPPA:152,CPPAPPP:152)CPPAPP:123)CPPAP:98)CPPA:68,(((CPPPAAA:133,CPPPAAP:133)CPPPAA:104,(CPPPAPA:155,CPPPAPP:155)CPPPAP:104)CPPPA:98,((CPPPPAA:155,CPPPPAP:155)CPPPPA:104,(CPPPPPD:171,CPPPPPV:171)CPPPPP:104)CPPPP:98)CPPP:68)CPP:51)CP:53)C:45,(((((DAAAA:123,DAAAP:123)DAAA:85,(DAAPA:129,DAAPP:129)DAAP:85)DAA:95,((DAPAA:133,DAPAP:133)DAPA:66,((DAPPAA:142,DAPPAP:142)DAPPA:123,(DAPPPA:180,DAPPPP:180)DAPPP:123)DAPP:66)DAP:95)DA:89,(((DPAAA:123,DPAAP:123)DPAA:85,(DPAPA:127,DPAPP:127)DPAP:85)DPA:95,((DPPAA:133,DPPAP:133)DPPA:66,((DPPPAA:142,DPPPAP:142)DPPPA:123,(DPPPPA:180,DPPPPP:180)DPPPP:123)DPPP:66)DPP:95)DP:89)D:49,(P4A:136,P4P:136)P4:49)P3:45)P2:34)P1:28)P0:1;");

console.log(newick);    
// -- update new tree ---//
//root = d3.hierarchy(newick, function(d) 
//    { return d.children; });
    


function tree_from_New(){
    root = d3.hierarchy(newick);
    root.x0 = h / 2;
    root.y0 = 0;


    // shows only the root children 
    //expand(root); 
    //root.children.forEach(expand);
    
    update(root);

   
    // shows only the root children 
    //expand(root); 
    //root.children.forEach(expand);
   // get all the heights
    get_height();
    my_slider();
    MAKE_HMscale();
}

//tree_from_New();
//update(root);

d3.select(self.frameElement).style("height", "300px");


/*   
// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var div = d3.select("#area1").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
*/

//-- From here starts the tree part, from 
//-- https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd


var i = 0,
    duration = 800,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([h/2, w]);

// Collapse the node and all it's children
function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

var nodes;

show_BL = 0;

function update(source) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);
  //console.log(treeData)
  // Compute the new tree layout.
  nodes = treeData.descendants(),
  links = treeData.descendants().slice(1);
  nodes.forEach(function(d){
      if (d.blength == undefined) {d.blength = 0};
  });
    
    set_bl();
  // Normalize for fixed-depth.
 // nodes.forEach(function(d){ d.y = d.depth * 30});
   if (show_BL == 0)
       {nodes.forEach(function(d){ d.y = d.depth * 30});}
   if (show_BL == 1)
       {nodes.forEach(function(d){ d.y = d.blength/2});}
    


  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = svg_tree.selectAll('g.node')
      .data(nodes, function(d) 
            {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr("id", function(d) {return d.data.did.toUpperCase();})
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
        })
      .on('click', click)
      .on("mouseout.c",reset_cell_cols)
      .on("mouseover.t", function(d) {		
            div.style("opacity", .9)
                .text(d.data.did + " "+count_leaves2(d) +" daughters")
                .style("left", (d3.event.pageX + 10 ) + "px")	
                .style("top", (d3.event.pageY - 28) + "px");})
      .on("mouseout.t", function(d) {
            div.style("opacity", 0)
                .text('');})
        .on('contextmenu', d3.contextMenu(menu));

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
//      .attr("id",  function(d) {return d.data.did.toUpperCase();})
      .attr('r', 1e-6);
    

  // Text when adding nodes 
  nodeEnter.append('text')
      .attr("dy", ".35em")
     // position of label depends on children 
      .attr("x", function(d) 
            {return d.children || d._children ? -10 : 10; })
      .attr("text-anchor", function(d) { 
            return d.children || d._children ? "end" : "start"; })
     // HERE I CAN MODIFY TO TUNE THE SIZE AS A FUNCTION OF THE DEPTH
//      .attr("font-size", function(d) {
//                return d.children || d._children ? 
//                    (9- (d.depth*0.2) + "px" ) : "9px" })
      .attr("font-size", function(d) {
               return d.depth <= 3 ? (9- (d.depth*0.2) + "px" ) : "0px" })
      .attr("font-family", "sans serif")
      .text(function(d) 
            {return d.data.did; })

    // .style("fill-opacity", 1e-6);
    
  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
//    .attr('r', 4.5)
    .attr('r', function(d) {
                return (6- (d.depth/3)) })
    .style("fill", function(d) {
            return d._children ? "lightblue" : "#fff";})
    .style('stroke-width', 2)
    .attr('cursor', 'pointer')
    .style("stroke", "blue");

  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = svg_tree.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {

    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }


}

// my functions
// Toggle children on click.
function click(d) {
    //console.log("I have clicked in cell "+ d.data.did)
    //console.log("depth "+ d.depth)
    //console.log("parents " + d.ancestors().map( d => d.data.did ))   
    if (d.children) {
    //    console.log("descendants " + d.descendants().map( d => d.data.did )) 
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
    //    console.log("descendants " + d.descendants().map( d => d.data.did )) 
      }
    update(d);    
}

function expand(d) {
    if (d._children) {
        d.children = d._children;
        d.children.forEach(expand);
        d._children = null;
        }
  }

function expandAll(){
    expand(root); 
    root.children.forEach(expand);
    update(root);
}

function collapseAll(){
    root.children.forEach(collapse);
    collapse(root);
    update(root);
}
    
function resetAll(){
    expand(root); 
    root.children.forEach(collapse);
//    collapse(root);
    update(root);
}


//###################################################################################
//#############FUNCTIONS TO HIGHLIGHT ALL DAUGHTERS OF A GIVEN NODE##################
//###################################################################################
var count;
function count_leaves2(d){
    count = 0;
    if(d.children){   //go through all its children
        for(var ii = 0; ii<d.children.length; ii++){
            //expand(d.children[ii])

            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d.children[ii].children){
                count_subleaves2(d.children[ii]);
                }
            else if (d.children[ii]._children){
                count_subleaves2h(d.children[ii]);
                } 
            //if not then it is a leaf so we count it
            else{
                count++;
                 var xx = "#"+d.children[ii].data.did;
                d3.selectAll("#area2").select(xx.toUpperCase())
                    .attr('opacity', 10).attr('fill-opacity', 0.6).attr("fill", "blue");
                d3.selectAll("#area2").select(xx.toUpperCase()).attr("r", 3);
                  //     console.log(count + " " + xx.toUpperCase())
                }
            }
        }
    if(d._children){   //go through all its children
        for(var ii = 0; ii<d._children.length; ii++){
            //expand(d._children[ii])
            if (d._children[ii]._children){
                count_subleaves2h(d._children[ii]);
                //console.log(d._children[ii])
                }
            else if (d._children[ii].children){
                count_subleaves2(d._children[ii]);
                //console.log(d._children[ii])
                }

            //if not then it is a leaf so we count it
            else{count++;
                var xx = "#"+d._children[ii].data.did;
                d3.selectAll("#area2").select(xx.toUpperCase())
                  .attr('opacity', 10).attr('fill-opacity', 0.6).attr("fill", "blue");
                d3.selectAll("#area2").select(xx.toUpperCase()).attr("r", 3);
                console.log(count + " " + xx.toUpperCase())
                }
            }
        }
 //   d.children.forEach(collapse);
    count2=count; count=0;
    return(count2);
    }        
function count_subleaves2(d){;
        for(var jj = 0; jj<d.children.length; jj++){
                var xx = "#"+d.children[jj].data.did;
                d3.selectAll("#area2").select(xx.toUpperCase())
                    .attr('opacity', 10).attr('fill-opacity', 0.6).attr("fill", "blue");
                d3.selectAll("#area2").select(xx.toUpperCase()).attr("r", 3);
            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d.children[jj].children){
                count_subleaves2(d.children[jj]);
                }
            else if (d.children[jj]._children){
                count_subleaves2h(d.children[jj]);
                }
            //if not then it is a leaf so we count it
            else{count++;
                 //console.log(count + " " + xx.toUpperCase())
                }
            }
    }
function count_subleaves2h(d){;
        for(var jj = 0; jj<d._children.length; jj++){
               var xx = "#"+d._children[jj].data.did;
                d3.selectAll("#area2").select(xx.toUpperCase())
                    .attr('opacity', 10).attr('fill-opacity', 0.6).attr("fill", "blue");
                d3.selectAll("#area2").select(xx.toUpperCase()).attr("r", 3);
            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d._children[jj]._children){
                count_subleaves2h(d._children[jj]);
                }
            else if (d._children[jj].children){
                count_subleaves2(d._children[jj]);
                }
            
            //if not then it is a leaf so we count it
            else{count++;
//                 console.log(count + " " + xx.toUpperCase())
                }
            }
    }

//###################################################################################

var findCommonElements= function(arrs) {
    var resArr = [];
    for (var i = arrs[0].length - 1; i > 0; i--) {
        for (var j = arrs.length - 1; j > 0; j--) {
            if (arrs[j].indexOf(arrs[0][i]) == -1) {
                break;
            }
        }
        if (j === 0) {
            resArr.push(arrs[0][i]);
        }
    }
    return resArr;
}


///  experiments

/*init();
processData(data,0);
reset_cell_cols();
//console.log("here?")*/


function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
    }

function get_height(){
    // get all the nodes (opened) and get their height
    xxx = d3.selectAll("#area1").selectAll("g")
            .select("circle").data()
            .filter(function(d) {return d.y >= 0});
    var yyy = [];
    xxx.filter(function(d) {yyy.push(d.depth)})

    // get the unique vals for x coordinates
    depths = yyy.filter( onlyUnique );
    return depths;    
    console.log(depths);
}
function get_heightID(){
    // get all the nodes (opened) and get their height
    xxx = d3.selectAll("#area1").selectAll("g")
            .select("circle").data()
            .filter(function(d) {return d.y >= 0});
    var yyy = [];
    xxx.filter(function(d) {yyy.push(d.data.did)})

    // get the unique vals for x coordinates
    depths = yyy.filter( onlyUnique );
    return depths;    
    console.log(depths);
}

function reset_cell_cols() {
    d3.selectAll("#area2")
        .selectAll("circle")
         //.attr('opacity', 10)
        .attr('fill-opacity', 0.3)
        .attr("fill", "grey");
    }

function get_branlen(){
    // get all the nodes (opened) and get their height
    xxx = d3.selectAll("#area1").selectAll("g")
            .select("circle").data()
            .filter(function(d) {return d.y >= 0});
    var yyy = [];
    xxx.filter(function(d) {yyy.push(d.data.length)})

    // get the unique vals for x coordinates
    branlen = yyy.filter( onlyUnique );
    return branlen;    
    console.log(bralen);
}

function set_bl(){
    nodes.forEach(function(d) 
        {if (d.parent !==null) 
            {d.blength = d.data.length + d.parent.blength} 
        })
}

function show_bl(){
    if (show_BL == 1) {show_BL = 0}
    else if (show_BL == 0) {show_BL = 1}
    update(root);
}
 