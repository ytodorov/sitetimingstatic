/// <reference types="kendo-ui" />

function navigateToUrl(url: string) {
  if (document.location.hostname.toLowerCase().indexOf("127.0.0.1") == -1) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `http://${url}`;
    }
    document.location = "/" + url;
  }
}

$("#sites").on("keypress", function (event) {
  if (event.key == "Enter") {
    $("#btnCheckWebSite").trigger("click");
  }
});

$("#btnCheckWebSite").on("click", function (data) {
  data.preventDefault();
  var url = $("#sites").val() as string;
  if (url) {
    navigateToUrl(url);
  }
});

$(function () {
  ($("#breadcrumb") as any).kendoBreadcrumb({
    navigational: true,
    delimiterIcon: "line111",
    items: [
      {
        type: "rootitem",
        href: "/",
        text: "SiteTiming",
        showText: true,
        showIcon: false,
      },
      {
        type: "rootitem",
        href: "/sites",
        text: "Sites",
        showText: true,
        showIcon: false,
      },
    ],
  });

  //   $("#btnCheckWebSite").kendoButton({
  //     themeColor: "primary"
  // });

  const dataSource = new kendo.data.DataSource({
    schema: {
      data: function (response: any) {
        return response.data.sites;
      },
    },
    serverFiltering: true,
    transport: {
      read: function (options) {
        var siteContains = $("#sites").val();

        $.ajax({
          url: `https://containerappeastus.yellowmoss-bb737f56.eastus.azurecontainerapps.io/graphql?query={sites(take:100,where: "url.contains(\\\"${siteContains}\\\")"){url}}`,
          dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
          success: function (result) {
            // notify the data source that the request succeeded
            options.success(result);
          },
          error: function (result) {
            // notify the data source that the request failed
            options.error(result);
          },
        });
      },
    },
  });

  function onSelect(e: kendo.ui.AutoCompleteSelectEvent) {
    var url = e.dataItem.url.toLowerCase();
    navigateToUrl(url);
  }

  $("#sites").kendoAutoComplete({
    dataTextField: "url",
    minLength: 1,
    dataSource: dataSource,
    size: "large",
    noDataTemplate: "Website not found. Press enter to add it.",
    select: onSelect,
  });
});

