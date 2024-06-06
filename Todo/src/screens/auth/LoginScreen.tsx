import auth from '@react-native-firebase/auth';
import {Lock, Sms} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Container from '../../components/Container';
import InputComponent from '../../components/InputComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {globalStyles} from '../../styles/globalStyles';
import {validateEmailAndPassword} from '../../utils/ValidationResult';
import ButtonLoginComponent from './components/ButtonLoginComponent';

const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (email || password) {
      setErrorText('');
    }
  }, [email, password]);

  const handleLoginWithEmail = async () => {
    const {isValid, message} = validateEmailAndPassword(email, password);
    if (!isValid) {
      setErrorText(message);
      return;
    }

    setIsLoading(true);
    try {
      const userCredentials = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      console.log('User logged in:', userCredentials.user);
    } catch (error: any) {
      console.error('Login failed:', error);
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        setErrorText('Email or password is incorrect.');
      } else {
        setErrorText(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <SectionComponent
        styles={{
          justifyContent: 'center',
          flex: 1,
        }}>
        <TitleComponent
          text="Login"
          size={32}
          font={fontFamilies.bold}
          styles={{textTransform: 'uppercase', flex: 0, textAlign: 'center'}}
        />
        <View style={{marginVertical: 20}}>
          <InputComponent
            value={email}
            onChangeText={val => setEmail(val)}
            prefix={<Sms color={colors.desc} />}
            plaholder="Email"
            title="Email"
            alowClear
          />
          <InputComponent
            value={password}
            onChangeText={val => setPassword(val)}
            prefix={<Lock color={colors.desc} />}
            plaholder="Password"
            title="Password"
            isPassword
          />
          {errorText && (
            <TextComponent text={errorText} color={colors.danger} flex={0} />
          )}
        </View>
        <ButtonLoginComponent
          isLoading={isLoading}
          text="Login"
          onPress={handleLoginWithEmail}
        />
        <SpaceComponent height={20} />
        <Text style={[globalStyles.text, {textAlign: 'center'}]}>
          You don't have an account?{' '}
          <Text
            onPress={() => navigation.navigate('SignInScreen')}
            style={{color: colors.blue2}}>
            Create an account
          </Text>
        </Text>
      </SectionComponent>
    </Container>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
