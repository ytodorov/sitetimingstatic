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

  if (document.location.pathname != "/" && document.location.pathname != "") {
    var url = document.location.pathname.substring(1);

    $("h1").text(url);

    var urlToGetDataForAllProbes = "https://st-westus3.azurewebsites.net/probes?siteurl=" + url;

    var urlToGetDataForOneProbe = "https://st-westus3.azurewebsites.net/probe?url=" + url;
    var urlToGetDataForSitePreview = "https://st-westus3.azurewebsites.net/sites?take=1";

   

  }
  else {

    $("#mainBreadcrumb").hide();
    //$("h1").text("Hello " + document.location.pathname);
/*
    $.post("https://st-westus3.azurewebsites.net/graphql",
     `
     {"operationName":null,"variables":{},"query":"{  probes(take: 11) {    id    sourceIpAddress    destinationIpAddress    latencyInChrome    siteId    site {      dateCreated    }  }}"}
    `,
      function( data ) {
      RenderProbesInGrid( data ); 
    }, "json");
  */

  $.ajax({
    type: "POST",
    url: "https://st-westus3.azurewebsites.net/graphql",
    data:  `
    {"operationName":null,"variables":{},"query":"{  probes(take: 6) {    id uniqueGuid   sourceIpAddress    destinationIpAddress    latencyInChrome    siteId    site {      url title    }  }}"}
   `,
    success: function( data ) {
      var template = ($ as any).templates("#theTmpl");
    
      var htmlOutput = template.render(data.data.probes);

      
      $("#sitesRow").html(htmlOutput);
  },
    dataType: "json",
    contentType: "application/json"
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