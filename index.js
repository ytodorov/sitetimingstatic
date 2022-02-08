"use strict";
/// <reference types="kendo-ui" />
function navigateToUrl(url) {
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
    var url = $("#sites").val();
    if (url) {
        navigateToUrl(url);
    }
});
$(function () {
    $("#breadcrumb").kendoBreadcrumb({
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
            data: function (response) {
                return response.data.sites;
            },
        },
        serverFiltering: true,
        transport: {
            read: function (options) {
                var siteContains = $("#sites").val();
                $.ajax({
                    url: `https://st-westus3.azurewebsites.net/graphql?query={sites(take:100,where: "url.contains(\\\"${siteContains}\\\")"){url}}`,
                    dataType: "json",
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
    function onSelect(e) {
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
