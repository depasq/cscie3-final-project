"use strict";
$(document).ready(function(){
    $('.search').on('keyup', function(){
        console.log('hi '+ $('.list li').size());
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
        'date',
        { attr: 'href', name: 'link' },
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
                date: val.date,
                link: val.link,
                image: val.img,
                dist: val.Dist,
                type: val.Type,
                id: key
            });
        });
    });
    //handle all list filtering
    $('#Clear').click(function(){
        objList.filter();
        $('li').first().empty();
        $('li').first().remove();
        $('input[type=radio]').prop('checked', false);
        flagT=0;
        flagD=0;
        $('#size').html($('.list li').size());
    });
    $('#byFilter :radio').click(function(){
        $('#Clear').prop('checked', false);
        var tag = $(this).attr('id');
        var name = $(this).attr('name');

        if (name == "Type"){
            if (flagD) {
                objList.matchingItems.filter(function(item){
                    if (item.values().type == tag) {
                        return true;
                    } else {
                        return false;
                    }
                });
            } else {
                objList.filter(function(item){
                    if (item.values().type == tag) {
                        return true;
                    } else {
                        return false;
                    }
                });
                flagT=1;
            }
        } else if (name == "Dist"){
            if (flagT) {
                objList.matchingItems.filter(function(item){
                    if (item.values().dist == tag) {
                        return true;
                    } else {
                        return false;
                    }
                });
            } else {
                objList.filter(function(item){
                    if (item.values().dist == tag) {
                        return true;
                    } else {
                        return false;
                    }
                });
                flagD=1;
            }
        }
        $('#size').html($('.list li').size());
    });
});
