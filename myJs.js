"use strict";
$(function () {
    $("#tbCheckWebSite").on("keypress", function (event) {
        if (event.key == "Enter") {
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
                url: "https://containerappeastus.yellowmoss-bb737f56.eastus.azurecontainerapps.io/graphql",
                data: `
    {"operationName":null,"variables":{},"query":"{  probes(take: 6) {    id uniqueGuid   sourceIpAddress    destinationIpAddress exceptionMessage    latencyInChrome    siteId    site {      url title    }  }}"}
   `,
                success: function (data) {
                    var template = $.templates("#theTmpl");
                    var htmlOutput = template.render(data.data.probes);
                    $("#sitesRow").html(htmlOutput);
                },
                dataType: "json",
                contentType: "application/json",
            });
        }
    });
    if (document.location.pathname != "/" && document.location.pathname != "") {
        var url = document.location.pathname.substring(1);
        url = url.toLowerCase();
        if (document.location.hostname.toLowerCase().indexOf("localhost") == 0) {
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = `http://${url}`;
                document.location = "/" + url;
            }
        }
        $("h1").text(url);
        var urlToGetDataForOneProbe = "https://containerappeastus.yellowmoss-bb737f56.eastus.azurecontainerapps.io/probe?url=" +
            url;
        $("#pageTitle").removeClass("invisible");
        $("#liSiteName").text(url);
        $("#sectionWithSearchTextbox").remove();
        $("#sectionWithServices").remove();
        $("#sectionWithCounter").remove();
        $("#sitesRow").remove();
        //   $.get(urlToGetDataForOneProbe, function (data) {
        //     $.ajax({
        //       type: "POST",
        //       url: "https://containerappeastus.yellowmoss-bb737f56.eastus.azurecontainerapps.io/graphql",
        //       data: `
        //   {"operationName":null,"variables":{},"query":"{  probes(where: \\"site.url = \\\\\\"${url}\\\\\\"\\") {    id dateCreated sourceIpAddress  destinationIpAddress    latencyInChrome   }}"}
        //  `,
        //       success: function (probesData) {
        //         //RenderProbesInGrid(probesData.data.probes);
        //       },
        //       dataType: "json",
        //       contentType: "application/json"
        //     });
        //   })
    }
    else {
        $("#mainBreadcrumb").hide();
    }
});
$(document).ready(function () {
    var currentUrl = document.location.pathname.substring(1);
    currentUrl = "https://google.com";
    var q = `probes(take:100) {    id dateCreated sourceIpAddress  destinationIpAddress    latencyInChrome   }`;
    var READ_PRODUCTS_QUERY = "query {" + q + "}";
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                contentType: "application/json",
                url: "https://containerappeastus.yellowmoss-bb737f56.eastus.azurecontainerapps.io/graphql",
                type: "POST",
                data: function () {
                    return { query: READ_PRODUCTS_QUERY };
                },
            },
            parameterMap: function (options, operation) {
                return kendo.stringify({
                    query: options.query,
                    variables: options.variables,
                });
            },
        },
        schema: {
            data: function (response) {
                var data = response.data;
                if (data.probes) {
                    return data.probes;
                }
            },
            total: function (response) {
                return response.data.probes.length;
            },
            model: {
                id: "id",
                fields: {
                    id: { type: "number", editable: false },
                    latencyInChrome: { type: "number" },
                },
            },
        },
        pageSize: 20,
    });
    $("#grid").kendoGrid({
        dataSource: dataSource,
        height: 550,
        groupable: true,
        sortable: true,
        pageable: true,
        toolbar: ["create"],
        editable: "inline",
        columns: [
            {
                field: "id",
                title: "id",
            },
            {
                field: "latencyInChrome",
                title: "latencyInChrome",
            },
        ],
    });
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
}