$(function () {
  function createChart() {
    var urls = [
      "google.com",
      "youtube.com",
      //"tmall.com",
      //"qq.com",
      //"baidu.com",
      //"sohu.com",
      //"taobao.com",
      "facebook.com",
    ] as string[];

    var counter = 0;
    $(urls).each(function (counter) {
      var url = this;

      // 20.96.146.69 - East US
      // 20.151.196.218 - Central Canada
      // 20.126.227.94 - West Europe
      // 20.54.123.54 - North Europe

      var ips = [
        "20.54.123.54",
        "20.126.227.94",
        "20.151.196.218",
        "20.96.146.69",
      ];

      var locations = [
        "East US",
        "Central Canada",
        "West Europe",
        "North Europe",
      ];

      $(
        "#charts"
      ).append(`<div class="text-center"><a target="_blank" class="" href="https://www.sitetiming.com/${url}">Details for ${url}</a></div><div class="row">
                <div id="chart${counter}_0" class="col-lg-3 col-md-4 col-sm-6">
                </div>
                <div id="chart${counter}_1" class="col-lg-3 col-md-4 col-sm-6">
                </div>
                <div id="chart${counter}_2" class="col-lg-3 col-md-4 col-sm-6">
                </div>
                <div id="chart${counter}_3" class="col-lg-3 col-md-4 col-sm-6">
                </div>
            </div>`);

      $(ips).each(function (index) {
        var serverUrl = StaticMethods.getRandomServerUrlNoEndingSlash();
        var ip = this;
        var urlQuery = `${serverUrl}/graphql?query={probes(take:5, where:"SourceIpAddress=\\\"${ip}\\\" and Site.Url=\\\"http://${url}\\\""){id dateCreated dateCreatedFormatted dateCreatedAgo latencyInChrome dOMContentLoadedEventInChrome}}`;
        //$("#charts").append(`<div id="chart${counter}"></div>`);

        var currentChart = $(`#chart${counter}_${index}`);
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
            text: `${url} from ${locations[index]}`,
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
    });
  }
  createChart();
});

$(window).resize(function () {
  $("div[id^='chart']").each(function () {
    var kendoChart = $(this).data("kendoChart");
    if (kendoChart) {
      kendoChart.refresh();
    }
  });
});

// $(function () {
//   let READ_PRODUCTS_QUERY =
//     "query {" +
//     'probes(take:10, order: "id desc") { uniqueGuid, latencyInChrome, dOMContentLoadedEventInChrome, sourceIpAddress, siteId site{url}}' +
//     "}";

//   let dataSource = new kendo.data.DataSource({
//     transport: {
//       read: {
//         contentType: "application/json",
//         url: "https://containerappeastus.yellowmoss-bb737f56.eastus.azurecontainerapps.io/graphql",
//         type: "POST",
//         data: function () {
//           return { query: READ_PRODUCTS_QUERY };
//         },
//       },
//       parameterMap: function (options: any) {
//         return kendo.stringify({
//           query: options.query,
//           variables: options.variables,
//         });
//       },
//     },
//     schema: {
//       data: function (response: any) {
//         var data = response.data;

//         if (data.probes) {
//           return data.probes;
//         }
//       },
//       total: function (response: any) {
//         return response.data.probes.length;
//       },
//       model: {
//         id: "id",
//         fields: {
//           id: { type: "number", editable: false },
//           latencyInChrome: { type: "number", editable: false },
//           dOMContentLoadedEventInChrome: { type: "number", editable: false },
//           sourceIpAddress: { type: "string" },

//           uniqueGuid: { type: "string" },
//         },
//       },
//     },
//     pageSize: 10,
//   });

//   // $("#grid").kendoGrid({
//   //   dataSource: dataSource,
//   //   groupable: false,
//   //   sortable: false,
//   //   pageable: {
//   //     refresh: true,
//   //   },
//   //   columns: [
//   //     {
//   //       title: "Url",
//   //       template: `<a target="_blank" href="https://www.sitetiming.com/#: site.url #">#: site.url #</a>`,
//   //     },
//   //     {
//   //       field: "latencyInChrome",
//   //       title: "Latency",
//   //     },

//   //     {
//   //       field: "uniqueGuid",
//   //       title: "Screenshot",
//   //       template: `<img class="product-photo" onerror="if (this.src != 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg') this.src = 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg';"
//   //        src="https://sitetiming.blob.core.windows.net/images/short50_#: uniqueGuid #.jpeg?sv=2020-08-04&st=2012-01-27T12%3A30%3A00Z&se=2032-01-28T12%3A30%3A00Z&sr=c&sp=rl&sig=jvKd8yqdiz42u28l4oPYHVFWUSCaeLYmeKMMCgwtn1Y%3D" />`,
//   //     },
//   //   ],
//   // });

//   // $("#map").kendoMap({
//   //   center: [30.268107, -40.744821],
//   //   zoom: 3,
//   //   layers: [
//   //     {
//   //       type: "tile",
//   //       urlTemplate:
//   //         "https://#= subdomain #.tile.openstreetmap.org/#= zoom #/#= x #/#= y #.png",
//   //       subdomains: ["a", "b", "c"],
//   //       attribution:
//   //         "&copy; <a href='https://osm.org/copyright'>OpenStreetMap contributors</a>",
//   //     },
//   //   ],
//   //   markers: [
//   //     {
//   //       location: [43.7001, -79.4163],
//   //       shape: "pinTarget",
//   //       tooltip: {
//   //         content: "Canada, Toronto",
//   //       },
//   //     },
//   //     {
//   //       location: [36.6676, -78.3875],
//   //       shape: "pinTarget",
//   //       tooltip: {
//   //         content: "United States, Boydton",
//   //       },
//   //     },
//   //     {
//   //       location: [53.34399, -6.26719],
//   //       shape: "pinTarget",
//   //       tooltip: {
//   //         content: "Ireland, Dublin",
//   //       },
//   //     },
//   //     {
//   //       location: [52.374, 4.8897],
//   //       shape: "pinTarget",
//   //       tooltip: {
//   //         content: "Netherlands, Amsterdam",
//   //       },
//   //     },
//   //   ],
//   // });
// });
