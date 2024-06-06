import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  color?: string;
  value: number;
  maxValue?: number;
  radius?: number;
}

const CiculatorComponent = (props: Props) => {
  const {color, value, maxValue, radius} = props;
  return (
    <CircularProgress
      value={value}
      title={`${value}%`}
      radius={radius ?? 46}
      showProgressValue={false}
      activeStrokeColor={color ?? colors.blue}
      inActiveStrokeColor={colors.gray2}
      titleColor={colors.text}
      titleFontSize={26}
      titleStyle={{
        fontFamily: fontFamilies.semiBold,
        fontSize: 18,
      }}
    />
  );
};

export default CiculatorComponent;

const styles = StyleSheet.create({});
