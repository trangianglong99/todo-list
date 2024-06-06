import React, {ReactNode} from 'react';
import {TouchableOpacity} from 'react-native';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  children: ReactNode;
  onPress?: () => void;
}

const ButtonComponent = (props: Props) => {
  const {children, onPress} = props;
  return (
    <TouchableOpacity
      style={[
        globalStyles.row,
        {
          padding: 10,
          borderRadius: 100,
          width: '30%',
        },
      ]}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default ButtonComponent;
