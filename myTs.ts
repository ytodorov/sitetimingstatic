$(function() {
    console.info(document.location);
    console.info(document.location.pathname);

    $("h1").text("Hello " + document.location.pathname);
    });