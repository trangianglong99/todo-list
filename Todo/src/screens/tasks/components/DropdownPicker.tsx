import {
  ArrowDown2,
  CloseSquare,
  SearchNormal1,
  TickCircle,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import InputComponent from '../../../components/InputComponent';
import RowComponent from '../../../components/RowComponent';
import TextComponent from '../../../components/TextComponent';
import TitleComponent from '../../../components/TitleComponent';
import {colors} from '../../../constants/colors';
import {selectModel} from '../../../models/SelectModel';
import {globalStyles} from '../../../styles/globalStyles';
import ButtonLoginComponent from '../../auth/components/ButtonLoginComponent';
import SpaceComponent from '../../../components/SpaceComponent';

interface Props {
  title?: string;
  items: selectModel[];
  selected?: string[];
  onSelected: (val: string[]) => void;
  multible?: boolean;
}

const DropdownPicker = (props: Props) => {
  const {title, items, selected, onSelected, multible} = props;
  const [isVisible, setIsVisible] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [result, setResult] = useState<selectModel[]>([]);
  const [dataSelected, setDataSelected] = useState<string[]>([]);

  useEffect(() => {
    selected && setDataSelected(selected);
  }, [isVisible, selected]);

  useEffect(() => {
    if (!searchKey) {
      setResult([]);
    } else {
      const data = items.filter(element =>
        element.label.toLowerCase().includes(searchKey.toLowerCase()),
      );
      setResult(data);
    }
  }, [searchKey]);

  const handleSelectItem = (id: string) => {
    if (multible) {
      const data = [...dataSelected];
      const index = data.findIndex(element => element === id);
      if (index !== -1) {
        data.splice(index, 1);
      } else {
        data.push(id);
      }
      setDataSelected(data);
    } else {
      setDataSelected([id]);
    }
  };

  const handleConfirm = () => {
    onSelected(dataSelected);
    setIsVisible(false);
    setDataSelected([]);
  };

  const handleRemoveSelectedItem = (index: number) => {
    if (selected) {
      selected.splice(index, 1);

      onSelected(selected);
    }
  };

  const renderSelectedItem = (id: string, index: number) => {
    const item = items.find(element => element.value === id);

    return (
      item && (
        <RowComponent
          onPress={() => handleRemoveSelectedItem(index)}
          key={id}
          styles={{
            marginRight: 4,
            padding: 2,
            borderRadius: 100,
            borderWidth: 0.5,
            borderColor: colors.gray2,
            marginBottom: 4,
          }}>
          <TextComponent text={item.label} flex={0} styles={{marginRight: 4}} />
          <SpaceComponent width={8} />
          <CloseSquare size={20} color={colors.white} />
        </RowComponent>
      )
    );
  };

  return (
    <View style={{marginBottom: 16}}>
      {title && <TitleComponent text={title} />}
      <RowComponent
        onPress={() => setIsVisible(true)}
        styles={[
          globalStyles.inputContainer,
          {marginTop: title ? 8 : 0, paddingVertical: 16},
        ]}>
        <View style={{flex: 1, marginRight: 12}}>
          {selected && selected?.length > 0 ? (
            <RowComponent justify="flex-start" styles={{flexWrap: 'wrap'}}>
              {selected.map((id, index) => renderSelectedItem(id, index))}
            </RowComponent>
          ) : (
            <TextComponent text="Select" color={colors.gray2} flex={0} />
          )}
        </View>
        <ArrowDown2 size={20} color={colors.text} />
      </RowComponent>
      <Modal
        visible={isVisible}
        style={{flex: 1}}
        transparent
        animationType="slide"
        statusBarTranslucent>
        <View
          style={[
            globalStyles.container,
            {
              padding: 20,
              paddingTop: 60,
              paddingBottom: 60,
            },
          ]}>
          <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <RowComponent
                styles={{alignItems: 'center', justifyContent: 'center'}}>
                <View style={{flex: 1, marginRight: 12}}>
                  <InputComponent
                    value={searchKey}
                    onChangeText={val => setSearchKey(val)}
                    plaholder="Search..."
                    prefix={<SearchNormal1 size={20} color={colors.gray2} />}
                    alowClear
                  />
                </View>
                <TouchableOpacity>
                  <TextComponent text="Clear" color={colors.danger} flex={0} />
                </TouchableOpacity>
              </RowComponent>
            }
            style={{flex: 1}}
            data={searchKey ? result : items}
            renderItem={({item}) => (
              <RowComponent
                onPress={() => handleSelectItem(item.value)}
                key={item.value}
                styles={{paddingVertical: 16}}>
                <TextComponent
                  size={16}
                  text={item.label}
                  color={
                    dataSelected.includes(item.value)
                      ? colors.danger
                      : colors.text
                  }
                />
                {dataSelected.includes(item.value) && (
                  <TickCircle size={20} color={colors.danger} />
                )}
              </RowComponent>
            )}
          />
          <ButtonLoginComponent text="Confirm" onPress={handleConfirm} />
        </View>
      </Modal>
    </View>
  );
};

export default DropdownPicker;

const styles = StyleSheet.create({});
