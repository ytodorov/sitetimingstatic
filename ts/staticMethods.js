"use strict";
class StaticMethods {
    static distance(lat1, lon1, lat2, lon2) {
        var unit = "K"; // Kilometers
        if (lat1 == lat2 && lon1 == lon2) {
            return "0 km.";
        }
        else {
            var radlat1 = (Math.PI * lat1) / 180;
            var radlat2 = (Math.PI * lat2) / 180;
            var theta = lon1 - lon2;
            var radtheta = (Math.PI * theta) / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) +
                Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = (dist * 180) / Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit == "K") {
                dist = dist * 1.609344;
            }
            if (unit == "N") {
                dist = dist * 0.8684;
            }
            var distString = `${Math.floor(dist).toString()} km.`;
            return distString;
        }
    }
    static getRandomServerUrlNoEndingSlash() {
        const siteUrls = [
            "https://containerappcanadacentral.happyrock-5d18c325.canadacentral.azurecontainerapps.io",
            "https://containerappeastus2.politeflower-c7227859.eastus2.azurecontainerapps.io",
            "https://containerappnortheurope.whitedune-748c223c.northeurope.azurecontainerapps.io",
            "https://containerappwesteurope.nicepond-330ead69.westeurope.azurecontainerapps.io",
            "https://containerappeastus.yellowmoss-bb737f56.eastus.azurecontainerapps.io",
        ];
        const random = Math.floor(Math.random() * siteUrls.length);
        const result = siteUrls[random];
        return result;
    }
}
StaticMethods.pi = 3.14;
