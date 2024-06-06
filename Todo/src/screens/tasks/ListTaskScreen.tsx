import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Container from '../../components/Container';
import TextComponent from '../../components/TextComponent';
import {TaskModel} from '../../models/TaskModel';
import TitleComponent from '../../components/TitleComponent';
import SectionComponent from '../../components/SectionComponent';
import InputComponent from '../../components/InputComponent';
import {SearchNormal1} from 'iconsax-react-native';
import {colors} from '../../constants/colors';
import {replaceName} from '../../utils/replaceName';

const ListTaskScreen = ({navigation, route}: any) => {
  const {tasks}: {tasks: TaskModel[]} = route.params;
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<TaskModel[]>([]);

  useEffect(() => {
    if (!searchKey) {
      setResults([]);
    } else {
      const items = tasks.filter(element =>
        replaceName(element.title)
          .toLowerCase()
          .includes(replaceName(searchKey).toLowerCase()),
      );
      setResults(items);
    }
  }, [searchKey]);

  return (
    <Container back title="List Task">
      <SectionComponent>
        <InputComponent
          value={searchKey}
          onChangeText={val => setSearchKey(val)}
          alowClear
          prefix={<SearchNormal1 color={colors.white} />}
          plaholder="Search task..."
        />
      </SectionComponent>
      <FlatList
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        data={searchKey ? results : tasks}
        ListEmptyComponent={
          <SectionComponent>
            <TextComponent text="No data" />
          </SectionComponent>
        }
        renderItem={({item}) => (
          <TouchableOpacity
            style={{marginBottom: 20, paddingHorizontal: 16}}
            onPress={() =>
              navigation.navigate('Task Detail', {
                id: item.id,
              })
            }
            key={item.id}>
            <TitleComponent text={item.title} />
            <TextComponent text={item.description} line={2} />
          </TouchableOpacity>
        )}
      />
    </Container>
  );
};

export default ListTaskScreen;
