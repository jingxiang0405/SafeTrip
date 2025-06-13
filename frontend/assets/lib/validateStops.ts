// lib/validateStops.ts
import { fakeStops } from './fakeData';

export function validateStops(start: string, end: string): boolean {
  const names = fakeStops.map(stop => stop.StopName.Zh_tw);
  return names.includes(start) && names.includes(end);
}
