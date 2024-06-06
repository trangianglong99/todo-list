import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {CloseSquare} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import Container from '../../components/Container';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import InputComponent from '../../components/InputComponent';
import RowComponent from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TitleComponent from '../../components/TitleComponent';
import {colors} from '../../constants/colors';
import {AttachmentModel} from '../../models/AttachmentModel';
import {selectModel} from '../../models/SelectModel';
import {TaskModel} from '../../models/TaskModel';
import {handleNotification} from '../../utils/handleNotification';
import ButtonLoginComponent from '../auth/components/ButtonLoginComponent';
import DropdownPicker from './components/DropdownPicker';
import UpLoadFileComponent from './components/UpLoadFileComponent';

const initValue: TaskModel = {
  title: '',
  description: '',
  dueDate: undefined,
  start: undefined,
  end: undefined,
  uids: [],
  attachment: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const AddNewtasksScreen = ({navigation, route}: any) => {
  const {editable, task}: {editable?: boolean; task?: TaskModel} =
    route.params ?? {};

  const [taskDetail, setTaskDetail] = useState<TaskModel>(initValue);
  const [usersSelect, setUsersSelect] = useState<selectModel[]>([]);
  const [attachments, setAttachments] = useState<AttachmentModel[]>([]);

  const user = auth().currentUser;

  useEffect(() => {
    handleGetAllUsers();
  }, []);

  useEffect(() => {
    user && setTaskDetail({...taskDetail, uids: [user.uid]});
  }, [user]);

  useEffect(() => {
    task &&
      setTaskDetail({
        ...taskDetail,
        title: task.title,
        description: task.description,
        uids: task.uids,
      });
  }, [task]);

  console.log(task);

  const handleGetAllUsers = async () => {
    await firestore()
      .collection('users')
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log(`users data not found`);
        } else {
          const items: selectModel[] = [];
          snap.forEach(item => {
            items.push({
              label: item.data().displayName,
              value: item.id,
            });
          });
          setUsersSelect(items);
        }
      })
      .catch(error => {
        console.log(`Can not get users, ${error.message}`);
      });
  };

  const handleChangeValue = (id: string, value: string | string[] | Date) => {
    const item: any = {...taskDetail};
    item[`${id}`] = value;
    setTaskDetail(item);
  };

  const handAddNewTask = async () => {
    if (user) {
      const data = {
        ...taskDetail,
        attachments,
        createdAt: task ? task.createdAt : Date.now(),
        updatedAt: Date.now(),
      };

      if (task) {
        await firestore()
          .doc(`tasks/${task.id}`)
          .update(data)
          .then(() => {
            if (usersSelect.length > 0) {
              usersSelect.forEach(member => {
                member.value !== user.uid &&
                  handleNotification.HandleSendNotification({
                    title: 'Update task',
                    body: `Your task updated by ${user?.email}`,
                    memberId: member.value,
                    taskId: task?.id ?? '',
                  });
              });
            }
            navigation.goBack();
          });
      } else {
        await firestore()
          .collection('tasks')
          .add(data)
          .then(snap => {
            if (usersSelect.length > 0) {
              usersSelect.forEach(member => {
                member.value !== user.uid &&
                  handleNotification.HandleSendNotification({
                    title: 'New task',
                    body: `You have a new task asign by ${user?.email}`,
                    memberId: member.value,
                    taskId: snap.id,
                  });
              });
            }
            navigation.goBack();
          })
          .catch(error => {
            console.log(`Can not add new task, ${error.message}`);
          });
      }
    } else {
      Alert.alert('Please login to continue');
    }
  };

  return (
    <Container back title="Add new tasks">
      <SectionComponent>
        <InputComponent
          value={taskDetail.title}
          onChangeText={val => handleChangeValue('title', val)}
          title="Title"
          alowClear
          plaholder="Enter title"
        />
        <InputComponent
          value={taskDetail.description}
          onChangeText={val => handleChangeValue('description', val)}
          title="Description"
          alowClear
          plaholder="Content"
          multible
          numberOfLines={4}
          alignItem="flex-start"
        />

        <DateTimePickerComponent
          selected={taskDetail.dueDate}
          onSelected={val => handleChangeValue('dueDate', val)}
          plaholder="Choice"
          title="Due date"
          type="date"
        />
        <RowComponent>
          <View style={{flex: 1}}>
            <DateTimePickerComponent
              selected={taskDetail.start}
              onSelected={val => handleChangeValue('start', val)}
              title="Start time"
              type="time"
            />
          </View>
          <SpaceComponent width={16} />
          <View style={{flex: 1}}>
            <DateTimePickerComponent
              selected={taskDetail.end}
              onSelected={val => handleChangeValue('end', val)}
              title="End time"
              type="time"
            />
          </View>
        </RowComponent>
        <DropdownPicker
          selected={taskDetail.uids}
          items={usersSelect}
          onSelected={val => handleChangeValue('uids', val)}
          multible
          title="Members"
        />

        <View>
          <RowComponent justify="flex-start">
            <TitleComponent text="Attachments" flex={0} size={18} />
            <SpaceComponent width={8} />
            <UpLoadFileComponent
              onUpload={file => file && setAttachments([...attachments, file])}
            />
          </RowComponent>
          <SpaceComponent height={8} />
          {attachments.length > 0 && (
            <RowComponent>
              {attachments.map((item, index) => (
                <RowComponent
                  key={`attachment${index}`}
                  styles={{
                    backgroundColor: colors.gray2,
                    borderRadius: 4,
                    padding: 8,
                    marginRight: 8,
                    paddingVertical: 12,
                  }}>
                  <TitleComponent text={item.name || ''} />
                  <SpaceComponent width={8} />
                  <CloseSquare size={20} color={colors.white} />
                </RowComponent>
              ))}
            </RowComponent>
          )}
        </View>
      </SectionComponent>
      <SectionComponent>
        <ButtonLoginComponent
          text={task ? 'Update' : 'Save'}
          onPress={handAddNewTask}
        />
      </SectionComponent>
    </Container>
  );
};

export default AddNewtasksScreen;
