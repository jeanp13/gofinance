import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { VictoryPie } from 'victory-native';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { HistoryCard } from '../../components/HistoryCard';
import {
  Container,
  Header,
  Title,
  Content,
  ChartContent,
  MonthSelect,
  MonthSelectIcon,
  SelectIcon,
  Month,
  LoadContainer,
} from './styles';

import { dataKey } from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '../../utils/categories';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../global/styles/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

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
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );

  function handleDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  const [totalByCategories, setTotalByCategories] =
    useState<CategoryData[]>([]);

  async function loadData() {
    setIsLoading(true);
    const response = await AsyncStorage.getItem(
      `${dataKey}:${user.id}`
    );
    const responseFormatted = response
      ? JSON.parse(response)
      : [];

    const expensives = responseFormatted.filter(
      (expensive: TransactionData) =>
        expensive.type === 'out' &&
        new Date(expensive.date).getMonth() ===
          selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() ===
          selectedDate.getFullYear()
    );

    const expensiveTotal = expensives.reduce(
      (acummulator: number, expensive: TransactionData) =>
        acummulator + Number(expensive.amount),
      0
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });
      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString(
          'pt-BR',
          {
            style: 'currency',
            currency: 'BRL',
          }
        );

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
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} />
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectIcon
              onPress={() => handleDateChange('prev')}
            >
              <SelectIcon name="chevron-left" />
            </MonthSelectIcon>

            <Month>
              {format(selectedDate, 'MMMM, yyyy', {
                locale: ptBR,
              })}
            </Month>

            <MonthSelectIcon
              onPress={() => handleDateChange('next')}
            >
              <SelectIcon name="chevron-right" />
            </MonthSelectIcon>
          </MonthSelect>

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
      )}
    </Container>
  );
}
