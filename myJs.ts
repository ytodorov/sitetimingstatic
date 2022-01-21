$(function () {
  console.info(document.location);
  console.info(document.location.pathname);

  if (document.location.pathname != "/") {

    var url = document.location.pathname.substring(1);
    var urlToGetData = "https://y-pl.azurewebsites.net/probe?url=" + "google.com";
    $.getJSON(urlToGetData, function (data) {

      var htmlToRender = `<table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Latency</th>
          <th scope="col">Dom Load</th>
          <th scope="col">Load</th>
        </tr>
      </thead>
      <tbody><tr>`;

      
      debugger;
      var template = ($ as any).templates("#templateProbeRow");
      var htmlOutput = template.render(data);

      htmlToRender += htmlOutput;
      htmlToRender += `</tr></tbody>
      </table>`;

      $("#singleSiteRow").html(htmlToRender);

    });
  }
  else {

    $("h1").text("Hello " + document.location.pathname);

    var url = "https://y-pl.azurewebsites.net/sites?take=19";
    $.getJSON(url, function (data) {
      console.info(data);

      var template = ($ as any).templates("#theTmpl");

      var htmlOutput = template.render(data);

      $("#sitesRow").html(htmlOutput);

    });
  }

});