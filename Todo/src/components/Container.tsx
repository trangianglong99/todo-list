import {
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from '../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../constants/colors';
import RowComponent from './RowComponent';
import {ArrowLeft2} from 'iconsax-react-native';
import TextComponent from './TextComponent';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  children: ReactNode;
  title?: string;
  back?: boolean;
  right?: ReactNode;
  isScroll?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Container = (props: Props) => {
  const {children, title, back, right, isScroll, style} = props;
  const navigation: any = useNavigation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.bgColor}}>
      <View style={[globalStyles.container, style]}>
        <RowComponent
          styles={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {back && (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft2 size={20} color={colors.white} />
            </TouchableOpacity>
          )}
          <View style={{flex: 1, zIndex: -1}}>
            {title && (
              <TextComponent
                text={title}
                flex={0}
                font={fontFamilies.bold}
                size={20}
                styles={{marginLeft: back ? 130 : 0}}
              />
            )}
          </View>
        </RowComponent>

        {isScroll ? (
          <ScrollView style={{flex: 1}}>{children}</ScrollView>
        ) : (
          <View style={{flex: 1}}>{children}</View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Container;

const styles = StyleSheet.create({});
