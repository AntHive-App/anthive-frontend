import React, { useState } from 'react';
import { TouchableOpacity, Text, Platform } from 'react-native';
import tw from 'twrnc';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ButtonProps {
  onPress: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  label: string;
  style?: any;
}

export default function Button({ 
  onPress, 
  disabled = false, 
  variant = 'primary', 
  label,
  style = {}
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const getStyles = (variant: ButtonVariant) => {
    const baseStyles = tw`py-3.5 rounded-xl`;
    
    const variantStyles = {
      primary: tw`bg-sky-400`,
      secondary: tw`bg-gray-200`,
      outline: tw`bg-white border-2 border-sky-400`,
      danger: tw`bg-red-500`
    };

    const textStyles = {
      primary: tw`text-white font-bold text-center`,
      secondary: tw`text-black font-bold text-center`,
      outline: tw`text-sky-400 font-bold text-center`,
      danger: tw`text-white font-bold text-center`
    };

    const getShadowStyles = (color: string, opacity: number) => {
      if (Platform.OS === 'android') {
        return {
          elevation: isPressed ? 0 : 4,
        };
      }
      return {
        shadowColor: color,
        shadowOffset: {
          width: 0,
          height: isPressed ? 0 : 4,
        },
        shadowOpacity: isPressed ? 0 : opacity,
        shadowRadius: 0,
      };
    };

    const shadowStyles = {
      primary: getShadowStyles('#38bdf8', 0.5),
      secondary: getShadowStyles('#b4b4b4', 0.5),
      outline: getShadowStyles('#38bdf8', 0.3),
      danger: getShadowStyles('#ef4444', 0.5)
    };

    return {
      container: {
        ...baseStyles,
        ...variantStyles[variant],
        ...shadowStyles[variant],
        ...style
      },
      text: textStyles[variant]
    };
  };

  const styles = getStyles(variant);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
      style={styles.container}
      activeOpacity={0.7}
      delayPressIn={0}
    >
      <Text style={styles.text}>
        {label}
      </Text>
    </TouchableOpacity>
  );
} 