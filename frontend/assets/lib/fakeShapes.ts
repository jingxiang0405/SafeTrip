import { fakeRouteMap } from './fakeRoutes';

export const fakeShapeMap: Record<string, { lat: number; lon: number }[]> = {};

Object.entries(fakeRouteMap).forEach(([route, stops]) => {
  fakeShapeMap[route] = stops.map(stop => ({
    lat: stop.StopPosition.PositionLat,
    lon: stop.StopPosition.PositionLon
  }));
});