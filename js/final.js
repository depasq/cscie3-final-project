"use strict";
/** I've found that splitting up the two main functions of the site into two sections,
 ** one that loads with document.ready, and the other with window.load seems to make
 ** everything play nice. Otherwise, I found that I was getting errors where the page
 ** would be stuck populating the list table while other elements were trying to populate
 ** with images.
 **
 ** This first document.ready section handles loading the main elements and the first
 ** random press release that appears after page load.
 **
 ** The window.load section, only populates the list table after EVERYTHING else (including)
 ** images is already in place. This works because the table is not visible anyway until the user
 ** clicks on "more options" so there is a little extra time to load it.
 **
 ** TO DO: - Filtering on two criteria (add distance filtering)
 **        - Fix the count update (sometimes lags behind actual results by one keypress)
 **        - Improved UI and layout (responsive design)
 **/

$(document).ready(function(){
    $.fn.spin.presets.flower = {
        lines: 9,
        length: 50,
        width: 10,
        radius: 50
    }
    $('body').spin('flower', '#fff');

    // load the random or user-selected press release both into
    // the WWT portal window and into the content window.
    function display(entry){
        $("#releases").empty();
        wwt.gotoRaDecZoom(parseFloat(entry.Xeq*-1), parseFloat(entry.Yeq), 0.2, false);
        $('#releases').append('<h3>'+entry.title+'</h3>');
        $('#releases').append('<p>'+entry.headline+'</p>');
        $('#releases').append('<a href='+entry.link+' target="_blank"><img id=image src='+entry.img+' /></a>');
        $('#releases').append('<br/><br/>'+entry.source+'<br/>');
        $('#releases').append('Release Date: '+entry.date+'<br/>');
        $('#releases').append('RA: '+(entry.Xeq*-1).toFixed(2)+' | Dec: '+(entry.Yeq).toFixed(2));
        $('body').spin(false);

    };
    // pick a press release at random and call the display function to show it
    function random(){
        $.getJSON('cxc_sources.json', function(data) {
            var rNum = parseInt(Math.random()*data.length);
            var rEntry = data[rNum];
            display(rEntry);
        });
    };
    // load random press release on page load
    random();
    // fire another random release on 'Surprise Me!' button click
    // first clear out the div to overwrite with new content
    $("#lucky").click(function(){
        $("#releases").empty();
        random();
    });
    //slide animation for toggling more search options
    $("#toggle").click(function(){
        $("#advanced").slideToggle();
        //write the current size of the list to the page
        $('#size').html($('.list li').size());

        // this is a cheat to deal with the annoying "feature" of list.js that
        // requires a sample element for the list in order to populate with
        // json data. That first element doesn't exist and is just a blank
        // entry in the table so hide it when more search options is loaded
        // NOTE - this call appears elsewhere as the element pops back into the
        // list depending on search options
        // Also, the null element throws an error in the console because it's
        // looking for an image that isn't there.
        $('li[data-id="-1"]').remove();
    });
    //load the object clicked on in the search results table
    $(document).on('click', '.go', function(e){
        var objID = $(this).attr('data-id');
        $.getJSON('cxc_sources.json', function(data) {
            var entry = data[objID];
            display(entry);
        });
    });
    //event handler for the name based search bar
    $('.search').on('keyup', function(){
        $('#size').html($('.list li').size());
        $('li[data-id="-1"]').remove();
    });
});
//wait for everything to load before populating the search list
$(window).load(function(){
    //list.js stuff for loading the json data into the page
    //declare array for holding the filter values
    var filters = [];
    var options = {
        valueNames: [
        'source',
        'headline',
        'date',
        { attr: 'src', name: 'image'},
        { attr: 'id', name: 'dist'},
        { attr: 'id', name: 'type'},
        { data: ['id'] }
    ]};
    var objList = new List('advanced', options);
    $.getJSON('cxc_sources.json', function(data) {
        $.each(data, function(key, val){
            objList.add({
                source: val.source,
                headline: val.headline,
                date: val.date,
                image: val.img,
                dist: val.Dist,
                type: val.Type,
                id: key
            });
        });
    });
    //handle all list filtering
    $('#byFilter :checkbox').change(function(){
        var isChecked = this.checked;
        var tag = $(this).attr('id');
        var name = $(this).attr('name');

        // if checkbox checked, add this item to the filter list
        // if not, remove it
        if (isChecked){
            filters.push(tag);
        } else {
            filters.splice(filters.indexOf(tag), 1);
        }
        // plan to implement multidimensional filtering on both category
        // and distance, but just category for now
        objList.filter(function(item){
            if (filters.length > 0) {
                return(filters.indexOf(item.values().type)>-1);
            }
            return true;
        });
        //update count and delete that first element needed by list.js
        $('#size').html($('.list li').size());
        $('li[data-id="-1"]').remove();
    });
    //again delete that first element needed by list.js
    $('.sort').click(function(){
        $('li[data-id="-1"]').remove();
    });
});
