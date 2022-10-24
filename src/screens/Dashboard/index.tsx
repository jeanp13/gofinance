import React from 'react';

import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
} from './styles';

export function Dashboard() {
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://github.com/jeanp13.png' }} />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Jean</UserName>
            </User>
          </UserInfo>
        </UserWrapper>
        <Icon name="power" />
      </Header>
    </Container>
  );
}
