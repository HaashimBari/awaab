import { Stack } from 'expo-router';
import React from 'react';
import { SessionFlow } from '../../components/session/SessionFlow';
import { EVENING_DHIKR } from '../../constants/dhikr';
import { Colors } from '../../constants/theme';

export default function EveningScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Evening Adhkar',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
        }}
      />
      <SessionFlow
        dhikrList={EVENING_DHIKR}
        category="evening"
        title="Evening Adhkar"
      />
    </>
  );
}
