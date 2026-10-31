export interface HourlyData {
  time: string[];
  temperature_2m: number[];
}

export interface WeahtherApiResponse {
  latitude: number;
  longitude: number;
  hourly: HourlyData;
}
