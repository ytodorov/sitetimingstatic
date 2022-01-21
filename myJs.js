$(function() {
    console.info(document.location);
    console.info(document.location.pathname);

    $("h1").text("Hello " + document.location.pathname);

    var url = "https://y-pl.azurewebsites.net/Probe?url=" + document.location.pathname.substring(1);
    $.getJSON( url, function( data ) {
       console.info(data);
      });

    });