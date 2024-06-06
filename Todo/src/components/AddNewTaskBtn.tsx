import React, {ReactNode} from 'react';
import {TouchableOpacity} from 'react-native';
import {colors} from '../constants/colors';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  onPress: () => void;
  children?: ReactNode;
  navigation?: any;
}

const AddNewTaskBtn = (props: Props) => {
  const {onPress, children, navigation} = props;
  return (
    <TouchableOpacity
      style={[
        globalStyles.row,
        {
          backgroundColor: colors.blue,
          padding: 16,
          borderRadius: 100,
          width: '80%',
        },
      ]}
      onPress={onPress ?? navigation.navigate('Add task')}>
      {children}
    </TouchableOpacity>
  );
};

export default AddNewTaskBtn;
