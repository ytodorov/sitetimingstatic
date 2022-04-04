/// <reference types="kendo-ui" />
var url = document.location.pathname.substring(1);
url = url.toLowerCase();
if (document.location.hostname.toLowerCase().includes("127.0.0.1") == false) {
  if (url.startsWith("https://www.")) {
    url = url.substring("https://www.".length);
    document.location = "/" + url;
  }
  if (url.startsWith("http://www.")) {
    url = url.substring("http://www.".length);
    document.location = "/" + url;
  }
  if (url.startsWith("http://")) {
    url = url.substring("http://".length);
    document.location = "/" + url;
  }
  if (url.startsWith("https://")) {
    url = url.substring("https://".length);
    document.location = "/" + url;
  }
  if (url.startsWith("www.")) {
    url = url.substring("www.".length);
    document.location = "/" + url;
  }
}

$(function () {
  $("title").text(`SiteTiming - ${url}`);
  $("#panelbar").removeClass("d-none");
  $("#panelbar").kendoPanelBar({
    expandMode: "multi",
  });

  ($("#breadcrumb") as any).kendoBreadcrumb({
    navigational: true,
    items: [
      {
        type: "rootitem",
        href: "/",
        text: "SiteTiming",
        showText: true,
        showIcon: false,
      },
      {
        type: "item",
        href: "/sites",
        text: "Sites",
        showText: true,
      },
      {
        type: "item",
        href: `${url}`,
        text: `${url}`,
        showText: true,
      },
    ],
  });

  function createGrid() {
    $("[data-type=grid]").each(function () {
      var currentGrid = $(this);
      var probeId = currentGrid.attr("data-probeId");
      if (probeId) {
        var dataSource = getDatasource(probeId);

        currentGrid.kendoGrid({
          dataSource: dataSource,
          groupable: false,
          sortable: false,
          pageable: false,
          columns: [
            {
              field: "type",
              title: "type",
            },
            {
              field: "text",
              title: "text",
            },
          ],
        });
      }
    });
  }

  function createChart() {
    $("[data-type=chart]").each(function () {
      var currentChart = $(this);

      var ip = currentChart.attr("data-ip");
      //ip = "20.54.123.54";
      var andString = "&&";
      var serverUrl = StaticMethods.getRandomServerUrlNoEndingSlash();
      //ip = "20.54.123.54";
      //url = "google.com";
      var urlQuery = `${serverUrl}/graphql?query={probes(take:10, where:"SourceIpAddress=\\\"${ip}\\\" and Site.Url=\\\"http://${url}\\\""){id dateCreated dateCreatedFormatted latencyInChrome dOMContentLoadedEventInChrome}}`;

      currentChart.kendoChart({
        dataSource: {
          schema: {
            data: function (response: any) {
              return response.data.probes;
            },
          },
          transport: {
            read: {
              url: urlQuery,

              dataType: "json",
            },
          },
          sort: {
            field: "id",
            dir: "asc",
          },
        },
        title: {
          text: `Latency of ${url}`,
        },
        legend: {
          position: "top",
        },
        seriesDefaults: {
          type: "line",
        },
        series: [
          {
            field: "latencyInChrome",
            categoryField: "dateCreatedFormatted",
            name: "latency",
          },
          {
            field: "dOMContentLoadedEventInChrome",
            categoryField: "dateCreatedFormatted",
            name: "dom loaded",
          },
        ],
        categoryAxis: {
          labels: {
            visible: true,
            rotation: -90,
          },
          crosshair: {
            visible: true,
          },
        },
        valueAxis: {
          labels: {
            format: "N0",
          },
        },
        tooltip: {
          visible: true,
          shared: true,
          format: "N0",
        },
      });
    });
  }

  $(window).on("resize", function () {
    var kendoChart = $("#chart").data("kendoChart");
    if (kendoChart) {
      kendoChart.refresh();
    }
  });

  $(".skeletonMarker").each(function (index) {
    var text = $(this).attr("data-location");
    $(this).kendoSkeletonContainer({
      animation: "pulse",
      template: `<div class="k-card">      
                            <span data-shape-rectangle style="width: 340px; height: 100%;"></span>
                            <div class="k-card-body">
                                <span data-shape-text></span>
                            </div>
                            <div class="k-card-body">
                            <span data-shape-text></span>
                        </div>
                        <div class="k-card-body">
                        <span data-shape-text></span>
                    </div>
                        </div>`,
    });
  });

  let urleastus2 = `https://containerappeastus2.politeflower-c7227859.eastus2.azurecontainerapps.io/probe?url=${url}`;
  let urlcentralcanada = `https://containerappcanadacentral.happyrock-5d18c325.canadacentral.azurecontainerapps.io/probe?url=${url}`;
  let urlnortheurope = `https://containerappnortheurope.whitedune-748c223c.northeurope.azurecontainerapps.io/probe?url=${url}`;
  let urlwesteurope = `https://containerappwesteurope.nicepond-330ead69.westeurope.azurecontainerapps.io/probe?url=${url}`;
  var urleastus2Data: any;
  var urlcentralcanadaData: any;
  var urlwesteuropeData: any;
  var urlnortheuropeData: any;
  $.when(
    $.get(urleastus2, function (data) {
      urleastus2Data = data;
      $("#eastus2").remove();
      $("#divEastUS").prepend(getStringHtmlForSite(data));
    }),

    $.get(urlcentralcanada, function (data) {
      urlcentralcanadaData = data;
      $("#centralcanada").remove();
      $("#divCentralCanada").prepend(getStringHtmlForSite(data));
    }),
    $.get(urlwesteurope, function (data) {
      urlwesteuropeData = data;
      $("#westeurope").remove();
      $("#divWestEurope").prepend(getStringHtmlForSite(data));
    }),
    $.get(urlnortheurope, function (data) {
      urlnortheuropeData = data;
      $("#northeurope").remove();
      $("#divNorthEurope").prepend(getStringHtmlForSite(data));
    })
  ).done(function () {
    $("#map").kendoMap({
      center: [30.268107, -37.744821],
      zoom: 2,
      layers: [
        {
          type: "tile",
          urlTemplate:
            "https://#= subdomain #.tile.openstreetmap.org/#= zoom #/#= x #/#= y #.png",
          subdomains: ["a", "b", "c"],
          attribution:
            "&copy; <a href='https://osm.org/copyright'>OpenStreetMap contributors</a>",
        },
      ],
      markers: [
        getLocationData(urlcentralcanadaData, true),
        getLocationData(urlcentralcanadaData, false),
        getLocationData(urleastus2Data, true),
        getLocationData(urleastus2Data, false),
        getLocationData(urlwesteuropeData, true),
        getLocationData(urlwesteuropeData, false),
        getLocationData(urlnortheuropeData, true),
        getLocationData(urlnortheuropeData, false),
      ],
    });

    $(".k-i-marker-pin-target").css("color", "green");
    createChart();
    createGrid();
  });
});

