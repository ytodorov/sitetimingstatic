"use strict";
$(function () {
    $('#tbCheckWebSite').on("keypress", function (event) {
        if (event.key == 'Enter') {
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
            var template = $.templates("#theTmpl");
            var htmlOutput = template.render(data);
            $("#sitesRow").html(htmlOutput);
        });
    }
});
function RenderProbesInGrid(data) {
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
    var template = $.templates("#templateProbeRow");
    var htmlOutput = template.render(data);
    htmlToRender += htmlOutput;
    htmlToRender += `</tbody>
  </table>`;
    $("#singleSiteRow").html(htmlToRender);
    if (data[0] && data[0].site && data[0].site.lastProbe) {
        var template = $.templates("#theTmpl");
        var htmlOutput = template.render(data.site);
        $("#sitesRow").html(htmlOutput);
    }
}
