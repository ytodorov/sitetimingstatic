class IpInfo {
  latitude: number;
  longitude: number;
  ip: string;
  city: string;
  country: string;
  postal: string;
  timezone: string;
  org: string;
  hostname: string;

  constructor(obj: any) {
    this.latitude = Number.parseFloat(obj.loc?.toString().split(",")[0]);
    this.longitude = Number.parseFloat(obj.loc?.toString().split(",")[1]);
    this.ip = obj.ip?.toString();
    this.city = obj.city?.toString();
    this.country = obj.country?.toString();
    this.postal = obj.postal?.toString();
    this.timezone = obj.timezone?.toString();
    this.org = obj.org?.toString();
    this.hostname = obj.hostname?.toString();
  }
}
