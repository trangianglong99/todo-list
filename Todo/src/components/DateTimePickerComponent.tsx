import {Modal, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import TitleComponent from './TitleComponent';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {colors} from '../constants/colors';
import {ArrowDown2} from 'iconsax-react-native';
import {globalStyles} from '../styles/globalStyles';
import SpaceComponent from './SpaceComponent';
import ButtonComponent from './ButtonComponent';
import DatePicker from 'react-native-date-picker';

interface Props {
  type?: 'date' | 'time' | 'datetime';
  title?: string;
  plaholder?: string;
  selected?: Date;
  onSelected: (val: Date) => void;
}

const DateTimePickerComponent = (props: Props) => {
  const {type, title, plaholder, selected, onSelected} = props;
  const [isVisibleModalDatetime, setIsVisibleModalDatetime] = useState(false);
  const [date, setDate] = useState(selected ?? new Date());
  return (
    <>
      <View style={{marginBottom: 16}}>
        {title && <TitleComponent text={title} />}
        <RowComponent
          onPress={() => setIsVisibleModalDatetime(true)}
          styles={[globalStyles.inputContainer, {marginTop: title ? 8 : 0}]}>
          <TextComponent
            flex={1}
            text={
              selected
                ? type === 'time'
                  ? `${selected.getHours()} : ${selected.getMinutes()}`
                  : `${selected.getDate()} / ${
                      selected.getMonth() + 1
                    } / ${selected.getFullYear()}`
                : plaholder
                ? plaholder
                : ''
            }
            color={selected ? colors.white : '#676767'}
          />
          <ArrowDown2 size={20} color={colors.white} />
        </RowComponent>
      </View>
      <Modal visible={isVisibleModalDatetime} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              margin: 20,
              width: '90%',
              backgroundColor: colors.white,
              padding: 20,
              borderRadius: 20,
            }}>
            <View>
              <DatePicker
                mode={type ? type : 'datetime'}
                date={date}
                onDateChange={val => setDate(val)}
                locale="vi"
              />
            </View>
            <SpaceComponent height={20} />
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <ButtonComponent
                onPress={() => {
                  onSelected(date);
                  setIsVisibleModalDatetime(false);
                }}>
                <TextComponent color={colors.blue} text="Comfirm" flex={0} />
              </ButtonComponent>
              <ButtonComponent onPress={() => setIsVisibleModalDatetime(false)}>
                <TextComponent color={colors.blue} text="Close" flex={0} />
              </ButtonComponent>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DateTimePickerComponent;

const styles = StyleSheet.create({});
