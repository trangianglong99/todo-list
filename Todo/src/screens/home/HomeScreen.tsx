import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  Add,
  Edit2,
  Element4,
  Logout,
  Notification,
  SearchNormal1,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import AddNewTaskBtn from '../../components/AddNewTaskBtn';
import AvatarGroupComponent from '../../components/AvatarGroupComponent';
import CardComponent from '../../components/CardComponent';
import CardImageComponent from '../../components/CardImageComponent';
import CiculatorComponent from '../../components/CiculatorComponent';
import Container from '../../components/Container';
import ProgressBarComponent from '../../components/ProgressBarComponent';
import RowComponent from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TagComponent from '../../components/TagComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {TaskModel} from '../../models/TaskModel';
import {globalStyles} from '../../styles/globalStyles';
import {HandleDatetime} from '../../utils/handleDatetime';
import {handleNotification} from '../../utils/handleNotification';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';

const date = new Date(Date.now());

const HomeScreen = ({navigation}: any) => {
  const user = auth().currentUser;
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [urgentTasks, setUrgentTasks] = useState<TaskModel[]>([]);
  useEffect(() => {
    getNewTask();
    handleNotification.checkNotificationPermission();
  }, []);

  useEffect(() => {
    if (tasks) {
      const items = tasks.filter(element => element.isUrgent);
      setUrgentTasks(items);
    }
  }, [tasks]);

  const getNewTask = () => {
    setIsLoading(true);
    firestore()
      .collection('tasks')
      .where('uids', 'array-contains', user?.uid)
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log('Tasks not found');
        } else {
          const items: TaskModel[] = [];
          snap.forEach((item: any) => {
            items.push({
              id: item.id,
              ...item.data(),
            });
          });
          setIsLoading(false);
          setTasks(
            items.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)),
          );
        }
      });
  };

  const handleMoveToTaskDetail = (id?: string, color?: string) => {
    navigation.navigate('Task Detail', {
      id,
      color,
    });
  };

  return (
    <View style={{flex: 1}}>
      <Container isScroll>
        <SectionComponent>
          <RowComponent justify="space-between">
            <Element4 size={20} color={colors.desc} />
            <Notification size={20} color={colors.desc} />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent>
            <View style={{flex: 1}}>
              <TextComponent text={`Hi, ${user?.email}`} />
              <TitleComponent text="Be productive today" />
            </View>
            <TouchableOpacity onPress={async () => auth().signOut()}>
              <Logout size={20} color={colors.danger} />
            </TouchableOpacity>
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent
            styles={[globalStyles.inputContainer]}
            onPress={() =>
              navigation.navigate('List Task', {
                tasks,
              })
            }>
            <TextComponent color="#696b6f" text="Search task" />
            <SearchNormal1 size={20} color={colors.desc} />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <CardComponent
            onPress={() =>
              navigation.navigate('List Task', {
                tasks,
              })
            }>
            <RowComponent>
              <View style={{flex: 1}}>
                <TitleComponent text="Task progress" />
                <TextComponent
                  text={`${
                    tasks.filter(
                      element => element.progress && element.progress === 1,
                    ).length
                  }/${tasks.length} tasks done`}
                />
                <SpaceComponent height={12} />
                <RowComponent justify="flex-start">
                  <TagComponent text="">
                    <DateTimePickerComponent
                      onSelected={date => {
                        console.log(date);
                      }}
                      title={`${HandleDatetime.DateTime(date.getTime())}`}
                      plaholder="Choice"
                      type="date"
                    />
                  </TagComponent>
                  {/* <TagComponent
                    text={`${HandleDatetime.DateTime(date.getTime())}`}
                    onPress={() => console.log('hello Long')}
                  /> */}
                </RowComponent>
                <SpaceComponent height={10} />
              </View>
              <View>
                <CiculatorComponent value={80} />
              </View>
            </RowComponent>
          </CardComponent>
        </SectionComponent>
        {isLoading ? (
          <ActivityIndicator />
        ) : tasks.length > 0 ? (
          <SectionComponent>
            <View style={{flex: 1}}>
              <RowComponent styles={{alignItems: 'flex-start'}}>
                <View style={{flex: 1}}>
                  {tasks.slice(0, 1).map((task, index) => {
                    let cardColor = colors.blue;
                    let cardHeight = 330;

                    return (
                      <CardImageComponent
                        key={task.id}
                        color={cardColor}
                        styles={{height: cardHeight}}
                        onPress={() =>
                          handleMoveToTaskDetail(task.id as string, cardColor)
                        }>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Add task', {
                              id: task.id,
                              editable: true,
                            })
                          }
                          style={[globalStyles.iconContainer]}>
                          <Edit2 size={20} color={colors.white} />
                        </TouchableOpacity>
                        <TitleComponent text={task.title} />
                        <TextComponent
                          text={task.description}
                          size={13}
                          line={3}
                        />
                        <View>
                          {task.uids && (
                            <AvatarGroupComponent uids={task.uids} />
                          )}
                          {task.progress && task.progress > 0 ? (
                            <ProgressBarComponent
                              percent={`${Math.floor(task.progress * 100)}%`}
                              color="#0aacff"
                              size="default"
                            />
                          ) : null}
                        </View>
                        <SpaceComponent height={80} />
                        {task.dueDate && (
                          <TextComponent
                            text={`Due date: ${HandleDatetime.DateTime(
                              task.dueDate.toDate(),
                            )}`}
                          />
                        )}
                      </CardImageComponent>
                    );
                  })}
                </View>
                <SpaceComponent width={16} />
                <View style={{flex: 1}}>
                  {tasks.slice(1, 3).map((task, index) => {
                    let cardColor: string;
                    let cardHeight: number;

                    switch (index) {
                      case 0:
                        cardColor = 'rgba(33, 150, 243, 0.9)';
                        cardHeight = 200;
                        break;
                      case 1:
                        cardColor = 'rgba(18, 181, 22, 0.9)';
                        cardHeight = 120;
                        break;
                      default:
                        cardColor = 'rgba(33, 150, 243, 0.9)';
                        cardHeight = 335;
                    }

                    return (
                      <React.Fragment key={task.id}>
                        <CardImageComponent
                          color={cardColor}
                          styles={{height: cardHeight}}
                          onPress={() =>
                            handleMoveToTaskDetail(task.id as string, cardColor)
                          }>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('Add task', {
                                id: task.id,
                                editable: true,
                              })
                            }
                            style={[globalStyles.iconContainer]}>
                            <Edit2 size={20} color={colors.white} />
                          </TouchableOpacity>
                          <TitleComponent text={task.title} />
                          <TextComponent
                            text={task.description}
                            size={13}
                            line={3}
                          />
                          <View>
                            {index === 0 && task.uids && (
                              <AvatarGroupComponent uids={task.uids} />
                            )}
                            {index === 0 &&
                            task.progress &&
                            task.progress > 0 ? (
                              <ProgressBarComponent
                                percent={`${Math.floor(task.progress * 100)}%`}
                                color="#0aacff"
                                size="default"
                              />
                            ) : null}
                          </View>
                          <SpaceComponent height={80} />
                        </CardImageComponent>
                        {index === 0 && <SpaceComponent height={8} />}
                      </React.Fragment>
                    );
                  })}
                </View>
              </RowComponent>
            </View>
          </SectionComponent>
        ) : (
          <></>
        )}
        <SectionComponent>
          <TitleComponent
            key={`urgentTaskTitle`}
            text="Urgent tasks"
            font={fontFamilies.bold}
            size={21}
            flex={1}
          />
          {urgentTasks.length > 0 &&
            urgentTasks.map(item => (
              <React.Fragment key={`urgentTask${item.id}`}>
                <SpaceComponent height={16} />
                <CardComponent onPress={() => handleMoveToTaskDetail(item.id)}>
                  <RowComponent>
                    <CiculatorComponent
                      value={item.progress ? item.progress * 100 : 0}
                      radius={40}
                    />
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        paddingLeft: 20,
                      }}>
                      <TextComponent text={item.title} />
                    </View>
                  </RowComponent>
                </CardComponent>
              </React.Fragment>
            ))}
        </SectionComponent>
      </Container>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AddNewTaskBtn onPress={() => navigation.navigate('Add task')}>
          <TextComponent text="Add new tasks" flex={0} />
          <Add size={20} color={colors.white} />
        </AddNewTaskBtn>
      </View>
    </View>
  );
};

export default HomeScreen;
