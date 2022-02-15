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
  debugger;
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

//let urlwestus3 = `https://st-westus3.azurewebsites.net/probe?url=${url}`;
let urleastus2 = `https://containerappeastus2.politeflower-c7227859.eastus2.azurecontainerapps.io/probe?url=${url}`;
//let urlsoutheastasia = `https://st-southeastasia.azurewebsites.net/probe?url=${url}`;
let urlcentralcanada = `https://containerappcanadacentral.happyrock-5d18c325.canadacentral.azurecontainerapps.io/probe?url=${url}`;
let urlnortheurope = `https://containerappcanadacentral.happyrock-5d18c325.canadacentral.azurecontainerapps.io/probe?url=${url}`;
let urlwesteurope = `https://containerappwesteurope.nicepond-330ead69.westeurope.azurecontainerapps.io/probe?url=${url}`;

$.when(
  $.get(urleastus2, function (data) {
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
});
