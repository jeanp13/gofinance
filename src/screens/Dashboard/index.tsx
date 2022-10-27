import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
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
  TransactionList,
  LogoutButton,
  LoadContainer,
} from './styles';

import { useTheme } from 'styled-components';

export interface DataListProps extends TrasactionsCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  cost: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const { colors } = useTheme();

  const [isLoading, setIsLoading] = useState(true);

  const [transaction, setTransaction] = useState<DataListProps[]>([]);

  const dataKey = '@gofinance:transactions';
  const [higtlightData, setHigtlightData] = useState<HighlightData>(
    {} as HighlightData
  );

  function getLastTransaction(
    collection: DataListProps[],
    type: 'in' | 'out' | 'total'
  ) {
    const lasTransaction = new Date(
      Math.max.apply(
        Math,
        collection
          .filter((item) => item.type === type || type === 'total')
          .map((item) => new Date(item.date).getTime())
      )
    );

    return `${lasTransaction.getDate()} de ${lasTransaction.toLocaleString(
      'pt-BR',
      { month: 'long' }
    )}`;
  }

  async function loadTransaction() {
    setIsLoading(true);
    let entriesTotal = 0;
    let costTotal = 0;

    const response = await AsyncStorage.getItem(dataKey);

    const data: DataListProps[] = response ? JSON.parse(response) : [];

    const transactionFormatted: DataListProps[] = data.map((item) => {
      if (item.type === 'in') {
        entriesTotal += Number(item.amount);
      } else {
        costTotal += Number(item.amount);
      }

      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      };
    });

    const entries = Number(entriesTotal).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const cost = Number(costTotal).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const total = Number(entriesTotal - costTotal).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    setHigtlightData({
      entries: {
        amount: entries,
        lastTransaction: `Última entrada dia ${getLastTransaction(data, 'in')}`,
      },
      cost: {
        amount: cost,
        lastTransaction: `Última saída dia ${getLastTransaction(data, 'out')}`,
      },
      total: {
        amount: total,
        lastTransaction: `01 à ${getLastTransaction(data, 'total')}`,
      },
    });

    setTransaction(transactionFormatted);
    setIsLoading(false);
  }

  function handleLogout() {
    console.log('Logout');
    Alert.alert('Logout');
  }

  // useEffect(() => {
  //// AsyncStorage.removeItem('@gofinance:transactions');
  // loadTransaction();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransaction();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={colors.primary} />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: 'https://github.com/jeanp13.png' }} />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>Jean</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={handleLogout}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard
              title="Entrada"
              amount={higtlightData.entries.amount}
              lastTransaction={higtlightData.entries.lastTransaction}
              type="in"
            />
            <HighlightCard
              title="Saída"
              amount={higtlightData.cost.amount}
              lastTransaction={higtlightData.cost.lastTransaction}
              type="out"
            />
            <HighlightCard
              title="Total"
              amount={higtlightData?.total?.amount}
              lastTransaction={higtlightData.total.lastTransaction}
              type="total"
            />
          </HighlightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={transaction}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TrasactionsCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
