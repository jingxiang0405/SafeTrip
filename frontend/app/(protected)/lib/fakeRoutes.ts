export type Stop = {
  StopID: string;
  StopName: { Zh_tw: string };
  StopPosition: { PositionLat: number; PositionLon: number };
};

export const fakeRouteMap: Record<string, Stop[]> = {
  '262': [
    {
      StopID: '1001',
      StopName: { Zh_tw: '台大醫院' },
      StopPosition: { PositionLat: 25.042233, PositionLon: 121.516002 }
    },
    {
      StopID: '1002',
      StopName: { Zh_tw: '台北車站' },
      StopPosition: { PositionLat: 25.047708, PositionLon: 121.517055 }
    },
    {
      StopID: '1003',
      StopName: { Zh_tw: '善導寺' },
      StopPosition: { PositionLat: 25.0451, PositionLon: 121.5235 }
    }
  ],
  '307': [
    {
      StopID: '2001',
      StopName: { Zh_tw: '南港展覽館' },
      StopPosition: { PositionLat: 25.0689, PositionLon: 121.6135 }
    },
    {
      StopID: '2002',
      StopName: { Zh_tw: '昆陽' },
      StopPosition: { PositionLat: 25.0505, PositionLon: 121.5808 }
    }
  ],
  '205': [
    {
      StopID: '3001',
      StopName: { Zh_tw: '景美' },
      StopPosition: { PositionLat: 25.0001, PositionLon: 121.5412 }
    },
    {
      StopID: '3002',
      StopName: { Zh_tw: '公館' },
      StopPosition: { PositionLat: 25.0146, PositionLon: 121.5331 }
    },
    {
      StopID: '3003',
      StopName: { Zh_tw: '台電大樓' },
      StopPosition: { PositionLat: 25.0223, PositionLon: 121.5285 }
    }
  ],
  '藍1': [
    {
      StopID: '4001',
      StopName: { Zh_tw: '西門' },
      StopPosition: { PositionLat: 25.0422, PositionLon: 121.5086 }
    },
    {
      StopID: '4002',
      StopName: { Zh_tw: '龍山寺' },
      StopPosition: { PositionLat: 25.0356, PositionLon: 121.4997 }
    },
    {
      StopID: '4003',
      StopName: { Zh_tw: '萬華車站' },
      StopPosition: { PositionLat: 25.0325, PositionLon: 121.5003 }
    }
  ],
  '綠16': [
    {
      StopID: '5001',
      StopName: { Zh_tw: '士林' },
      StopPosition: { PositionLat: 25.0925, PositionLon: 121.5254 }
    },
    {
      StopID: '5002',
      StopName: { Zh_tw: '芝山' },
      StopPosition: { PositionLat: 25.1033, PositionLon: 121.5221 }
    },
    {
      StopID: '5003',
      StopName: { Zh_tw: '明德' },
      StopPosition: { PositionLat: 25.1140, PositionLon: 121.5185 }
    }
  ]
};

export const fakeRouteNumbers = Object.keys(fakeRouteMap);
