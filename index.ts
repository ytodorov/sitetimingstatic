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
          url: `https://st-westus3.azurewebsites.net/graphql?query={sites(take:100,where: "url.contains(\\\"${siteContains}\\\")"){url}}`,
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
    minLength: 3,
    dataSource: dataSource,
    size: "large",
    noDataTemplate: "Website not found. Press enter to add it.",
    select: onSelect,
  });
});

$(function () {
  let READ_PRODUCTS_QUERY =
    "query {" +
    'probes(take:10, order: "id desc") { uniqueGuid, latencyInChrome, dOMContentLoadedEventInChrome, sourceIpAddress, siteId site{url}}' +
    "}";

  let dataSource = new kendo.data.DataSource({
    transport: {
      read: {
        contentType: "application/json",
        url: "https://st-westus3.azurewebsites.net/graphql",
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

        if (data.probes) {
          return data.probes;
        }
      },
      total: function (response: any) {
        return response.data.probes.length;
      },
      model: {
        id: "id",
        fields: {
          id: { type: "number", editable: false },
          latencyInChrome: { type: "number", editable: false },
          dOMContentLoadedEventInChrome: { type: "number", editable: false },
          sourceIpAddress: { type: "string" },

          uniqueGuid: { type: "string" },
        },
      },
    },
    pageSize: 10,
  });

  $("#grid").kendoGrid({
    dataSource: dataSource,
    groupable: false,
    sortable: false,
    pageable: true,
    columns: [
      {
        title: "Url",
        template: `<a target="_blank" href="https://www.sitetiming.com/#: site.url #">#: site.url #</a>`,
      },
      {
        field: "latencyInChrome",
        title: "Latency",
      },
      // {
      //   field: "dOMContentLoadedEventInChrome",
      //   title: "DOM Loaded",
      // },
      // {
      //   field: "sourceIpAddress",
      //   title: "Load from IP",
      // },
      {
        field: "uniqueGuid",
        title: "Screenshot",
        template: `<img class="product-photo" onerror="if (this.src != 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg') this.src = 'https://static8.depositphotos.com/1010782/858/v/600/depositphotos_8584590-stock-illustration-website-maintenance-message.jpg';"
         src="https://sitetiming.blob.core.windows.net/images/short50_#: uniqueGuid #.jpeg?sv=2020-08-04&st=2012-01-27T12%3A30%3A00Z&se=2032-01-28T12%3A30%3A00Z&sr=c&sp=rl&sig=jvKd8yqdiz42u28l4oPYHVFWUSCaeLYmeKMMCgwtn1Y%3D" />`,
      },
    ],
  });
});
