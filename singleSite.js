"use strict";
/// <reference types="kendo-ui" />
var url = document.location.pathname.substring(1);
url = url.toLowerCase();
if (document.location.hostname.toLowerCase().indexOf("localhost") == 0) {
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
var largeLoader = $('#loader-large').kendoLoader({ visible: true,
    type: "pulsing",
    size: 'large'
}).data("kendoLoader");
