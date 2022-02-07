"use strict";
/// <reference types="kendo-ui" />
var url = document.location.pathname.substring(1);
url = url.toLowerCase();
if (document.location.hostname.toLowerCase().includes("127.0.0.1") == false) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `http://${url}`;
        document.location = "/" + url;
    }
}
$("#breadcrumb").kendoBreadcrumb({
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
//var largeLoader = $('#loader-large').kendoLoader({visible:true,
//    type: "pulsing",
//    size: 'large'
//}).data("kendoLoader");
function createChart() {
    $("#chart").kendoChart({
        dataSource: {
            schema: {
                data: function (response) {
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
                rotation: -90
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
$(window).resize(function () {
    debugger;
    var kendoChart = $("#chart").data("kendoChart");
    if (kendoChart) {
        kendoChart.refresh();
    }
});
$(".skeletonMarker").each(function (index) {
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
                        </div>`
    });
});
var urlwestus3 = `https://st-westus3.azurewebsites.net/probe?url=${url}`;
var urleastus2 = `https://st-eastus2.azurewebsites.net/probe?url=${url}`;
var urlsoutheastasia = `https://st-southeastasia.azurewebsites.net/probe?url=${url}`;
$.when($.get(urlwestus3, function (data) {
    $("#skeletonwestus3").remove();
    $("#cards").append(` <div class="k-card">
        <img class="k-card-image" onerror="if (this.src != 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg') this.src = 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg';" src="https://sitetiming.blob.core.windows.net/images/short50_${data.uniqueGuid}.jpeg?sv=2020-08-04&st=2012-01-27T12%3A30%3A00Z&se=2032-01-28T12%3A30%3A00Z&sr=c&sp=rl&sig=jvKd8yqdiz42u28l4oPYHVFWUSCaeLYmeKMMCgwtn1Y%3D" />
        <div class="k-card-body">
            <h6 class="k-card-subtitle">Latency: ${data.latencyInChrome}</h6>
            <h6 class="k-card-subtitle">DOM Loaded: ${data.domContentLoadedEventInChrome}</h6>
            <h6 class="k-card-subtitle">SourceIpAddress: ${data.sourceIpAddress} (West US)</h6>
            <h6 class="k-card-subtitle">DestinationIpAddress: ${data.destinationIpAddress}</h6>
            <h6 class="k-card-subtitle">Error: ${data.exceptionMessage}</h6>
        </div>
    </div>`);
    //var kendoChart = $("#chart").data("kendoChart");
    //kendoChart?.dataSource.read();
    console.log("urlwestus3");
    console.log(data);
}), $.get(urleastus2, function (data) {
    $("#skeletoneastus2").remove();
    $("#cards").append(` <div class="k-card">
        <img class="k-card-image" onerror="if (this.src != 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg') this.src = 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg';" src="https://sitetiming.blob.core.windows.net/images/short50_${data.uniqueGuid}.jpeg?sv=2020-08-04&st=2012-01-27T12%3A30%3A00Z&se=2032-01-28T12%3A30%3A00Z&sr=c&sp=rl&sig=jvKd8yqdiz42u28l4oPYHVFWUSCaeLYmeKMMCgwtn1Y%3D" />
        <div class="k-card-body">
            <h6 class="k-card-subtitle">Latency: ${data.latencyInChrome}</h6>
            <h6 class="k-card-subtitle">DOM Loaded: ${data.domContentLoadedEventInChrome}</h6>
            <h6 class="k-card-subtitle">SourceIpAddress: ${data.sourceIpAddress} (East US)</h6>
            <h6 class="k-card-subtitle">DestinationIpAddress: ${data.destinationIpAddress}</h6>
            <h6 class="k-card-subtitle">Error: ${data.exceptionMessage}</h6>
        </div>
    </div>`);
    //var kendoChart = $("#chart").data("kendoChart");
    //kendoChart?.dataSource.read();
    console.log("urleastus2");
    console.log(data);
}), $.get(urlsoutheastasia, function (data) {
    $("#skeletonsoutheastasia").remove();
    $("#cards").append(` <div class="k-card">
        <img class="k-card-image" onerror="if (this.src != 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg') this.src = 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg';" src="https://sitetiming.blob.core.windows.net/images/short50_${data.uniqueGuid}.jpeg?sv=2020-08-04&st=2012-01-27T12%3A30%3A00Z&se=2032-01-28T12%3A30%3A00Z&sr=c&sp=rl&sig=jvKd8yqdiz42u28l4oPYHVFWUSCaeLYmeKMMCgwtn1Y%3D" />
        <div class="k-card-body">
            <h6 class="k-card-subtitle">Latency: ${data.latencyInChrome}</h6>
            <h6 class="k-card-subtitle">DOM Loaded: ${data.domContentLoadedEventInChrome}</h6>
            <h6 class="k-card-subtitle">SourceIpAddress: ${data.sourceIpAddress} (Southeast Asia)</h6>
            <h6 class="k-card-subtitle">DestinationIpAddress: ${data.destinationIpAddress}</h6>
            <h6 class="k-card-subtitle">Error: ${data.exceptionMessage}</h6>
        </div>
    </div>`);
    //var kendoChart = $("#chart").data("kendoChart");
    //kendoChart?.dataSource.read();
    console.log("urlsoutheastasia");
    console.log(data);
})).done(function () {
    var kendoChart = $("#chart").data("kendoChart");
    kendoChart === null || kendoChart === void 0 ? void 0 : kendoChart.dataSource.read();
    console.log("done");
});
