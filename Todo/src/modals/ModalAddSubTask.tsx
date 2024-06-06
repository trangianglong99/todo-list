import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import RowComponent from '../components/RowComponent';
import TextComponent from '../components/TextComponent';
import ButtonLoginComponent from '../screens/auth/components/ButtonLoginComponent';
import {colors} from '../constants/colors';
import TitleComponent from '../components/TitleComponent';
import InputComponent from '../components/InputComponent';
import firestore from '@react-native-firebase/firestore';

interface Props {
  visible: boolean;
  subTask?: any;
  onClose: () => void;
  taskId: string;
}

const initValue = {
  title: '',
  description: '',
  isCompleted: false,
};

const ModalAddSubTask = (props: Props) => {
  const {visible, subTask, onClose, taskId} = props;
  const [subTaskForm, setSubTaskForm] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseModal = () => {
    setSubTaskForm(initValue);
    onClose();
  };

  const handleSaveToDatabase = async () => {
    const data = {
      ...subTaskForm,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      taskId,
    };

    setIsLoading(true);

    try {
      await firestore().collection('subTasks').add(data);
      setIsLoading(false);
      handleCloseModal();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      style={styles.modal}
      transparent
      animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TitleComponent text="Add New Subtask" size={24} />
          <View style={{marginVertical: 16}}>
            <InputComponent
              title="Title"
              plaholder="Title"
              value={subTaskForm.title}
              onChangeText={val =>
                setSubTaskForm({
                  ...subTaskForm,
                  title: val,
                })
              }
              styles={{
                borderWidth: 1,
                borderColor: colors.gray2,
              }}
              alowClear
            />
            <InputComponent
              title="Description"
              plaholder="Description"
              value={subTaskForm.description}
              onChangeText={val =>
                setSubTaskForm({...subTaskForm, description: val})
              }
              numberOfLines={3}
              multible
              styles={{
                borderWidth: 1,
                borderColor: colors.gray2,
              }}
              alowClear
              alignItem="flex-start"
            />
          </View>
          <RowComponent>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={handleCloseModal}>
                <TextComponent text="Close" flex={0} size={18} />
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
              <ButtonLoginComponent
                text="Save"
                onPress={handleSaveToDatabase}
                isLoading={isLoading}
              />
            </View>
          </RowComponent>
        </View>
      </View>
    </Modal>
  );
};

export default ModalAddSubTask;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.8,
    padding: 20,
    borderRadius: 12,
    backgroundColor: colors.bgColor,
  },
});
