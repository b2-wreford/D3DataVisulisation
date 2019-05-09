// Alpha vantage API Key: 2MJMN0CCZKLM3H4D

//____________________________________________________________  
//				Declare randomColor varible to 
//              generate random color on circles
//____________________________________________________________
var randomColor = (function(){
  var golden_ratio_conjugate = 0.618033988749895;
  var h = Math.random();

  var hslToRgb = function (h, s, l){
      var r, g, b;

      if(s == 0){
          r = g = b = l; // achromatic
      }else{
          function hue2rgb(p, q, t){
              if(t < 0) t += 1;
              if(t > 1) t -= 1;
              if(t < 1/6) return p + (q - p) * 6 * t;
              if(t < 1/2) return q;
              if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
          }

          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
      }

      return '#'+Math.round(r * 255).toString(16)+Math.round(g * 255).toString(16)+Math.round(b * 255).toString(16);
  };
  
  return function(){
    h += golden_ratio_conjugate;
    h %= 1;
    return hslToRgb(h, 0.5, 0.60);
  };
})();



(function (){


//_________________________Declare the size of SVG______________________
	var width= 1720,
		height = 600;

//_____________________Pull up element div and create svg_______________
	var svg = d3.select("#element")
	.append("svg")
	.attr("height", height)
	.attr("width", width)
	.append("g")
	.attr("transfrom", "translate(0,0)")

//______________________Define the div for the tooltip__________________
	var div = d3.select("body").append("div")	
	    .attr("class", "tooltip")				
	    .style("opacity", 0);

	
//_____________________________Scale for bubbles________________________
var radiusScale = d3.scaleSqrt().domain([206, 752]).range([20.6, 75.2])


//_____________Create simulation - collection of forces_________________

//______________________________________________________________________
//forceXSeperate sees if the companies in the csv data are tech companies 
//or not and then it moves the bubbles accordingly.
//______________________________________________________________________
var forceXSeperate = d3.forceX(function (d) {
	if(d.tech === 'in') {
		return 250
	} else{
		return 1450
	}	
}).strength(0.05)

//______________________________________________________________________
//forceXValue sees if the companies in the csv data are from the USA or 
//not and then it moves the bubbles accordingly.
//______________________________________________________________________
var forceXValue = d3.forceX(function (d) {
	if(d.nation === "USA") {
		return 250
	} else{
		return 1450
	}	
}).strength(0.05)

//______________________________________________________________________
//forceXBank sees weather or not the company is a banking or investment
//company and then moves the bubbles accrodingly.
//______________________________________________________________________
var forceXBank = d3.forceX(function (d) {
	if(d.bank === "yes") {
		return 250
	} else{
		return 1450
	}	
}).strength(0.05)

//______________________________________________________________________
//forceXOrder takes a value from the JSON php data and orders the  
//companies in order accordingly.
//______________________________________________________________________
var forceXOrder = d3.forceX(function (d) {
	if(d.order === 1) {
		return 80
	} 
	else if (d.order=== 2){
		return 220 }else if (d.order=== 3){
		return 310}else if (d.order=== 4){
		return 420}else if (d.order=== 5){
		return 525}else if (d.order=== 6){
		return 620}else if (d.order=== 7){
		return 710}else if (d.order=== 8){
		return 770}else if (d.order=== 9){
		return 840}else if (d.order=== 10){
		return 900}else if (d.order=== 11){
		return 970}else if (d.order=== 12){
		return 1035}else if (d.order=== 13){
		return 1105}else if (d.order=== 14){
		return 1170}else if (d.order=== 15){
		return 1240}else if (d.order=== 16){
		return 1295}else if (d.order=== 17){
		return 1356}else if (d.order=== 18){
		return 1398}else if (d.order=== 19){
		return 1443}else if (d.order=== 20){
		return 1485}else if (d.order=== 21){
		return 1525}else if (d.order=== 22){
		return 1580}else if (d.order=== 23){
		return 1630}else if (d.order=== 24){
		return 1670}
	else {
		return 1720
	}	
}).strength(0.05)

//______________________________________________________________________
//forceXCombine combines all the bubbles back together
//______________________________________________________________________
var forceXCombine = d3.forceX(width / 2 ).strength(0.07)

var forceCollide = d3.forceCollide(function(d) {
	return radiusScale(d.sales) + 1.2;

})

//_______________________Create Simulation for Bubbles__________________
var simulation = d3.forceSimulation()
.force("x", forceXCombine)
.force("y", d3.forceY(height / 2).strength(0.05))
//Force code to stop bubbles colliding
.force("collide", forceCollide) 



//________________________PULLING IN PHP DATA___________________________
	d3.json("php/data2.php", function(error, data) {
    data.forEach(function(d) {
        d.id =  d.id
        d.name = d.name
        d.sales = + d.sales
        d.tech =  d.tech
        d.bank =  d.bank
        d.nation = d.nation
        d.symbol = d.symbol
        d.order = d.order
    })
    

//_________________________Pull in the CSV data_________________________ 
/*	d3.queue()
	.defer(d3.csv, "sales.csv")
	.await(ready)

	function ready (error, datapoints) {*/
//_____________________________Draw circles_____________________________
		var circles = svg.selectAll(".artist")
	//for every data point it creates a circle
		.data(data)       
		.enter().append("circle")
		.attr("class", "artist")
	//give it a radius depending on size of sales(CSV)
		.attr("r", function(d) {
			return radiusScale(d.sales);
		})
		.attr("fill", randomColor)
		.on('click', function(d){
			console.log(d)
		})
	//Add mouse over/out to display csv specfic data
		.on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(d.name + "<br/> $"  +  d.sales + "bn"+ "<br/>" + d.nation + "<br/> Symbol: " + d.symbol )	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
		

//_____________________________________________________________________		
// Add simulation to respond to the button clicks
//#inorout uses forceXSeperate to move the bubbles apart
//_____________________________________________________________________
	d3.select("#inorout").on('click', function() {
		simulation
		.force("x", forceXSeperate)
		.alphaTarget(0.25)
		.restart()
		
	})

//________#combine pushes all bubbles together using forceXCombine____
	d3.select("#combine").on('click', function() {
		simulation
		.force("x", forceXCombine)
		.alphaTarget(0.25)
		.restart()
		
	})
//___________#value changes the bubbles depending on forceXValue_____
	d3.select("#value").on('click', function() {
		simulation
		.force("x", forceXValue)
		.alphaTarget(0.25)
		.restart()
		
	})

//___________#bank changes the bubbles depending on forceXValue_____
	d3.select("#bank").on('click', function() {
		simulation
		.force("x", forceXBank)
		.alphaTarget(0.25)
		.restart()
		
	})

//___________#order changes the bubbles depending on forceXValue_____
	d3.select("#order").on('click', function() {
		simulation
		.force("x", forceXOrder)
		.alphaTarget(0.25)
		.restart()
		
	})


//_____________________Feed Data to simulation___________________
	simulation.nodes(data)
	.on('tick', ticked)

//_____When the button is clicked, reset the circles position____
	function ticked() {
		circles
		.attr("cx", function(d)  {
			return d.x
		})
		.attr("cy", function(d) {
			return d.y
		})
	}

	console.log(data);


//________________________DATA ANAYLSIS_________________________

//_____Console Log the name of companies in ascending order_____
var name = data.map(function(d) { return d.name; });

name.sort(d3.ascending);
console.log("Alphabetical Company Names: " + name);

//____Console Log the value of companies in descending order____
var sales = data.map(function(d) { return d.sales; });

sales.sort(d3.descending);
console.log("Descending Company Values ($bn): " + sales);

//________Console Log the nations of featured companies ________
var nation = data.map(function(d) { return d.nation; });

nation.sort(d3.ascending);
console.log("Different Nations: " + nation);

//________Console Log the symbols of featured companies ________
var symbol = data.map(function(d) { return d.symbol; });

symbol.sort(d3.ascending);
console.log("Company Symobls: " + symbol);

var order = data.map(function(d) { return d.order; });

order.sort(d3.ascending);
console.log("Company Symobls: " + order);

//________Console Log the number of featured companies ________
var count = 0;

data.forEach(function(d) {
  count += 1;
});

console.log("Number of Companies: " + count);



	
})
})
();
