/// <reference types="kendo-ui" />
var url = document.location.pathname.substring(1);
url = url.toLowerCase();
if (document.location.hostname.toLowerCase().includes("127.0.0.1") == false) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `http://${url}`;
    document.location = "/" + url;
  }
}

($("#breadcrumb") as any).kendoBreadcrumb({
    navigational: true,
    items: [
        {
            type: "rootitem",
            href: "/",
            text: "Home",
            showText: true,
            icon: "home",
            showIcon: true
        },
        {
            type: "item",
            href: "/sites",
            text: "Sites",
            showText: true
        },
        {
            type: "item",
            href: `${url}`,
            text: `${url}`,
            showText: true
        }
    ]
});


var largeLoader = $('#loader-large').kendoLoader({visible:true,
    type: "pulsing",
    size: 'large'
}).data("kendoLoader");

function createChart() {
    $("#chart").kendoChart({
        dataSource: {
           schema: {
    data: function(response : any) {
      return response.data.probes;
    }
  },
            transport: {
                read: {
                    url: `https://st-westus3.azurewebsites.net/graphql?query={probes(take:20,where:"site.url=\\\"${url}\\\""){id, latencyInChrome dateCreated dOMContentLoadedEventInChrome sourceIpAddress}}`,
                    dataType: "json"
                }
            },                    
            sort: {
                field: "id",
                dir: "asc"
            }
        },
        title: {
            text: `Latency of ${url}`
        },
        legend: {
            position: "top"
        },
        seriesDefaults: {
            type: "line"
        },
        series: [{
            field: "latencyInChrome",
            categoryField: "dateCreated",
            name: "latency"
        },
        {
            field: "dOMContentLoadedEventInChrome",
            categoryField: "dateCreated",
            name: "dom loaded",
        }],
        categoryAxis: {
            labels: {
                rotation: -45,     
                dateFormats: {
                    days: "M/d"
                }    
            },
            crosshair: {
                visible: true
            }
        },
        valueAxis: {
            labels: {
                format: "N0"
            },                   
        },
        tooltip: {
            visible: true,
            shared: true,
            format: "N0"
        }
    });
}

$(document).ready(createChart);


$(window).resize(function(){
    debugger;
    var kendoChart = $("#chart").data("kendoChart");
    if (kendoChart)
    { 
        kendoChart.refresh();
    }
});

var urlwestus3 = `https://st-westus3.azurewebsites.net/probe?url=${url}`;
var urleastus2 = `https://st-eastus2.azurewebsites.net/probe?url=${url}`;
var urlsoutheastasia = `https://st-southeastasia.azurewebsites.net/probe?url=${url}`;
$.get(urlwestus3, function (data) {console.log(data)});
$.get(urleastus2, function (data) {console.log(data)});
$.get(urlsoutheastasia, function (data) {console.log(data)});