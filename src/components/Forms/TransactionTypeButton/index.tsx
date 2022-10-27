import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Button, Container, Icon, Title } from './styles';

interface Props extends RectButtonProperties {
  title: string;
  type: 'in' | 'out';
  isActive: boolean;
}

const icons = {
  in: 'arrow-up-circle',
  out: 'arrow-down-circle',
};

export function TransactionTypebutton({
  title,
  type,
  isActive,
  ...rest
}: Props) {
  return (
    <Container isActive={isActive} type={type}>
      <Button {...rest}>
        <Icon name={icons[type]} type={type} />
        <Title>{title}</Title>
      </Button>
    </Container>
  );
}
