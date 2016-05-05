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
 **/
$(document).ready(function(){
    // load the random or user-selected press release both into
    // the WWT portal window and into the content window.
    function display(entry){
        $("#releases").empty();
        wwt.gotoRaDecZoom(parseFloat(entry.Xeq*-1), parseFloat(entry.Yeq), 0.2, false);
        $('#releases').append('<h3>'+entry.title+'</h3>');
        $('#releases').append('<p>'+entry.headline+'</p>');
        $('#releases').append('<a href='+entry.link+' target="_blank"><img id=image src='+entry.img+' /></a>');
        $('#releases').append('<h4>Object: '+entry.source+'</h4>');
        $('#releases').append('<h5>RA: '+entry.Xeq*-1+' | Dec: '+entry.Yeq+'</h5>');
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
        // NOTE this creates a bug where multiple clicks of the "more options"
        // link removes the next real entry from the table - not good!
        $('li').first().empty();
        $('li').first().remove();
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
    });
});
//wait for everything to load before populating the search list
$(window).load(function(){
    //list.js stuff for loading the json data into the page
    var activeFilters = [];
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
        if (isChecked){
            activeFilters.push(tag);
        } else {
            activeFilters.splice(activeFilters.indexOf(tag), 1);
        }
        objList.filter(function(item){
            if (activeFilters.length > 0) {
                return(activeFilters.indexOf(item.values().type)>-1);
            }
            return true;
        });
        $('#size').html($('.list li').size());
    });
});
