"use strict";
class IpInfo {
    constructor(obj) {
        this.latitude = Number.parseFloat(obj.loc.toString().split(",")[0]);
        this.longitude = Number.parseFloat(obj.loc.toString().split(",")[1]);
        this.ip = obj.ip.toString();
        this.city = obj.city.toString();
        this.country = obj.country.toString();
        this.postal = obj.postal.toString();
        this.timezone = obj.timezone.toString();
    }
}
