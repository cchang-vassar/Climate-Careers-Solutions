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

function createDropShadow(id, idSuffix){
    let filter = document.createElementNS(svgNS, "filter");
    filter.setAttribute("id", id + "_filter")
    let feDropShadow = document.createElementNS(svgNS, "feDropShadow");
    feDropShadow.setAttribute("dx", "0");
    feDropShadow.setAttribute("dy", "0");
    feDropShadow.setAttribute("stdDeviation", "10");
    feDropShadow.setAttribute("flood-opacity", "0.7");
    feDropShadow.setAttribute("flood-color", colorLighten(getFill(id + idSuffix)));
    filter.appendChild(feDropShadow);
    defs.appendChild(filter);
}

function putOnTop(id){
    let element = document.getElementById(id).parentNode;
    element.parentNode.appendChild(element);
}

function hoverEffect(ids, idSuffix)
{
    ids.forEach(id => {
        let element = document.getElementById(id);
        let elementSuffixed = document.getElementById(id + idSuffix);
        elementSuffixed.style.stroke = "#FFFFFF";
        element.style.zIndex = "0";
        let filterId = id + "_filter";
        element.onmouseenter = () => {
            createDropShadow(id, idSuffix);
            element.style.filter = "url(#" + filterId + ")";
            elementSuffixed.style.strokeWidth = "2";
            putOnTop(id);
        };
        element.onmouseleave = () => {
            element.style.filter = "";
            elementSuffixed.style.strokeWidth = "0";
            defs.removeChild(document.getElementById(filterId));
    }});   
}


/* Main functions */
const main_pie_array = ["agriculture", "waste", "industry", "energy"].map(x => x + "_main_pie");
hoverEffect(main_pie_array, "_path");
