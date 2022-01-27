$(function () {

  $('#tbCheckWebSite').on("keypress", function(event){
    if(event.key == 'Enter'){
      $("#btnCheckWebSite").trigger("click");
    }
});
  $("#btnCheckWebSite").on("click", function (data) {
    data.preventDefault();
    var url = $("#tbCheckWebSite").val();
    if (url) {
      document.location = "/" + url;
    }
  });

  if (document.location.pathname != "/") {
    var url = document.location.pathname.substring(1);

    $("h1").text(url);

    var urlToGetDataForAllProbes = "https://st-westus3.azurewebsites.net/probes?siteurl=" + url;

    var urlToGetDataForOneProbe = "https://st-westus3.azurewebsites.net/probe?url=" + url;
    var urlToGetDataForSitePreview = "https://st-westus3.azurewebsites.net/sites?take=1";
    $.getJSON(urlToGetDataForAllProbes, function (data) {

      RenderProbesInGrid(data);

      $.getJSON(urlToGetDataForOneProbe, function (data) {

        RenderProbesInGrid(data);

        $.getJSON(urlToGetDataForSitePreview, function (data) {
          console.info(data);
    
          var template = ($ as any).templates("#theTmpl");
    
          var htmlOutput = template.render(data);
    
          $("#sitesRow").html(htmlOutput);
    
        });
      });
    });

  }
  else {

    $("#mainBreadcrumb").hide();
    //$("h1").text("Hello " + document.location.pathname);

    var url = "https://st-westus3.azurewebsites.net/probes?take=9";
    $.getJSON(url, function (data) {
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
      <th scope="col">Time</th>
      <th scope="col">Latency</th>
      <th scope="col">Dom Load</th>
      <th scope="col">Load</th>     
    </tr>
  </thead>
  <tbody>`;


  var template = ($ as any).templates("#templateProbeRow");
  var htmlOutput = template.render(data);

  htmlToRender += htmlOutput;
  htmlToRender += `</tbody>
  </table>`;

  $("#singleSiteRow").html(htmlToRender);

  if (data[0] && data[0].site && data[0].site.lastProbe) {
    var template = ($ as any).templates("#theTmpl");

    var htmlOutput = template.render(data.site);

    $("#sitesRow").html(htmlOutput);
  }
}