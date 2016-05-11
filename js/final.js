"use strict";
/** Joseph DePasquale | CSCI E-3 Final Project | Spring 2016
 ** final.js
 **
 ** TO DO: - Filtering on two criteria (add distance filtering)
 **        - Fix the count update (sometimes lags behind actual results by one keypress)
 **        - Improved UI and layout (responsive design)
 **/

$(document).ready(function(){
    var filters = [];
    var objList;
    var i=0;

    // declare options for the loading animation and start it running
    $.fn.spin.presets.spinner = {
        lines: 9,
        length: 50,
        width: 10,
        radius: 50
    }
    $('body').spin('spinner', '#fff');

    // function to handle reading JSON data into table displayed at bottom
    // this is list.js syntax for dropping the list into the DOM
    function loadData() {
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
        objList = new List('advanced', options);
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
        // This call deals with the annoying "feature" of list.js that
        // requires a sample element for the list in order to populate it with
        // json data. That first element doesn't exist and is just a blank
        // entry in the table so hide it here.
        // Also, the null element throws an error in the console because it's
        // looking for an image that isn't there. There's probably a better way to do this.
        $('li[data-id="-1"]').css('display', 'none');
    }
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
        //update count
        $('#size').html($('.list li').size());
    });

    // load the random or user-selected press release both into
    // the WWT portal window and into the content window.
    function display(entry){
        //first clear out any previous data
        $("#releases").empty();
        //set WWT to the current location
        wwt.gotoRaDecZoom(parseFloat(entry.Xeq*-1), parseFloat(entry.Yeq), 0.2, false);
        //update the press content box
        $('#releases').append('<h3>'+entry.title+'</h3>');
        $('#releases').append('<p>'+entry.headline+'</p>');
        $('#releases').append('<a href='+entry.link+' target="_blank"><img id=image src='+entry.img+' /></a>');
        $('#releases').append('<br/><br/>'+entry.source+'<br/>');
        $('#releases').append('Release Date: '+entry.date+'<br/>');
        $('#releases').append('RA: '+(entry.Xeq*-1).toFixed(2)+' | Dec: '+(entry.Yeq).toFixed(2));
        //only run loadData function the first time the display call is made
        if (i == 0) {
            loadData();
        }
        i=1;
        //turn off the spinner animation
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
    $("#lucky").click(function(){
        random();
    });
    //slide animation for toggling more search options
    $("#toggle").click(function(){
        $("#advanced").slideToggle();
        //write the current size of the list to the page
        $('#size').html($('.list li').size());
    });
    //event handler for the name based search bar
    $('.search').on('keyup', function(){
        $('#size').html($('.list li').size());
    });
    //load the object clicked on in the search results table using the data-id
    //attribute to pull the matching element from the array
    $(document).on('click', '.go', function(e){
        var objID = $(this).attr('data-id');
        $.getJSON('cxc_sources.json', function(data) {
            var entry = data[objID];
            display(entry);
        });
    });
});
