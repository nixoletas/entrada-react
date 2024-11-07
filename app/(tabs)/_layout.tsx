import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Movimentação',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'arrow-down-circle' : 'arrow-down-circle-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Saída',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'arrow-up-circle' : 'arrow-up-circle-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
