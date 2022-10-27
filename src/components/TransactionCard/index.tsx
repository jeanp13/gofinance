import React from 'react';

import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
} from './styles';

import { categories } from '../../utils/categories';

export interface TrasactionsCardProps {
  id: string;
  name: string;
  amount: string;
  category: string;
  date: string;
  type: 'in' | 'out';
}
interface Props {
  data: TrasactionsCardProps;
}

export function TrasactionsCard({ data }: Props) {
  const category = categories.filter((item) => item.key === data.category)[0];
  return (
    <Container>
      <Title>{data.name}</Title>
      <Amount type={data.type}>
        {data.type === 'out' && '- '}
        {data.amount}
      </Amount>
      <Footer>
        <Category>
          <Icon name={category.icon} />
          <CategoryName>{category.name}</CategoryName>
        </Category>
        <Date>{data.date}</Date>
      </Footer>
    </Container>
  );
}
