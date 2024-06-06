import React, {ReactNode} from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {globalStyles} from '../styles/globalStyles';
import TextComponent from './TextComponent';
import {colors} from '../constants/colors';

interface Props {
  text: string;
  color?: string;
  tagStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children?: ReactNode;
}

const TagComponent = (props: Props) => {
  const {text, color, tagStyles, textStyles, onPress, children} = props;
  return onPress ? (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[
        globalStyles.tag,
        tagStyles,
        {backgroundColor: color ?? colors.blue},
      ]}>
      <TextComponent text={text} color={color} styles={textStyles} />
    </TouchableOpacity>
  ) : (
    <View style={{flex: 0}}>{children}</View>
  );
};

export default TagComponent;

const styles = StyleSheet.create({});
