"use strict";
//use self-invoking function to populate source list while page loads
(function (){
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
    $('#byFilter :checkbox').click(function(){
        var tag = $(this).attr('id');
        if ($(this).is(':checked')){
            if (objList.filtered)
                objList.matchingItems.filter(function(item){
                    if (item.values().dist == tag) {
                        return true;
                    }
                    if (item.values().type == tag) {
                        return true;
                    } else {
                        return false;
                    }
                });
            else if (!objList.filtered){
                objList.filter(function(item){
                    if (item.values().dist == tag) {
                        return true;
                    }
                    if (item.values().type == tag) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        } else {
            objList.filter();
        }
    });
})();

$(document).ready(function(){
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
        // $('li').first().remove();
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
