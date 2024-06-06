import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {colors} from '../constants/colors';
import {globalStyles} from '../styles/globalStyles';
import {fontFamilies} from '../constants/fontFamilies';
import {UserDetail} from '../models/UserDetail';

interface Props {
  uid: string;
  index?: number;
}

const AvatarComponent = (props: Props) => {
  const {uid, index} = props;
  const [userDetail, setUserDetail] = useState<UserDetail>();

  useEffect(() => {
    firestore()
      .doc(`users/${uid}`)
      .get()
      .then((snap: any) => {
        snap.exists &&
          setUserDetail({
            uid,
            ...snap.data(),
          });
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  }, [uid]);

  const imgStyle = {
    width: 30,
    height: 30,
    borderRadius: 100,
    borderColor: colors.white,
  };

  return userDetail ? (
    userDetail.imgUrl ? (
      <Image
        source={{uri: userDetail.imgUrl}}
        key={`images${uid}`}
        style={[
          imgStyle,
          {
            marginLeft: index && index > 0 ? -10 : 0,
          },
        ]}
      />
    ) : (
      <View
        key={`images${uid}`}
        style={[
          imgStyle,
          {
            marginLeft: index && index > 0 ? -10 : 0,
            backgroundColor: colors.gray2,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <Text
          style={[
            globalStyles.text,
            {fontFamily: fontFamilies.bold, fontSize: 12},
          ]}>
          {userDetail.displayName.substring(0, 1).toUpperCase()}
        </Text>
      </View>
    )
  ) : (
    <></>
  );
};

export default AvatarComponent;

const styles = StyleSheet.create({});
