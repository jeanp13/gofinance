import React, {
  useEffect,
  useState,
} from 'react';

import { VictoryPie } from 'victory-native';

import { HistoryCard } from '../../components/HistoryCard';
import {
  Container,
  Header,
  Title,
  Content,
  ChartContent,
} from './styles';

import { dataKey } from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '../../utils/categories';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../global/styles/theme';

interface TransactionData {
  name: string;
  amount: string;
  category: string;
  date: string;
  type: 'in' | 'out';
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [
    totalByCategories,
    setTotalByCategories,
  ] = useState<CategoryData[]>([]);

  async function loadData() {
    const response = await AsyncStorage.getItem(
      dataKey
    );
    const responseFormatted = response
      ? JSON.parse(response)
      : [];

    const expensives = responseFormatted.filter(
      (expensive: TransactionData) =>
        expensive.type === 'out'
    );

    const expensiveTotal = expensives.reduce(
      (
        acummulator: number,
        expensive: TransactionData
      ) => acummulator + Number(expensive.amount),
      0
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach(
        (expensive: TransactionData) => {
          if (
            expensive.category === category.key
          ) {
            categorySum += Number(
              expensive.amount
            );
          }
        }
      );
      if (categorySum > 0) {
        const totalFormatted =
          categorySum.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          });

        const percent = `${(
          (categorySum / expensiveTotal) *
          100
        ).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          totalFormatted,
          total: categorySum,
          color: category.color,
          percent,
        });
      }
    });

    setTotalByCategories(totalByCategory);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content>
        <ChartContent>
          <VictoryPie
            data={totalByCategories}
            x="percent"
            y="total"
            colorScale={totalByCategories.map(
              (category) => category.color
            )}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape,
              },
            }}
            labelRadius={50}
          />
        </ChartContent>

        {totalByCategories.map((item) => (
          <HistoryCard
            key={item.key}
            title={item.name}
            color={item.color}
            amount={item.totalFormatted}
          />
        ))}
      </Content>
    </Container>
  );
}
