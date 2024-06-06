import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamilies';
import {globalStyles} from '../styles/globalStyles';
import {colors} from '../constants/colors';

interface Props {
  text: string;
  font?: string;
  size?: number;
  color?: string;
  styles?: StyleProp<TextStyle>;
  flex?: number;
  line?: number;
}

const TitleComponent = (props: Props) => {
  const {text, font, size, color, styles, flex, line} = props;
  return (
    <TextComponent
      line={line}
      size={size ?? 20}
      text={text}
      color={color}
      font={font ?? fontFamilies.semiBold}
      styles={[
        globalStyles.text,
        styles,
        {
          fontFamily: font ?? fontFamilies.bold,
          fontSize: size ?? 16,
          color: color ? color : colors.text,
          flex: flex ?? 0,
        },
      ]}
    />
  );
};

export default TitleComponent;

const styles = StyleSheet.create({});
