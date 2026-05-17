import { Stack } from 'expo-router';
import React from 'react';
import { SessionFlow } from '../../components/session/SessionFlow';
import { MORNING_DHIKR } from '../../constants/dhikr';
import { Colors } from '../../constants/theme';

export default function MorningScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Morning Adhkar',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
        }}
      />
      <SessionFlow
        dhikrList={MORNING_DHIKR}
        category="morning"
        title="Morning Adhkar"
      />
    </>
  );
}
