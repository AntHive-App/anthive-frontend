import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

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
  const getStyles = (variant: ButtonVariant) => {
    const baseStyles = tw`py-3.5 rounded-xl`;
    
    const variantStyles = {
      primary: tw`bg-sky-400`,
      secondary: tw`bg-gray-200`,
      outline: tw`bg-white border-2 border-sky-400`
    };

    const textStyles = {
      primary: tw`text-white font-bold text-center`,
      secondary: tw`text-black font-bold text-center`,
      outline: tw`text-sky-400 font-bold text-center`
    };

    // Shadow styles need to be applied separately since they're not supported in tw
    const shadowStyles = {
      primary: {
        shadowColor: '#38bdf8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 0,
        elevation: 4
      },
      secondary: {
        shadowColor: '#b4b4b4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 0,
        elevation: 4
      },
      outline: {
        shadowColor: '#38bdf8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 0,
        elevation: 4
      }
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