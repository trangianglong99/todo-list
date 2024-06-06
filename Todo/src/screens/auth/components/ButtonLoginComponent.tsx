import {
  ActivityIndicator,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import TextComponent from '../../../components/TextComponent';
import {fontFamilies} from '../../../constants/fontFamilies';
import {colors} from '../../../constants/colors';

interface Props {
  text: string;
  onPress: () => void;
  isLoading?: boolean;
  color?: string;
}

const ButtonLoginComponent = (props: Props) => {
  const {text, onPress, isLoading, color} = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        backgroundColor: color ? color : isLoading ? colors.gray : colors.blue2,
      }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <TextComponent
          text={text}
          flex={0}
          styles={{textTransform: 'uppercase'}}
          font={fontFamilies.semiBold}
        />
      )}
    </TouchableOpacity>
  );
};

export default ButtonLoginComponent;

const styles = StyleSheet.create({});
