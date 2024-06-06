import React from 'react';
import {StyleProp, StyleSheet, Text, TextStyle, ViewStyle} from 'react-native';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  text: string;
  color?: string;
  size?: number;
  font?: string;
  flex?: number;
  styles?: StyleProp<TextStyle>;
  line?: number;
}

const TextComponent = (props: Props) => {
  const {text, color, size, font, flex, styles, line} = props;
  return (
    <Text
      numberOfLines={line}
      style={[
        globalStyles.text,
        {
          flex: flex ?? 1,
          color: color ?? colors.desc,
          fontSize: size ?? 14,
          fontFamily: font ?? fontFamilies.regular,
          textAlign: 'justify',
        },
        styles,
      ]}>
      {text}
    </Text>
  );
};

export default TextComponent;

const styles = StyleSheet.create({});
