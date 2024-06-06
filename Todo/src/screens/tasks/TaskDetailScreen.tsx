import firestore from '@react-native-firebase/firestore';
import {
  AddSquare,
  ArrowLeft2,
  CalendarEdit,
  Clock,
  TickCircle,
  TickSquare,
} from 'iconsax-react-native';

import {Slider} from '@miblanchard/react-native-slider';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AvatarGroupComponent from '../../components/AvatarGroupComponent';
import CardComponent from '../../components/CardComponent';
import RowComponent from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import ModalAddSubTask from '../../modals/ModalAddSubTask';
import {AttachmentModel} from '../../models/AttachmentModel';
import {SubTask, TaskModel} from '../../models/TaskModel';
import {calcFileSize} from '../../utils/calcFileSize';
import {HandleDatetime} from '../../utils/handleDatetime';
import ButtonLoginComponent from '../auth/components/ButtonLoginComponent';
import UpLoadFileComponent from './components/UpLoadFileComponent';
import {err} from 'react-native-svg';
import {handleNotification} from '../../utils/handleNotification';
import auth from '@react-native-firebase/auth';

const TaskDetailScreen = ({navigation, route}: any) => {
  const {id, color}: {id: string; color?: string} = route.params;
  const [taskDetail, setTaskDetail] = useState<TaskModel>();
  const [progress, setProgress] = useState(0);
  const [attachment, setAttachment] = useState<AttachmentModel[]>([]);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isVisibleSubTaskModal, setIsVisibleSubTaskModal] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const user = auth().currentUser;

  useEffect(() => {
    getTaskDetail();
    getSubTasksById();
  }, []);

  useEffect(() => {
    if (taskDetail) {
      setProgress(taskDetail.progress ?? 0);
      setAttachment(taskDetail.attachment);
      setIsUrgent(taskDetail.isUrgent ?? false);
    }
  }, [taskDetail]);

  useEffect(() => {
    if (
      progress !== taskDetail?.progress ||
      attachment !== taskDetail.attachment
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [progress, taskDetail, attachment]);

  useEffect(() => {
    if (subTasks.length > 0) {
      const completed =
        subTasks.filter(element => element.isCompleted).length /
        subTasks.length;
      setProgress(completed);
    }
  }, [subTasks]);

  const getTaskDetail = () => {
    firestore()
      .doc(`tasks/${id}`)
      .onSnapshot((snap: any) => {
        if (snap.exists) {
          setTaskDetail({
            id,
            ...snap.data(),
          });
        } else {
          console.log('Task detail not found');
        }
      });
  };

  const handleUpdateTask = async () => {
    const data = {...taskDetail, progress, attachment, updateAt: Date.now()};

    await firestore()
      .doc(`tasks/${id}`)
      .update(data)
      .then(() => {
        Alert.alert('Success', 'Task updated successfully');
        navigation.goBack();
      })
      .catch(error => console.log(error));
  };

  const handleUpdateUrgentTask = () => {
    firestore().doc(`tasks/${id}`).update({
      isUrgent: !isUrgent,
      updateAt: Date.now(),
    });
  };
  const getSubTasksById = () => {
    firestore()
      .collection('subTasks')
      .where('taskId', '==', id)
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log('Data not found');
        } else {
          const items: SubTask[] = [];
          snap.forEach((item: any) => {
            items.push({
              id: item.id,
              ...item.data(),
            });
          });
          setSubTasks(items);
        }
      });
  };

  console.log('subTasks', subTasks);

  const handleUpdateSubTask = async (id: string, isCompleted: boolean) => {
    try {
      await firestore().doc(`subTasks/${id}`).update({
        isCompleted: !isCompleted,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this task?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await firestore()
            .doc(`tasks/${id}`)
            .delete()
            .then(() => {
              taskDetail?.uids.forEach(id => {
                handleNotification.HandleSendNotification({
                  title: 'Delete task',
                  body: `You task have deleted by ${user?.email}`,
                  memberId: id,
                  taskId: '',
                });
              });

              navigation.goBack();
            })
            .catch(err => console.log(err));
        },
      },
    ]);
  };

  return taskDetail ? (
    <>
      <ScrollView style={{flex: 1, backgroundColor: colors.bgColor}}>
        <SectionComponent
          styles={{
            backgroundColor: color ?? 'rgba(113, 77, 217, 0.9)',
            paddingVertical: 20,
            paddingTop: 58,
            borderRadius: 20,
          }}>
          <RowComponent>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft2 size={24} color={colors.text} />
            </TouchableOpacity>
            <SpaceComponent width={12} />
            <TitleComponent
              line={1}
              text={taskDetail.title}
              size={22}
              flex={1}
              styles={{marginTop: 0}}
            />
          </RowComponent>
          <SpaceComponent height={30} />
          <TextComponent text="Due date" color={colors.text} />
          <RowComponent
            styles={{
              marginTop: 8,
            }}>
            <RowComponent styles={{flex: 1}}>
              <Clock size={18} color={colors.text} />
              <SpaceComponent width={8} />
              <TextComponent
                text={`${HandleDatetime.getHour(
                  taskDetail.end.toDate(),
                )} - ${HandleDatetime.getHour(taskDetail.end.toDate())}`}
                size={10}
              />
            </RowComponent>
            <RowComponent styles={{flex: 1}}>
              <CalendarEdit size={18} color={colors.text} />
              <SpaceComponent width={8} />
              <TextComponent
                text={`${HandleDatetime.DateTime(taskDetail.dueDate.toDate())}`}
              />
            </RowComponent>
            <RowComponent styles={{flex: 1}} justify="flex-end">
              <AvatarGroupComponent uids={taskDetail.uids} />
            </RowComponent>
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <TitleComponent text="Description" size={22} />
          <CardComponent
            bgColor={colors.bgColor}
            styles={{
              borderWidth: 1,
              borderColor: colors.gray2,
              borderRadius: 12,
              marginTop: 12,
            }}>
            <TextComponent text={taskDetail.description} />
          </CardComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent onPress={handleUpdateUrgentTask}>
            <TickSquare
              variant={isUrgent ? 'Bold' : 'Outline'}
              size={24}
              color={colors.white}
            />
            <SpaceComponent width={8} />
            <TextComponent
              text={`Is Urgent`}
              size={18}
              color={colors.text}
              flex={1}
              font={fontFamilies.bold}
            />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent>
            <TitleComponent size={24} text="File & Link" flex={1} />
            <UpLoadFileComponent
              onUpload={file => file && setAttachment([...attachment, file])}
            />
          </RowComponent>
          <SpaceComponent height={12} />
          {attachment.map((item, index) => (
            <View
              style={{justifyContent: 'flex-start', marginBottom: 8}}
              key={`attachment${index}`}>
              <TextComponent size={16} text={item.name} flex={0} />
              <TextComponent
                size={12}
                text={calcFileSize(item.size)}
                flex={0}
              />
            </View>
          ))}
        </SectionComponent>
        <SectionComponent>
          <RowComponent>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: colors.green,
                marginRight: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: colors.green,
                  width: 16,
                  height: 16,
                  borderRadius: 12,
                }}
              />
            </View>
            <TextComponent
              text="Progress"
              flex={1}
              size={18}
              font={fontFamilies.medium}
            />
          </RowComponent>
          <SpaceComponent height={12} />
          <RowComponent>
            <View style={{flex: 1}}>
              <Slider
                disabled
                value={progress}
                onValueChange={value => setProgress(value[0])}
                thumbTintColor={colors.green}
                maximumTrackTintColor={colors.gray2}
                minimumTrackTintColor={colors.green}
                trackStyle={{height: 10, borderRadius: 100}}
                thumbStyle={{borderWidth: 2, borderColor: colors.white}}
              />
            </View>
            <SpaceComponent width={20} />
            <TextComponent
              text={`${Math.floor(progress * 100)}%`}
              size={18}
              flex={0}
              font={fontFamilies.bold}
            />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent justify="space-between">
            <TitleComponent text="Sub tasks" size={20} />
            <TouchableOpacity onPress={() => setIsVisibleSubTaskModal(true)}>
              <AddSquare size={24} variant="Bold" color={colors.green} />
            </TouchableOpacity>
          </RowComponent>
          <SpaceComponent height={18} />
          {subTasks.length > 0 &&
            subTasks.map((item, index) => (
              <CardComponent
                key={`subtask${index}`}
                styles={{marginBottom: 12}}>
                <RowComponent
                  onPress={() =>
                    handleUpdateSubTask(item.id, item.isCompleted)
                  }>
                  <TickCircle
                    size={24}
                    variant={item.isCompleted ? 'Bold' : 'Outline'}
                    color={colors.green}
                  />
                  <View style={{flex: 1, marginLeft: 12}}>
                    <TextComponent text={item.title} />
                    <TextComponent
                      text={HandleDatetime.DateTime(item.createdAt)}
                    />
                  </View>
                </RowComponent>
              </CardComponent>
            ))}
        </SectionComponent>
        <SectionComponent>
          <RowComponent onPress={handleDeleteTask}>
            <TextComponent text="Delete task" color={colors.danger} flex={0} />
          </RowComponent>
        </SectionComponent>
      </ScrollView>
      {isChanged && (
        <View
          style={{
            position: 'absolute',
            bottom: 30,
            left: 30,
            right: 30,
          }}>
          <ButtonLoginComponent text="Update" onPress={handleUpdateTask} />
        </View>
      )}

      <ModalAddSubTask
        taskId={id}
        visible={isVisibleSubTaskModal}
        onClose={() => setIsVisibleSubTaskModal(false)}
      />
    </>
  ) : (
    <></>
  );
};

export default TaskDetailScreen;

const styles = StyleSheet.create({
  documentImage: {
    marginHorizontal: 4,
  },
});
