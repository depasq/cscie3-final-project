"use strict";
$(document).ready(function(){
    $('.search').on('keyup', function(){
        $('#size').html($('.list li').size());
    });
    function display(entry){
        $("#releases").empty();
        wwt.gotoRaDecZoom(parseFloat(entry.Xeq*-1), parseFloat(entry.Yeq), 0.2, false);
        $('#releases').append('<h3>'+entry.title+'</h3>');
        $('#releases').append('<p>'+entry.headline+'</p>');
        $('#releases').append('<a href='+entry.link+' target="_blank"><img id=image src='+entry.img+' /></a>');
        $('#releases').append('<h4>Object: '+entry.source+'</h4>');
        $('#releases').append('<h5>RA: '+entry.Xeq*-1+' | Dec: '+entry.Yeq+'</h5>');
    };
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
        $('li').first().empty();
        $('li').first().remove();
        $('#size').html($('.list li').size());
    });
    //load the object clicked on in the search results table
    $(document).on('click', '.go', function(e){
        var objID = $(this).attr('data-id');
        $.getJSON('cxc_sources.json', function(data) {
            var entry = data[objID];
            display(entry);
        });
    });
});
//wait for everything to load before populating the search list
$(window).load(function(){
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
