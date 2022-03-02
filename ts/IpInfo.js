"use strict";
class IpInfo {
    constructor(obj) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.latitude = Number.parseFloat((_a = obj.loc) === null || _a === void 0 ? void 0 : _a.toString().split(",")[0]);
        this.longitude = Number.parseFloat((_b = obj.loc) === null || _b === void 0 ? void 0 : _b.toString().split(",")[1]);
        this.ip = (_c = obj.ip) === null || _c === void 0 ? void 0 : _c.toString();
        this.city = (_d = obj.city) === null || _d === void 0 ? void 0 : _d.toString();
        this.country = (_e = obj.country) === null || _e === void 0 ? void 0 : _e.toString();
        this.postal = (_f = obj.postal) === null || _f === void 0 ? void 0 : _f.toString();
        this.timezone = (_g = obj.timezone) === null || _g === void 0 ? void 0 : _g.toString();
        this.org = (_h = obj.org) === null || _h === void 0 ? void 0 : _h.toString();
        this.hostname = (_j = obj.hostname) === null || _j === void 0 ? void 0 : _j.toString();
    }
}
