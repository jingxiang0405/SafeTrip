import { fakeRouteMap } from './fakeRoutes';

export const fakeShapeMap: Record<string, { lat: number; lon: number }[]> = {};

Object.entries(fakeRouteMap).forEach(([route, stops]) => {
  fakeShapeMap[route] = stops.map(stop => ({
    lat: stop.StopPosition.PositionLat,
    lon: stop.StopPosition.PositionLon
  }));
});
/*
[
  {
    "RouteName": { "Zh_tw": "262" },
    "Direction": 0,
    "Geometry": "LINESTRING(121.513583 25.03772,121.5147 25.0388, ...)"
  },
  {
    "RouteName": { "Zh_tw": "262" },
    "Direction": 1,
    "Geometry": "LINESTRING(121.5203 25.0439,121.5212 25.0451, ...)"
  }
]
*/