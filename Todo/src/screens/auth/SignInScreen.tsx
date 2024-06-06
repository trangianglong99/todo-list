import {Lock, Sms} from 'iconsax-react-native';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Container from '../../components/Container';
import InputComponent from '../../components/InputComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TitleComponent from '../../components/TitleComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {globalStyles} from '../../styles/globalStyles';
import ButtonLoginComponent from './components/ButtonLoginComponent';
import auth from '@react-native-firebase/auth';
import TextComponent from '../../components/TextComponent';
import {validateEmailAndPassword} from '../../utils/ValidationResult';
import {HandleUser} from '../../utils/handleUser';

const SignInScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (email || password || confirmPass) {
      setErrorText('');
    }
  }, [email, password, confirmPass]);

  const handleSignInWithEmail = async () => {
    setErrorText('');

    const {isValid, message} = validateEmailAndPassword(
      email,
      password,
      confirmPass,
    );
    if (!isValid) {
      setErrorText(message);
      return;
    }

    setIsLoading(true);
    try {
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          HandleUser.SaveToDatabse(user);
        });
    } catch (error: any) {
      console.error('Failed to create user:', error);
      setErrorText(error.message);
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
          text="Sign In"
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

          <InputComponent
            value={confirmPass}
            onChangeText={val => setConfirmPass(val)}
            prefix={<Lock color={colors.desc} />}
            plaholder="Confirm Password"
            title="Confirm Password"
            isPassword
          />
          {errorText && (
            <TextComponent text={errorText} color={colors.danger} flex={0} />
          )}
        </View>

        <ButtonLoginComponent
          isLoading={isLoading}
          text="Sign In"
          onPress={handleSignInWithEmail}
        />
        <SpaceComponent height={20} />
        <Text style={[globalStyles.text, {textAlign: 'center'}]}>
          You have an already account?{' '}
          <Text
            style={{color: colors.blue2}}
            onPress={() => navigation.navigate('LoginScreen')}>
            Login
          </Text>
        </Text>
      </SectionComponent>
    </Container>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({});
