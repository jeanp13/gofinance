import React from 'react';
import { Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { SingInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from './styles';

export function SignIn() {
  const { signInWhithGoogle, signInWhithApple } = useAuth();

  async function handleSignInWithGoogle() {
    try {
      await signInWhithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Não foi possível acessar a conta Google'
      );
    }
  }
  async function handleSignInWithApple() {
    try {
      await signInWhithApple();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível acessar a conta Apple');
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>
        </TitleWrapper>
        <SignInTitle>
          Faça seu login com uma das contas abaixo.
        </SignInTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          <SingInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          <SingInSocialButton
            title="Entrar com Apple"
            svg={AppleSvg}
            onPress={handleSignInWithApple}
          />
        </FooterWrapper>
      </Footer>
    </Container>
  );
}
