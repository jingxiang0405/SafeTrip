// ✅ 此 hook 負責監測被照顧者是否遠離公車
// 使用時在照顧者的 Map 畫面呼叫即可

import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getMockDependentLocation } from '@/hooks/useMockDependentLocation';

export function useProximityAlert(busPosition: { latitude: number; longitude: number }, enabled: boolean) {
  const [hasAlerted, setHasAlerted] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(async () => {
      const dependentLocation = await getMockDependentLocation();
      if (!dependentLocation) return;

      const distance = getDistance(busPosition, dependentLocation);

      if (distance > 300 && !hasAlerted) {
        Alert.alert('⚠️ 被照顧者可能走失', '系統偵測到被照顧者已遠離公車超過 300 公尺');
        setHasAlerted(true);
      } else if (distance <= 300 && hasAlerted) {
        setHasAlerted(false); // 回到安全距離，重置警告
      }
    }, 8000); // 每 8 秒檢查一次

    return () => clearInterval(interval);
  }, [busPosition, enabled, hasAlerted]);
}

// 🧮 簡單距離公式（可換成 haversine）
function getDistance(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const dx = a.latitude - b.latitude;
  const dy = a.longitude - b.longitude;
  return Math.sqrt(dx * dx + dy * dy) * 111000; // 近似公尺
}
