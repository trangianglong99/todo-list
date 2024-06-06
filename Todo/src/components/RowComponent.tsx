import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  children: ReactNode;
  justify?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | undefined;
  onPress?: () => void;
  styles?: StyleProp<ViewStyle>;
}

const RowComponent = (props: Props) => {
  const {children, justify, onPress, styles} = props;
  const localStyles = [
    globalStyles.row,
    {justifyContent: justify ?? 'center'},
    styles,
  ];
  return onPress ? (
    <TouchableOpacity
      style={localStyles}
      onPress={onPress ? () => onPress() : undefined}>
      {children}
    </TouchableOpacity>
  ) : (
    <View style={localStyles}>{children}</View>
  );
};

export default RowComponent;

const styles = StyleSheet.create({});
