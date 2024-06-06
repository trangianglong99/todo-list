import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {serverKey} from '../constants/appInfos';

const user = auth().currentUser;

export class handleNotification {
  static checkNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission({
      sound: false,
      announcement: true,
      alert: true,
      badge: true,
    });
    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      this.getFcmToken();
    }
  };

  static getFcmToken = async () => {
    const fmcToken = await AsyncStorage.getItem('fcmToken');

    if (!fmcToken) {
      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem('fcmToken', token);
        this.UpdateFcmToken(token);
      }
    }
  };

  static UpdateFcmToken = async (token: string) => {
    await firestore()
      .doc(`users/${user?.uid}`)
      .get()
      .then(snap => {
        if (snap.exists) {
          const data: any = snap.data();
          if (!data.tokens || !data.tokens.includes(token)) {
            firestore()
              .doc(`users/${user?.uid}`)
              .update({
                tokens: firestore.FieldValue.arrayUnion(token),
              });
          }
        }
      });
  };

  static HandleSendNotification = async ({
    title,
    body,
    memberId,
    taskId,
  }: {
    title: string;
    memberId: string;
    body: string;
    taskId: string;
  }) => {
    try {
      await firestore()
        .collection('notifications')
        .add({
          title,
          body,
          taskId,
          createdAt: Date.now(),
          updateAt: Date.now(),
          uid: memberId,
          isRead: false,
        })
        .then(() => {
          console.log('Notification added');
        });

      const member: any = await firestore().doc(`users/${memberId}`).get();
      if (member && member.data().tokens) {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `key=${serverKey}`);
        myHeaders.append('Content-Type', 'application/json');

        const raw = JSON.stringify({
          registration: member.data().tokens,
          notification: {
            title,
            body,
          },
        });

        const requestOptions: any = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };

        fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.error(error));
      }
    } catch (error) {
      console.log(error);
    }
  };
}
