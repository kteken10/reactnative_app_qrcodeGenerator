import React from 'react';
import { Pressable, View } from 'react-native';
import { Text as TextComponent } from '@/components/ui';

interface ModeCardProps {
  icon: React.ElementType;
  title: string;
  mode: string;
  description: string;
  currentMode: string;
  onPress: (mode: string) => void;
}

export const ModeCard: React.FC<ModeCardProps> = ({
  icon: Icon,
  title,
  mode,
  description,
  currentMode,
  onPress,
}) => (
  <Pressable
    onPress={() => onPress(mode)}
    className={`p-4 rounded-xl border-2 mb-4 flex-1 mx-2 ${
      currentMode === mode 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-100 bg-white'
    }`}
  >
    <View className="items-center">
      <Icon 
        size={32} 
        color={currentMode === mode ? '#3b82f6' : '#6b7280'} 
        variant="Bold" 
      />
      <TextComponent className="mt-2 font-bold text-center">
        {title}
      </TextComponent>
      <TextComponent className="mt-1 text-xs text-center text-gray-500">
        {description}
      </TextComponent>
    </View>
  </Pressable>
);