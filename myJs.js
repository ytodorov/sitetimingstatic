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
    $(window).on("scroll", function () {
        var mainSection = $("#mainSection");
        if (mainSection.is(":visible") && mainSection.hasClass("loadingMarker")) {
            mainSection.removeClass("loadingMarker");
            $.ajax({
                type: "POST",
                url: "https://st-westus3.azurewebsites.net/graphql",
                data: `
    {"operationName":null,"variables":{},"query":"{  probes(take: 6) {    id uniqueGuid   sourceIpAddress    destinationIpAddress exceptionMessage    latencyInChrome    siteId    site {      url title    }  }}"}
   `,
                success: function (data) {
                    var template = $.templates("#theTmpl");
                    var htmlOutput = template.render(data.data.probes);
                    $("#sitesRow").html(htmlOutput);
                },
                dataType: "json",
                contentType: "application/json"
            });
        }
    });
    if (document.location.pathname != "/" && document.location.pathname != "") {
        var url = document.location.pathname.substring(1);
        url = url.toLowerCase();
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = `http://${url}`;
        }
        //url = "http://apple.com";
        $("h1").text(url);
        var urlToGetDataForOneProbe = "https://st-westus3.azurewebsites.net/probe?url=" + url;
        $("#pageTitle").removeClass("invisible");
        $("#liSiteName").text(url);
        $("#sectionWithSearchTextbox").remove();
        $("#sectionWithServices").remove();
        $("#sectionWithCounter").remove();
        $("#sitesRow").remove();
        $.get(urlToGetDataForOneProbe, function (data) {
            $.ajax({
                type: "POST",
                url: "https://st-westus3.azurewebsites.net/graphql",
                data: `
    {"operationName":null,"variables":{},"query":"{  probes(where: \\"site.url = \\\\\\"${url}\\\\\\"\\") {    id dateCreated sourceIpAddress  destinationIpAddress    latencyInChrome   }}"}
   `,
                success: function (probesData) {
                    RenderProbesInGrid(probesData.data.probes);
                },
                dataType: "json",
                contentType: "application/json"
            });
        });
    }
    else {
        $("#mainBreadcrumb").hide();
    }
});
function RenderProbesInGrid(data) {
    var htmlToRender = `<table class="table">
  <thead>
    <tr>     
      <th scope="col">Time</th>
      <th scope="col">Latency</th>
      <th scope="col">Source IP</th>
      <th scope="col">Destination IP</th>     
    </tr>
  </thead>
  <tbody>`;
    var template = $.templates("#templateProbeRow");
    var htmlOutput = template.render(data);
    htmlToRender += htmlOutput;
    htmlToRender += `</tbody>
  </table>`;
    $("#singleSiteRow").html(htmlToRender);
    // if (data[0] && data[0].site && data[0].site.lastProbe) {
    //   var template = ($ as any).templates("#theTmpl");
    //   var htmlOutput = template.render(data.site);
    //   $("#sitesRow").html(htmlOutput);
    // }
}
