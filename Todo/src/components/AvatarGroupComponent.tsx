import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';
import firestore from '@react-native-firebase/firestore';
import AvatarComponent from './AvatarComponent';

interface Props {
  uids: string[];
}

const AvatarGroupComponent = (props: Props) => {
  const {uids} = props;
  const [userName, setUserName] = useState<string[]>([]);
  useEffect(() => {
    getUserAvatar();
  }, [uids]);

  const getUserAvatar = async () => {
    const items: any = [...userName];
    uids.forEach(async (id: string) => {
      await firestore()
        .doc(`users/${id}`)
        .get()
        .then((snap: any) => {
          if (snap.exists) {
            items.push({
              name: snap.data().displayName,
              imgURl: snap.data().imgURl ?? '',
            });
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
    setUserName(items);
  };
  const imgStyle = {
    width: 30,
    height: 30,
    borderRadius: 100,
    borderColor: colors.white,
  };
  return (
    <RowComponent styles={{justifyContent: 'flex-start', marginTop: 10}}>
      {uids.map(
        (item, index) =>
          index < 3 && <AvatarComponent uid={item} index={index} key={item} />,
      )}
      {uids.length > 3 && (
        <View
          key={'total'}
          style={[
            imgStyle,
            {
              backgroundColor: 'coral',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: -10,
              borderWidth: 1,
            },
          ]}>
          <TextComponent
            flex={0}
            size={16}
            font={fontFamilies.semiBold}
            text={`+${uids.length - 3 > 9 ? 9 : uids.length - 3}`}
          />
        </View>
      )}
    </RowComponent>
  );
};

export default AvatarGroupComponent;

const styles = StyleSheet.create({});
