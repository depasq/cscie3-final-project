// declare global Worldwide Telescope object
var wwt;
// Create variables to hold the changeable settings
var bShowCrosshairs = true;
var bShowUI = true;
var bShowFigures = true;
var bShowCircles = false;

// This function initializes the wwt object and once it is done
// it fires the wwtReady event
function initialize() {
    wwt = wwtlib.WWTControl.initControl("WWTCanvas");
    wwt.add_ready(wwtReady);
    wwt.add_arrived(wwtArrived);
}
// This function is where you would put your custom code for WWT
// following the initForWwt() call
function wwtReady() {
    initForWwt();
}

// This is the initialization for Worldwide Telescope
function initForWwt() {
    wwt.loadImageCollection("http://www.worldwidetelescope.org/COMPLETE/wwtcomplete.wtml");

    // add any wwt object settings changes here
    wwt.settings.set_showCrosshairs(bShowCrosshairs);
    wwt.settings.set_showConstellationFigures(bShowFigures);
    wwt.hideUI(!bShowUI);
}

// A function to create a circle, and return a reference to the circle
var circleCount = 0;
function createWWTCircle(fill, lineColor, fillColor, lineWidth, opacity, radius, skyRelative, ra, dec) {
    var circle = wwt.createCircle(fill);
    circleCount++;
    circle.set_id("Circle" + circleCount.toString());
    circle.set_lineColor(lineColor);
    circle.set_fillColor(fillColor);
    circle.set_lineWidth(lineWidth);
    circle.set_opacity(opacity);
    circle.set_radius(radius);
    circle.set_skyRelative(skyRelative);
    circle.setCenter(ra, dec);
    return circle;
}

// A simple function to toggle the settings
// This function is called from the checkbox entries setup in the html table
function toggleSetting(text) {
    switch (text) {
        case 'ShowUI':
            bShowUI = !bShowUI;
            wwt.hideUI(!bShowUI);
            wwt.set_showExplorerUI(bShowUI);
            break;

        case 'ShowCrosshairs':
            bShowCrosshairs = !bShowCrosshairs;
            wwt.settings.set_showCrosshairs(bShowCrosshairs);
            break;

        case 'ShowFigures':
            bShowFigures = !bShowFigures;
            wwt.settings.set_showConstellationFigures(bShowFigures);
            break;
    }
}
function wwtArrived(obj, eventArgs) {
   if (bShowCircles) {
       // Show that we have arrived by drawing a red circle at the new ra, dec
        var circle = createWWTCircle(false, "red", "blue", 3, 1.0, 15, false, eventArgs.get_RA(), eventArgs.get_dec());
       wwt.addAnnotation(circle);
    }
}

// A function to change the view to different constellations
// Note the fov set to 60 (maximum view distance)
// This function is called from the button entries in the html table
function GotoConstellation(text) {

    switch (text) {
        case 'Sagittarius':
            wwt.gotoRaDecZoom(286.485, -27.5231666666667, 60, false);
            break;

        case 'Aquarius':
            wwt.gotoRaDecZoom(334.345, -9.21083333333333, 60, false);
            break;
    }
}
