$(document).ready(function(){
    $.getJSON('cxc_sources.json', function(data) {
        // for (i=0; i<=4; i++)
        rNum = parseInt(Math.random()*data.length);
        rEntry = data[rNum];
        wwt.gotoRaDecZoom(parseFloat(data[rNum].Xeq*-1), parseFloat(data[rNum].Yeq), 0.2, false);

        $('#releases').append('<h3>'+rEntry.title+'</h3>');
        $('#releases').append('<p>'+rEntry.headline+'</p>');
        $('#releases').append('<a href='+rEntry.link+' target="_blank"><img id=image src='+rEntry.img+' /></a>');
        $('#releases').append('<h4>Object: '+rEntry.source+'</h4>');
        $('#releases').append('<h5>RA: '+rEntry.Xeq*-1+' | Dec: '+rEntry.Yeq+'</h5>');

    });
});
