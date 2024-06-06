import {CloseCircle, Eye, EyeSlash} from 'iconsax-react-native';
import React, {ReactNode, useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '../constants/colors';
import {globalStyles} from '../styles/globalStyles';
import RowComponent from './RowComponent';
import TitleComponent from './TitleComponent';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  plaholder?: string;
  title?: string;
  prefix?: ReactNode;
  affix?: ReactNode;
  alowClear?: boolean;
  multible?: boolean;
  numberOfLines?: number;
  alignItem?: 'flex-start' | 'center' | 'flex-end';
  isPassword?: boolean;
  styles?: StyleProp<ViewStyle>;
}

const InputComponent = (props: Props) => {
  const {
    value,
    onChangeText,
    plaholder,
    title,
    prefix,
    affix,
    alowClear,
    multible,
    numberOfLines,
    alignItem,
    isPassword,
    styles,
  } = props;
  const [showPass, setShowPass] = useState(false);
  return (
    <View style={{marginBottom: 16}}>
      {title && <TitleComponent text={title} />}
      <RowComponent
        styles={[
          globalStyles.inputContainer,
          {
            marginTop: title ? 8 : 0,
            paddingVertical: 16,
            paddingHorizontal: 10,
            alignItems: alignItem ?? 'center',
          },
          styles,
        ]}>
        {prefix && prefix}
        <View
          style={{
            flex: 1,
            marginLeft: prefix ? 8 : 0,
            marginRight: affix ? 8 : 0,
          }}>
          <TextInput
            style={[
              globalStyles.text,
              {
                margin: 0,
                padding: 0,
                flex: 0,
                paddingVertical: 4,
                minHeight: multible && numberOfLines ? 16 * numberOfLines : 16,
              },
            ]}
            placeholder={plaholder ?? ''}
            placeholderTextColor={'#676767'}
            value={value}
            onChangeText={val => onChangeText(val)}
            multiline={multible}
            numberOfLines={numberOfLines}
            secureTextEntry={isPassword ? !showPass : false}
            autoCapitalize="none"
          />
        </View>
        {affix && affix}
        {alowClear && value && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <CloseCircle size={20} color={colors.white} />
          </TouchableOpacity>
        )}

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            {showPass ? (
              <EyeSlash size={20} color={colors.white} />
            ) : (
              <Eye size={20} color={colors.white} />
            )}
          </TouchableOpacity>
        )}
      </RowComponent>
    </View>
  );
};

export default InputComponent;

const styles = StyleSheet.create({});
