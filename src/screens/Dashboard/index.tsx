import React from 'react';
import { HighlightCard } from '../../components/HighlightCard';

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
  HighlightCards,
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
          <Icon name="power" />
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard
          title="Entrada"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
          type="up"
        />
        <HighlightCard
          title="Saída"
          amount="R$ 1.259,00"
          lastTransaction="Última saída dia 13 de abril"
          type="down"
        />
        <HighlightCard
          title="Total"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
          type="total"
        />
      </HighlightCards>
    </Container>
  );
}
