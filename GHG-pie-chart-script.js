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
    var lightColor = hexToRgb(hex);
    return rgbToHex(lightColor.r + deltaR, lightColor.g + deltaG, lightColor.b + deltaB);
}

function colorLighten(hex)
{
    return colorChange(hex, 25, 25, 25);
}

/* Main functions */
/*
var main_pie_linked = document.getElementById("sec_slice_label_path");
main_pie_linked.onmousenter = () =>
{
    var original_color = main_pie_linked.style.fill;
    main_pie_linked.style.fill = colorLighten(original_color);
}
*/

var ag_main_pie = document.getElementById("agriculture_main_pie");
var poop_sec_slice = document.getElementById("livestock_manure");
var hover_shadow = document.getElementById("wasteHoverShadow");

ag_main_pie.onmouseenter = () => {
    document.documentElement.style.setProperty('--test-color', '#FC2B0A');
    poop_sec_slice.style.filter = "url(#wasteHoverShadow)";
};
ag_main_pie.onmouseleave = () => { poop_sec_slice.style.fill = "green"; poop_sec_slice.style.color = "green" };
