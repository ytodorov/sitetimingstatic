$(function () {
  console.info(document.location);
  console.info(document.location.pathname);

  if (document.location.pathname != "/") {


    var url = document.location.pathname.substring(1);

    $("h1").text(url);

    var urlToGetDataForAllProbes = "https://y-pl.azurewebsites.net/probes?siteurl=" + url;
    

    var urlToGetDataForOneProbe = "https://y-pl.azurewebsites.net/probe?url=" + url;
    $.getJSON(urlToGetDataForOneProbe, function (data) {

      $.getJSON(urlToGetDataForAllProbes, function (data) {
        RenderProbesInGrid(data);
      });
    });

  }
  else {

    $("h1").text("Hello " + document.location.pathname);

    var url = "https://y-pl.azurewebsites.net/sites?take=27";
    $.getJSON(url, function (data) {
      console.info(data);

      var template = ($ as any).templates("#theTmpl");

      var htmlOutput = template.render(data);

      $("#sitesRow").html(htmlOutput);

    });
  }

});

function RenderProbesInGrid(data: any): void {

  var htmlToRender = `<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Latency</th>
      <th scope="col">Dom Load</th>
      <th scope="col">Load</th>
      <th scope="col">Date Created</th>
    </tr>
  </thead>
  <tbody>`;


  debugger;
  var template = ($ as any).templates("#templateProbeRow");
  var htmlOutput = template.render(data);

  htmlToRender += htmlOutput;
  htmlToRender += `</tbody>
  </table>`;

  $("#singleSiteRow").html(htmlToRender);

  debugger;
  if (data[0] && data[0].site && data[0].site.lastProbe)
{
  var template = ($ as any).templates("#theTmpl");

  var htmlOutput = template.render(data.site);

  $("#sitesRow").html(htmlOutput);
}
}