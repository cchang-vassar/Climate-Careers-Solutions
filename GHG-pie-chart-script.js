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

const svgNS = "http://www.w3.org/2000/svg";
const svg = document.getElementsByTagName("svg")[0];
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

function getFilterId(id){
    return id + "_filter";
}

function createDropShadow(id){
    let filter = document.createElementNS(svgNS, "filter");
    filter.setAttribute("id", getFilterId(id))
    let feDropShadow = document.createElementNS(svgNS, "feDropShadow");
    feDropShadow.setAttribute("dx", "0");
    feDropShadow.setAttribute("dy", "0");
    feDropShadow.setAttribute("stdDeviation", "10");
    feDropShadow.setAttribute("flood-opacity", "0.7");
    feDropShadow.setAttribute("flood-color", colorLighten(getFill(id)));
    filter.appendChild(feDropShadow);
    defs.appendChild(filter);
}

function putOnTop(id){
    let element = document.getElementById(id).parentNode;
    element.parentNode.appendChild(element);
}

function hoverGroupEffect(sourceIds, destinationsFunction)
{
    sourceIds.forEach(id => {
        hoverEffect(id, destinationsFunction(id));    
    });   
}

function hoverEffect(sourceId, destinationIds){
    let source = document.getElementById(sourceId);
    let destinations = destinationIds.map(x => document.getElementById(x));
    let opacities = destinations.map(element => getComputedStyle(element).getPropertyValue("opacity"));
    destinations.forEach(element => element.style.stroke = "#FFFFFF");

    source.onmouseenter = () => {
        destinations.forEach(element => {
            createDropShadow(destinationIds[destinations.indexOf(element)]);
            element.style.filter = "url(#" + getFilterId(destinationIds[destinations.indexOf(element)]) + ")"
            element.style.strokeWidth = "2";
            element.setAttribute("opacity", "1");
        });
        putOnTop(sourceId);
    };
    source.onmouseleave = () => {
        destinations.forEach(element => {
            element.style.filter = "";
            element.style.strokeWidth = "0";
            element.setAttribute("opacity", opacities[destinations.indexOf(element)]);
            defs.removeChild(document.getElementById(getFilterId(destinationIds[destinations.indexOf(element)])));
        });
    }
}


/* Main functions */
let main_pie_array;
switch (svg.getAttribute("id")) {
    case "original":
        main_pie_array = ["agriculture", "waste", "industry", "energy"].map(x => x + "_main_pie");
        hoverGroupEffect(main_pie_array, x => {return [x + "_path"];});
        break;
    case "section":
        main_pie_array = ["livestock_manure", "agricultural_soils", "rice_cultivation", "crop_burning", "deforestation", "cropland"];
        hoverGroupEffect(main_pie_array, x => {return [x + "_sec_slice", x + "_pie"]});
        hoverGroupEffect(main_pie_array.map(x => x + "_pie"), x => {return [x.replace("_pie", "_sec_slice"), x]});
        break;
}
