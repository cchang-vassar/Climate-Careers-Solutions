/* Helper functions */
function hexToRgb(hex)
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
    {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}
  
function rgbToHex(r, g, b)
{
    function componentToHex(c)
    {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function colorChange(hex, deltaR, deltaG, deltaB)
{
    function gate(c){
        if (c > 255){
            return 255;
        }
        else if (c < 0){
            return 0;
        }
        else return c;
    }
    var lightColor = hexToRgb(hex);
    return rgbToHex(gate(lightColor.r + deltaR), gate(lightColor.g + deltaG), gate(lightColor.b + deltaB));
}

function colorLighten(hex)
{
    return colorChange(hex, 25, 25, 25);
}

function colorDarken(hex)
{
    return colorChange(hex, -25, -25, -25);
}

const svgNS = "http://www.w3.org/2000/svg";
const svgs = document.getElementsByTagName("svg");
const defs = document.getElementsByTagName("defs")[0];

function getFill(id)

{
	let element = document.getElementById(id);
    var fill;
	if (element.currentStyle) {
		fill = x.currentStyle["fill"];
    }
	else if (window.getComputedStyle) {
		fill = getComputedStyle(element).getPropertyValue("fill");
    }
    var rgb = fill.split(",");
    return rgbToHex(parseInt(rgb[0].substring(4)), parseInt(rgb[1]), parseInt(rgb[2]));
}

function getFilterId(id, drop){
    return drop ? id + "_drop_filter" : id + "_inset_filter";
}



function createDropShadow(id){
    let filter = document.createElementNS(svgNS, "filter");
    filter.setAttribute("id", getFilterId(id, true));
    let feDropShadow = document.createElementNS(svgNS, "feDropShadow");
    feDropShadow.setAttribute("in", "SourceGraphic");
    feDropShadow.setAttribute("dx", "0");
    feDropShadow.setAttribute("dy", "0");
    feDropShadow.setAttribute("stdDeviation", "5");
    feDropShadow.setAttribute("flood-opacity", "0.7");
    feDropShadow.setAttribute("flood-color", getFill(id));
    filter.appendChild(feDropShadow);
    defs.appendChild(filter);
}

function putOnTop(id){
    let element = document.getElementById(id).parentNode;
    element.parentNode.appendChild(element);
}

function hoverGroupEffect(sourceIds, destinationsFunction, strokeStates)
{
    sourceIds.forEach(id => {
        hoverEffect(id, destinationsFunction(id), strokeStates);    
    });   
}

function hoverEffect(sourceId, destinationIds, strokeStates){
    let source = document.getElementById(sourceId);
    let destinations = destinationIds.map(x => document.getElementById(x));
    let opacities = destinations.map(element => getComputedStyle(element).getPropertyValue("opacity"));
    let fills = destinations.map(element => getComputedStyle(element).getPropertyValue("fill"));
    source.onmouseenter = () => {
        destinations.forEach(element => {
            elementIndex = destinations.indexOf(element);
            createDropShadow(destinationIds[elementIndex]);
            element.style.filter = "url(#" + getFilterId(destinationIds[elementIndex], true) + ")";
            if (typeof strokeStates == "undefined" || strokeStates[elementIndex] == true){
                element.style.stroke = "#FFFFFF";
                element.style.strokeWidth = "2";
            }
            element.style.opacity = "100%"
            element.style.fill = colorLighten(getFill(destinationIds[elementIndex]));
        });
        putOnTop(sourceId);
    };
    source.onmouseleave = () => {
        destinations.forEach(element => {
            element.style.filter = "";
            element.style.strokeWidth = "0";
            element.style.opacity = opacities[destinations.indexOf(element)];
            element.style.fill = fills[destinations.indexOf(element)];
            defs.removeChild(document.getElementById(getFilterId(destinationIds[destinations.indexOf(element)], true)));
        });
    }
}

/*
function insetEffect(sourceId, destinationIds) {
    let source = document.getElementById(sourceId);
    let destinations = destinationIds.map(x => document.getElementById(x));
    destinations.forEach(element => {
        elementIndex = destinations.indexOf(element);
        element.style.filter = "url(#insetShadow)";
    })
}

function insetGroupEffect(sourceIds, destinationsFunction) {
    sourceIds.forEach(id => {
        insetEffect(id, destinationsFunction(id));    
    });   
}
*/


/* Main functions */
let hover_array;
Array.from(svgs).forEach(svg => {switch (svg.getAttribute("class")) {
    case "main":
        hover_array = ["agriculture", "waste", "industry", "energy"]
        hoverGroupEffect(hover_array.map(x => x + "_main_pie"), x => {return [x + "_path"];});
        break;
    case "section":
        hover_array = ["livestock_manure", "agricultural_soils", "rice_cultivation", "crop_burning", "deforestation", "cropland", 
        "landfills", "wastewater", "chemicals", "cement", 
        "energy_use_in_industry", "transport", "energy_use_in_buildings", 
        "unallocated_fuel_combustion", "fugitive_emissions", "energy_in_agriculture_fishing"];
        //insetGroupEffect(hover_array.map(x => x + "pie"), x => { return [x] });
        hoverGroupEffect(hover_array, x => {return [x + "_sec_slice", x + "_pie", x + "_label"]}, [true, false, false]);
        hoverGroupEffect(hover_array.map(x => x + "_pie"), x => {return [x.replace("_pie", "_sec_slice"), x, x.replace("_pie", "_label")]}, [true, false, false]);
        break;
    case "slice":
        hover_array = ["livestock_manure", "agricultural_soils", "rice_cultivation", "crop_burning", "deforestation", "cropland", 
        "landfills", "wastewater", "chemicals", "cement", 
        "energy_use_in_industry", "transport", "energy_use_in_buildings", 
        "unallocated_fuel_combustion", "fugitive_emissions", "energy_in_agriculture_fishing"]
        hoverGroupEffect(hover_array.map(x => x + "_pie"), x => {return [x]}, [false]);
        break;
}});