function getDatasource(probeId: string): kendo.data.DataSource {
  var probeIdInt = Number.parseInt(probeId);
  var serverUrl = StaticMethods.getRandomServerUrlNoEndingSlash();
  let READ_PRODUCTS_QUERY =
    "query {" +
    `consoleMessages(take: 100, where: "probeId=${probeIdInt}"){type text probeId}` +
    "}";

  let dataSource = new kendo.data.DataSource({
    transport: {
      read: {
        contentType: "application/json",
        url: `${serverUrl}/graphql`,
        type: "POST",
        data: function () {
          return { query: READ_PRODUCTS_QUERY };
        },
      },
      parameterMap: function (options: any) {
        return kendo.stringify({
          query: options.query,
          variables: options.variables,
        });
      },
    },
    schema: {
      data: function (response: any) {
        var data = response.data;

        if (data.consoleMessages) {
          return data.consoleMessages;
        }
      },
      total: function (response: any) {
        return response.data.consoleMessages.length;
      },
      model: {
        id: "id",
        fields: {
          id: { type: "number", editable: false },
          text: { type: "string" },
          type: { type: "string" },
        },
      },
    },
    pageSize: 10,
  });

  return dataSource;
}

function getStringHtmlForSite(data: any): string {
  var result = ` 
<div class="row">
      <div class="col-12 text-center">
        <div>
      <img class="max-image-size" onerror="if (this.src != 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg') this.src = 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg';" src="https://sitetiming.blob.core.windows.net/images/short50_${
        data.uniqueGuid
      }.jpeg?sv=2020-08-04&st=2012-01-27T12%3A30%3A00Z&se=2032-01-28T12%3A30%3A00Z&sr=c&sp=rl&sig=jvKd8yqdiz42u28l4oPYHVFWUSCaeLYmeKMMCgwtn1Y%3D" />
        </div>
      </div>
      <div class="col-12">
      
      <div data-type="chart" data-ip="${data.sourceIpAddress}"></div>

      </div>
      <div class="col-12">

      <div data-type="grid" data-probeId="${data.id}"></div>

      </div>
      <div class="col-12">

       <div>
        <h6 class="k-card-subtitle">Latency: ${data.latencyInChrome}</h6>
      
            <h6 class="k-card-subtitle">DOM Loaded: ${
              data.domContentLoadedEventInChrome
            }</h6>
            <h6 class="k-card-subtitle">SourceIpAddress: ${
              data.sourceIpAddress
            }(${data.sourceIpAddressCity},${data.sourceIpAddressCountry})</h6>
            <h6 class="k-card-subtitle">DestinationIpAddress: ${
              data.destinationIpAddress
            }(${data.destinationIpAddressCity},${
    data.destinationIpAddressCountry
  })</h6>
             <h6 class="k-card-subtitle">Org: ${
               data.destinationIpAddressOrg
             }</h6>
            <h6 class="k-card-subtitle">Distance b/w IPs: ${
              data.distanceBetweenIpAddresses
            }</h6>
            <h6 class="k-card-subtitle">${
              data.exceptionMessage ? "" : data.exceptionMessage
            }</h6>
      </div>

      </div>
    </div>`;
  return result;
}

function getLocationData(data: any, isSourceData: boolean): any {
  var result: any;
  if (isSourceData) {
    result = {
      location: [data.sourceIpAddressLatitude, data.sourceIpAddressLongitude],
      shape: "pin",
      tooltip: {
        content: `
          city: ${data.sourceIpAddressCity}<br>
          region: ${data.sourceIpAddressRegion}<br>
          country: ${data.sourceIpAddressCountry}<br>
          postal: ${data.sourceIpAddressPostal}<br>
          timezone: ${data.sourceIpAddressTimezone}<br>
          org: ${data.sourceIpAddressOrg}<br>
          distance: ${data.distanceBetweenIpAddresses}<br>`,
      },
    };
  } else {
    result = {
      location: [
        data.destinationIpAddressLatitude,
        data.destinationIpAddressLongitude,
      ],
      shape: "pinTarget",
      tooltip: {
        content: `
          city: ${data.destinationIpAddressCity}<br>
          region: ${data.destinationIpAddressRegion}<br>
          country: ${data.destinationIpAddressCountry}<br>
          postal: ${data.destinationIpAddressPostal}<br>
          timezone: ${data.destinationIpAddressTimezone}<br>
          org: ${data.destinationIpAddressOrg}`,
      },
    };
  }

  return result;
}
