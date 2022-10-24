import React from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import {
  TrasactionsCard,
  TrasactionsCardProps,
} from '../../components/TransactionCard';

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
  Transactions,
  Title,
  TransactionsList,
} from './styles';

export interface DataListrProps extends TrasactionsCardProps {
  id: string;
}

export function Dashboard() {
  const data: DataListrProps[] = [
    {
      id: '1',
      title: 'Desenvolvimento de site',
      amount: 'R$ 12.500,00',
      category: { name: 'Vendas', icon: 'dollar-sign' },
      date: '12/04/2022',
      type: 'positive',
    },
    {
      id: '2',
      title: 'Hamburgeria Pizzy',
      amount: 'R$ 59,00',
      category: { name: 'Alimentação', icon: 'coffee' },
      date: '12/04/2022',
      type: 'negative',
    },
    {
      id: '3',
      title: 'Aluguel',
      amount: 'R$ 12.500,00',
      category: { name: 'Aluguel', icon: 'shopping-bag' },
      date: '12/04/2022',
      type: 'negative',
    },
  ];

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
      <Transactions>
        <Title>Listagem</Title>
        <TransactionsList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TrasactionsCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}
