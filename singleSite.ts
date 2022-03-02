/// <reference types="kendo-ui" />
var url = document.location.pathname.substring(1);
url = url.toLowerCase();
if (document.location.hostname.toLowerCase().includes("127.0.0.1") == false) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `http://${url}`;
    document.location = "/" + url;
  }
}

$("title").text(`SiteTiming - ${url}`);

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

//var largeLoader = $('#loader-large').kendoLoader({visible:true,
//    type: "pulsing",
//    size: 'large'
//}).data("kendoLoader");

function createChart() {
  $("#chart").kendoChart({
    dataSource: {
      schema: {
        data: function (response: any) {
          return response.data.probes;
        },
      },
      transport: {
        read: {
          url: `https://st-westus3.azurewebsites.net/graphql?query={probes(take:20,where:"site.url=\\\"${url}\\\""){id, latencyInChrome dateCreated dOMContentLoadedEventInChrome sourceIpAddress}}`,
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
        categoryField: "dateCreated",
        name: "latency",
      },
      {
        field: "dOMContentLoadedEventInChrome",
        categoryField: "dateCreated",
        name: "dom loaded",
      },
    ],
    categoryAxis: {
      labels: {
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
}

$(document).ready(createChart);

$(window).resize(function () {
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
                                    <div class="k-card-header">
                                           ${text}
                                    </div>                  
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
    $("#cards").prepend(
      ` <div class="k-card">
           <div class="k-card-header">
                    <h5 class="k-card-title">East US</h5>
          </div>
        <img class="k-card-image" onerror="if (this.src != 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg') this.src = 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg';" src="https://sitetiming.blob.core.windows.net/images/short50_${data.uniqueGuid}.jpeg?sv=2020-08-04&st=2012-01-27T12%3A30%3A00Z&se=2032-01-28T12%3A30%3A00Z&sr=c&sp=rl&sig=jvKd8yqdiz42u28l4oPYHVFWUSCaeLYmeKMMCgwtn1Y%3D" />
        <div class="k-card-body">
            <h6 class="k-card-subtitle">Latency: ${data.latencyInChrome}</h6>
            <h6 class="k-card-subtitle">DOM Loaded: ${data.domContentLoadedEventInChrome}</h6>
            <h6 class="k-card-subtitle">DestinationIpAddress: ${data.destinationIpAddress}</h6>
            <h6 class="k-card-subtitle">${data.exceptionMessage}</h6>
        </div>
    </div>`
    );
  }),

  $.get(urlcentralcanada, function (data) {
    urlcentralcanadaData = data;
    $("#centralcanada").remove();
    $("#cards").prepend(
      ` <div class="k-card">
             <div class="k-card-header">
                    <h5 class="k-card-title">Central Canada</h5>
          </div>
        <img class="k-card-image" onerror="if (this.src != 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg') this.src = 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg';" src="https://sitetiming.blob.core.windows.net/images/short50_${data.uniqueGuid}.jpeg?sv=2020-08-04&st=2012-01-27T12%3A30%3A00Z&se=2032-01-28T12%3A30%3A00Z&sr=c&sp=rl&sig=jvKd8yqdiz42u28l4oPYHVFWUSCaeLYmeKMMCgwtn1Y%3D" />
        <div class="k-card-body">
            <h6 class="k-card-subtitle">Latency: ${data.latencyInChrome}</h6>
            <h6 class="k-card-subtitle">DOM Loaded: ${data.domContentLoadedEventInChrome}</h6>
            <h6 class="k-card-subtitle">DestinationIpAddress: ${data.destinationIpAddress}</h6>
            <h6 class="k-card-subtitle">${data.exceptionMessage}</h6>
        </div>
    </div>`
    );
  }),
  $.get(urlwesteurope, function (data) {
    urlwesteuropeData = data;
    $("#westeurope").remove();
    $("#cards").prepend(
      ` <div class="k-card">
             <div class="k-card-header">
                    <h5 class="k-card-title">West Europe</h5>
          </div>
        <img class="k-card-image" onerror="if (this.src != 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg') this.src = 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg';" src="https://sitetiming.blob.core.windows.net/images/short50_${data.uniqueGuid}.jpeg?sv=2020-08-04&st=2012-01-27T12%3A30%3A00Z&se=2032-01-28T12%3A30%3A00Z&sr=c&sp=rl&sig=jvKd8yqdiz42u28l4oPYHVFWUSCaeLYmeKMMCgwtn1Y%3D" />
        <div class="k-card-body">
            <h6 class="k-card-subtitle">Latency: ${data.latencyInChrome}</h6>
            <h6 class="k-card-subtitle">DOM Loaded: ${data.domContentLoadedEventInChrome}</h6>
            <h6 class="k-card-subtitle">DestinationIpAddress: ${data.destinationIpAddress}</h6>
            <h6 class="k-card-subtitle">${data.exceptionMessage}</h6>
        </div>
    </div>`
    );
  }),
  $.get(urlnortheurope, function (data) {
    urlnortheuropeData = data;
    $("#northeurope").remove();
    $("#cards").prepend(
      ` <div class="k-card">
             <div class="k-card-header">
                    <h5 class="k-card-title">North Europe</h5>
          </div>
        <img class="k-card-image" onerror="if (this.src != 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg') this.src = 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg';" src="https://sitetiming.blob.core.windows.net/images/short50_${data.uniqueGuid}.jpeg?sv=2020-08-04&st=2012-01-27T12%3A30%3A00Z&se=2032-01-28T12%3A30%3A00Z&sr=c&sp=rl&sig=jvKd8yqdiz42u28l4oPYHVFWUSCaeLYmeKMMCgwtn1Y%3D" />
        <div class="k-card-body">
            <h6 class="k-card-subtitle">Latency: ${data.latencyInChrome}</h6>
            <h6 class="k-card-subtitle">DOM Loaded: ${data.domContentLoadedEventInChrome}</h6>
            <h6 class="k-card-subtitle">DestinationIpAddress: ${data.destinationIpAddress}</h6>
            <h6 class="k-card-subtitle">${data.exceptionMessage}</h6>
        </div>
    </div>`
    );
  })
).done(function () {
  var kendoChart = $("#chart").data("kendoChart");
  kendoChart?.dataSource.read();
  console.log("done");

  var urlcentralcanadaDataSourceIpAddress: IpInfo;
  var urlcentralcanadaDataDestinationIpAddress: IpInfo;
  var urleastus2DataSourceIpAddress: IpInfo;
  var urleastus2DataDestinationIpAddress: IpInfo;
  var urlnortheuropeDataSourceIpAddress: IpInfo;
  var urlnortheuropeDataDestinationIpAddress: IpInfo;
  var urlwesteuropeDataDataSourceIpAddress: IpInfo;
  var urlwesteuropeDataDataDestinationIpAddress: IpInfo;
  $.when(
    $.getJSON(
      `https://containerappcanadacentral.happyrock-5d18c325.canadacentral.azurecontainerapps.io/ip?ip=${urlcentralcanadaData.sourceIpAddress}`,
      function f(res) {
        console.log(res);

        urlcentralcanadaDataSourceIpAddress = new IpInfo(res);
      }
    ),
    $.getJSON(
      `https://containerappcanadacentral.happyrock-5d18c325.canadacentral.azurecontainerapps.io/ip?ip=${urlcentralcanadaData.destinationIpAddress}`,
      function f(res) {
        console.log(res);

        urlcentralcanadaDataDestinationIpAddress = new IpInfo(res);
      }
    ),
    $.getJSON(
      `https://containerappeastus2.politeflower-c7227859.eastus2.azurecontainerapps.io/ip?ip=${urleastus2Data.sourceIpAddress}`,
      function f(res) {
        console.log(res);

        urleastus2DataSourceIpAddress = new IpInfo(res);
      }
    ),
    $.getJSON(
      `https://containerappeastus2.politeflower-c7227859.eastus2.azurecontainerapps.io/ip?ip=${urleastus2Data.destinationIpAddress}`,
      function f(res) {
        console.log(res);

        urleastus2DataDestinationIpAddress = new IpInfo(res);
      }
    ),
    $.getJSON(
      `https://containerappnortheurope.whitedune-748c223c.northeurope.azurecontainerapps.io/ip?ip=${urlnortheuropeData.sourceIpAddress}`,
      function f(res) {
        console.log(res);

        urlnortheuropeDataSourceIpAddress = new IpInfo(res);
      }
    ),
    $.getJSON(
      `https://containerappnortheurope.whitedune-748c223c.northeurope.azurecontainerapps.io/ip?ip=${urlnortheuropeData.destinationIpAddress}`,
      function f(res) {
        console.log(res);

        urlnortheuropeDataDestinationIpAddress = new IpInfo(res);
      }
    ),
    $.getJSON(
      `https://containerappwesteurope.nicepond-330ead69.westeurope.azurecontainerapps.io/ip?ip=${urlwesteuropeData.sourceIpAddress}`,
      function f(res) {
        console.log(res);

        urlwesteuropeDataDataSourceIpAddress = new IpInfo(res);
      }
    ),
    $.getJSON(
      `https://containerappwesteurope.nicepond-330ead69.westeurope.azurecontainerapps.io/ip?ip=${urlwesteuropeData.destinationIpAddress}`,
      function f(res) {
        console.log(res);

        urlwesteuropeDataDataDestinationIpAddress = new IpInfo(res);
      }
    )
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
        {
          location: [
            urlcentralcanadaDataSourceIpAddress.latitude,
            urlcentralcanadaDataSourceIpAddress.longitude,
          ],
          shape: "pin",
          tooltip: {
            content: `
            city:${urlcentralcanadaDataSourceIpAddress.city},
            region: ${urlcentralcanadaDataSourceIpAddress.country},
            country: ${urlcentralcanadaDataSourceIpAddress.country},
            postal: ${urlcentralcanadaDataSourceIpAddress.postal},
            timezone: ${urlcentralcanadaDataSourceIpAddress.timezone},
            hostname: ${urlcentralcanadaDataSourceIpAddress.hostname},
            org: ${urlcentralcanadaDataSourceIpAddress.org}`,
          },
        },
        {
          location: [
            urlcentralcanadaDataDestinationIpAddress.latitude,
            urlcentralcanadaDataDestinationIpAddress.longitude,
          ],
          shape: "pinTarget",
          tooltip: {
            content: `
            city:${urlcentralcanadaDataDestinationIpAddress.city},
            region: ${urlcentralcanadaDataDestinationIpAddress.country},
            country: ${urlcentralcanadaDataDestinationIpAddress.country},
            postal: ${urlcentralcanadaDataDestinationIpAddress.postal},
            timezone: ${urlcentralcanadaDataDestinationIpAddress.timezone},
            hostname: ${urlcentralcanadaDataDestinationIpAddress.hostname},
            org: ${urlcentralcanadaDataDestinationIpAddress.org}`,
          },
        },
        {
          location: [
            urleastus2DataSourceIpAddress.latitude,
            urleastus2DataSourceIpAddress.longitude,
          ],
          shape: "pin",
          tooltip: {
            content: `
            city:${urleastus2DataSourceIpAddress.city},
            region: ${urleastus2DataSourceIpAddress.country},
            country: ${urleastus2DataSourceIpAddress.country},
            postal: ${urleastus2DataSourceIpAddress.postal},
            timezone: ${urleastus2DataSourceIpAddress.timezone},
            hostname: ${urleastus2DataSourceIpAddress.hostname},
            org: ${urleastus2DataSourceIpAddress.org}`,
          },
        },
        {
          location: [
            urleastus2DataDestinationIpAddress.latitude,
            urleastus2DataDestinationIpAddress.longitude,
          ],
          shape: "pinTarget",
          tooltip: {
            content: `
            city:${urleastus2DataDestinationIpAddress.city},
            region: ${urleastus2DataDestinationIpAddress.country},
            country: ${urleastus2DataDestinationIpAddress.country},
            postal: ${urleastus2DataDestinationIpAddress.postal},
            timezone: ${urleastus2DataDestinationIpAddress.timezone},
            hostname: ${urleastus2DataDestinationIpAddress.hostname},
            org: ${urleastus2DataDestinationIpAddress.org}`,
          },
        },
        {
          location: [
            urlnortheuropeDataSourceIpAddress.latitude,
            urlnortheuropeDataSourceIpAddress.longitude,
          ],
          shape: "pin",
          tooltip: {
            content: `
            city:${urlnortheuropeDataSourceIpAddress.city},
            region: ${urlnortheuropeDataSourceIpAddress.country},
            country: ${urlnortheuropeDataSourceIpAddress.country},
            postal: ${urlnortheuropeDataSourceIpAddress.postal},
            timezone: ${urlnortheuropeDataSourceIpAddress.timezone},
            hostname: ${urlnortheuropeDataSourceIpAddress.hostname},
            org: ${urlnortheuropeDataSourceIpAddress.org}`,
          },
        },
        {
          location: [
            urlnortheuropeDataDestinationIpAddress.latitude,
            urlnortheuropeDataDestinationIpAddress.longitude,
          ],
          shape: "pinTarget",
          tooltip: {
            content: `
            city:${urlnortheuropeDataDestinationIpAddress.city},
            region: ${urlnortheuropeDataDestinationIpAddress.country},
            country: ${urlnortheuropeDataDestinationIpAddress.country},
            postal: ${urlnortheuropeDataDestinationIpAddress.postal},
            timezone: ${urlnortheuropeDataDestinationIpAddress.timezone},
            hostname: ${urlnortheuropeDataDestinationIpAddress.hostname},
            org: ${urlnortheuropeDataDestinationIpAddress.org}`,
          },
        },
        {
          location: [
            urlwesteuropeDataDataSourceIpAddress.latitude,
            urlwesteuropeDataDataSourceIpAddress.longitude,
          ],
          shape: "pin",
          tooltip: {
            content: `
            city:${urlwesteuropeDataDataSourceIpAddress.city},
            region: ${urlwesteuropeDataDataSourceIpAddress.country},
            country: ${urlwesteuropeDataDataSourceIpAddress.country},
            postal: ${urlwesteuropeDataDataSourceIpAddress.postal},
            timezone: ${urlwesteuropeDataDataSourceIpAddress.timezone},
            hostname: ${urlwesteuropeDataDataSourceIpAddress.hostname},
            org: ${urlwesteuropeDataDataSourceIpAddress.org}`,
          },
        },
        {
          location: [
            urlwesteuropeDataDataDestinationIpAddress.latitude,
            urlwesteuropeDataDataDestinationIpAddress.longitude,
          ],
          shape: "pinTarget",
          tooltip: {
            content: `
            city:${urlwesteuropeDataDataDestinationIpAddress.city},
            region: ${urlwesteuropeDataDataDestinationIpAddress.country},
            country: ${urlwesteuropeDataDataDestinationIpAddress.country},
            postal: ${urlwesteuropeDataDataDestinationIpAddress.postal},
            timezone: ${urlwesteuropeDataDataDestinationIpAddress.timezone},
            hostname: ${urlwesteuropeDataDataDestinationIpAddress.hostname},
            org: ${urlwesteuropeDataDataDestinationIpAddress.org}`,
          },
        },
      ],
    });
  });
});
