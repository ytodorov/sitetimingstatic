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
$("title").text(`SiteTiming - ${url}`);
$("#breadcrumb").kendoBreadcrumb({
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
                data: function (response) {
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
                format: "yyyy/MM/dd HH:mm",
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
var urleastus2Data;
var urlcentralcanadaData;
var urlwesteuropeData;
var urlnortheuropeData;
$.when($.get(urleastus2, function (data) {
    urleastus2Data = data;
    $("#eastus2").remove();
    $("#cards").prepend(` <div class="k-card">
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
    </div>`);
}), $.get(urlcentralcanada, function (data) {
    urlcentralcanadaData = data;
    $("#centralcanada").remove();
    $("#cards").prepend(` <div class="k-card">
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
    </div>`);
}), $.get(urlwesteurope, function (data) {
    urlwesteuropeData = data;
    $("#westeurope").remove();
    $("#cards").prepend(` <div class="k-card">
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
    </div>`);
}), $.get(urlnortheurope, function (data) {
    urlnortheuropeData = data;
    $("#northeurope").remove();
    $("#cards").prepend(` <div class="k-card">
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
    </div>`);
})).done(function () {
    var kendoChart = $("#chart").data("kendoChart");
    kendoChart === null || kendoChart === void 0 ? void 0 : kendoChart.dataSource.read();
    console.log("done");
    var urlcentralcanadaDataSourceIpAddress;
    var urlcentralcanadaDataDestinationIpAddress;
    var urleastus2DataSourceIpAddress;
    var urleastus2DataDestinationIpAddress;
    var urlnortheuropeDataSourceIpAddress;
    var urlnortheuropeDataDestinationIpAddress;
    var urlwesteuropeDataDataSourceIpAddress;
    var urlwesteuropeDataDataDestinationIpAddress;
    $.when($.getJSON(`https://containerappcanadacentral.happyrock-5d18c325.canadacentral.azurecontainerapps.io/ip?ip=${urlcentralcanadaData.sourceIpAddress}`, function f(res) {
        console.log(res);
        urlcentralcanadaDataSourceIpAddress = new IpInfo(res);
    }), $.getJSON(`https://containerappcanadacentral.happyrock-5d18c325.canadacentral.azurecontainerapps.io/ip?ip=${urlcentralcanadaData.destinationIpAddress}`, function f(res) {
        console.log(res);
        urlcentralcanadaDataDestinationIpAddress = new IpInfo(res);
    }), $.getJSON(`https://containerappeastus2.politeflower-c7227859.eastus2.azurecontainerapps.io/ip?ip=${urleastus2Data.sourceIpAddress}`, function f(res) {
        console.log(res);
        urleastus2DataSourceIpAddress = new IpInfo(res);
    }), $.getJSON(`https://containerappeastus2.politeflower-c7227859.eastus2.azurecontainerapps.io/ip?ip=${urleastus2Data.destinationIpAddress}`, function f(res) {
        console.log(res);
        urleastus2DataDestinationIpAddress = new IpInfo(res);
    }), $.getJSON(`https://containerappnortheurope.whitedune-748c223c.northeurope.azurecontainerapps.io/ip?ip=${urlnortheuropeData.sourceIpAddress}`, function f(res) {
        console.log(res);
        urlnortheuropeDataSourceIpAddress = new IpInfo(res);
    }), $.getJSON(`https://containerappnortheurope.whitedune-748c223c.northeurope.azurecontainerapps.io/ip?ip=${urlnortheuropeData.destinationIpAddress}`, function f(res) {
        console.log(res);
        urlnortheuropeDataDestinationIpAddress = new IpInfo(res);
    }), $.getJSON(`https://containerappwesteurope.nicepond-330ead69.westeurope.azurecontainerapps.io/ip?ip=${urlwesteuropeData.sourceIpAddress}`, function f(res) {
        console.log(res);
        urlwesteuropeDataDataSourceIpAddress = new IpInfo(res);
    }), $.getJSON(`https://containerappwesteurope.nicepond-330ead69.westeurope.azurecontainerapps.io/ip?ip=${urlwesteuropeData.destinationIpAddress}`, function f(res) {
        console.log(res);
        urlwesteuropeDataDataDestinationIpAddress = new IpInfo(res);
    })).done(function () {
        $("#map").kendoMap({
            center: [30.268107, -37.744821],
            zoom: 2,
            layers: [
                {
                    type: "tile",
                    urlTemplate: "https://#= subdomain #.tile.openstreetmap.org/#= zoom #/#= x #/#= y #.png",
                    subdomains: ["a", "b", "c"],
                    attribution: "&copy; <a href='https://osm.org/copyright'>OpenStreetMap contributors</a>",
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
            city: ${urlcentralcanadaDataSourceIpAddress.city}<br>
            region: ${urlcentralcanadaDataSourceIpAddress.country}<br>
            country: ${urlcentralcanadaDataSourceIpAddress.country}<br>
            postal: ${urlcentralcanadaDataSourceIpAddress.postal}<br>
            timezone: ${urlcentralcanadaDataSourceIpAddress.timezone}<br>
            org: ${urlcentralcanadaDataSourceIpAddress.org}<br>
            distance: ${StaticMethods.distance(urlcentralcanadaDataSourceIpAddress.latitude, urlcentralcanadaDataSourceIpAddress.longitude, urlcentralcanadaDataDestinationIpAddress.latitude, urlcentralcanadaDataDestinationIpAddress.longitude)}`,
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
            city: ${urlcentralcanadaDataDestinationIpAddress.city}<br>
            region: ${urlcentralcanadaDataDestinationIpAddress.country}<br>
            country: ${urlcentralcanadaDataDestinationIpAddress.country}<br>
            postal: ${urlcentralcanadaDataDestinationIpAddress.postal}<br>
            timezone: ${urlcentralcanadaDataDestinationIpAddress.timezone}<br>
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
            city: ${urleastus2DataSourceIpAddress.city}<br>
            region: ${urleastus2DataSourceIpAddress.country}<br>
            country: ${urleastus2DataSourceIpAddress.country}<br>
            postal: ${urleastus2DataSourceIpAddress.postal}<br>
            timezone: ${urleastus2DataSourceIpAddress.timezone}<br>
            org: ${urleastus2DataSourceIpAddress.org}<br>
            distance: ${StaticMethods.distance(urleastus2DataSourceIpAddress.latitude, urleastus2DataSourceIpAddress.longitude, urleastus2DataDestinationIpAddress.latitude, urleastus2DataDestinationIpAddress.longitude)}`,
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
            city: ${urleastus2DataDestinationIpAddress.city}<br>
            region: ${urleastus2DataDestinationIpAddress.country}<br>
            country: ${urleastus2DataDestinationIpAddress.country}<br>
            postal: ${urleastus2DataDestinationIpAddress.postal}<br>
            timezone: ${urleastus2DataDestinationIpAddress.timezone}<br>
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
            city: ${urlnortheuropeDataSourceIpAddress.city}<br>
            region: ${urlnortheuropeDataSourceIpAddress.country}<br>
            country: ${urlnortheuropeDataSourceIpAddress.country}<br>
            postal: ${urlnortheuropeDataSourceIpAddress.postal}<br>
            timezone: ${urlnortheuropeDataSourceIpAddress.timezone}<br>
            org: ${urlnortheuropeDataSourceIpAddress.org}<br>
            distance: ${StaticMethods.distance(urlnortheuropeDataSourceIpAddress.latitude, urlnortheuropeDataSourceIpAddress.longitude, urlnortheuropeDataDestinationIpAddress.latitude, urlnortheuropeDataDestinationIpAddress.longitude)}`,
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
            city: ${urlnortheuropeDataDestinationIpAddress.city}<br>
            region: ${urlnortheuropeDataDestinationIpAddress.country}<br>
            country: ${urlnortheuropeDataDestinationIpAddress.country}<br>
            postal: ${urlnortheuropeDataDestinationIpAddress.postal}<br>
            timezone: ${urlnortheuropeDataDestinationIpAddress.timezone}<br>
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
            city: ${urlwesteuropeDataDataSourceIpAddress.city}<br>
            region: ${urlwesteuropeDataDataSourceIpAddress.country}<br>
            country: ${urlwesteuropeDataDataSourceIpAddress.country}<br>
            postal: ${urlwesteuropeDataDataSourceIpAddress.postal}<br>
            timezone: ${urlwesteuropeDataDataSourceIpAddress.timezone}<br>
            org: ${urlwesteuropeDataDataSourceIpAddress.org}<br>
            distance: ${StaticMethods.distance(urlwesteuropeDataDataSourceIpAddress.latitude, urlwesteuropeDataDataSourceIpAddress.longitude, urlwesteuropeDataDataDestinationIpAddress.latitude, urlwesteuropeDataDataDestinationIpAddress.longitude)}`,
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
            city ${urlwesteuropeDataDataDestinationIpAddress.city}<br>
            region: ${urlwesteuropeDataDataDestinationIpAddress.country}<br>
            country: ${urlwesteuropeDataDataDestinationIpAddress.country}<br>
            postal: ${urlwesteuropeDataDataDestinationIpAddress.postal}<br>
            timezone: ${urlwesteuropeDataDataDestinationIpAddress.timezone}<br>
            org: ${urlwesteuropeDataDataDestinationIpAddress.org}`,
                    },
                },
            ],
        });
    });
});
