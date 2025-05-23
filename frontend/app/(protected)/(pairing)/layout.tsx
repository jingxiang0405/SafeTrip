// app/(protected)/(modals)/_layout.tsx
import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal', // slide from bottom
        headerShown: false,
      }}
    />
  );
}
