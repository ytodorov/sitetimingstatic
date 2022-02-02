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


$("#skeletonwestus3").kendoSkeletonContainer({
    animation: "pulse",
    template: `<div class="k-card">
                        <div class="k-card-header">
                            <div>
                                <span data-shape-circle class="k-card-image avatar"></span>
                            </div>
                            <div class="user-info" style="width: 100%;">
                                <span data-shape-text class='k-card-title'></span>
                                <span data-shape-text class='k-card-subtitle' style="width: 35%;"></span>
                            </div>
                        </div>
                        <span data-shape-rectangle style="width: 340px; height: 100%;"></span>
                        <div class="k-card-body">
                            <span data-shape-text></span>
                        </div>
                    </div>`
});

var urlwestus3 = `https://st-westus3.azurewebsites.net/probe?url=${url}`;
var urleastus2 = `https://st-eastus2.azurewebsites.net/probe?url=${url}`;
var urlsoutheastasia = `https://st-southeastasia.azurewebsites.net/probe?url=${url}`;

$.get(urlwestus3, function (data) {
    $("#skeletonwestus3").remove();
    $("#cards").html(
        ` <div class="k-card">
        <div class="k-card-header">
            <div>
                <img class="k-card-image avatar" src="https://demos.telerik.com/kendo-ui/content/web/skeleton/avatar.jpg" />
            </div>
            <div class="user-info">
                <h5 class="k-card-title">latencyInChrome: ${data.latencyInChrome}</h5>
                <h6 class="k-card-subtitle">${data.dateCreatedAgo}</h6>
            </div>
        </div>
        <img class="k-card-image" src="https://sitetiming.blob.core.windows.net/images/short5_${data.uniqueGuid}.jpeg?sv=2020-08-04&st=2012-01-27T12%3A30%3A00Z&se=2032-01-28T12%3A30%3A00Z&sr=c&sp=rl&sig=jvKd8yqdiz42u28l4oPYHVFWUSCaeLYmeKMMCgwtn1Y%3D" />
        <div class="k-card-body">
            <p>dOMContentLoadedEventInChrome: ${data.dOMContentLoadedEventInChrome}</p>
        </div>
    </div>`
    );
    console.log(data)
});
$.get(urleastus2, function (data) {console.log(data)});
$.get(urlsoutheastasia, function (data) {console.log(data)});