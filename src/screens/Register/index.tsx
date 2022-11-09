import React, {
  useEffect,
  useState,
} from 'react';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

import {
  Control,
  FieldValues,
  useForm,
} from 'react-hook-form';
import {
  Alert,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '../../components/Forms/Button';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { InputForm } from '../../components/Forms/InputForm';
import { TransactionTypebutton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { dataKey } from '../../utils/constants';
interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object()
  .shape({
    name: Yup.string().required(
      'Nome é obrigatório'
    ),
    amount: Yup.number()
      .typeError('Informe um valor numérico')
      .positive(
        'O valor não pode ser menor que zero'
      )
      .required('Valor é obrigatório'),
  })
  .required();

export function Register() {
  const navigation = useNavigation();

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });
  const [transactionType, setTransactionType] =
    useState('');
  const [
    categoryModalOpen,
    setCategoryModalOpen,
  ] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const formControll =
    control as unknown as Control<
      FieldValues,
      any
    >;

  function handleTransactionsTypeSelect(
    type: 'in' | 'out'
  ) {
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  async function handleRegister(form: FormData) {
    if (!transactionType)
      return Alert.alert(
        'Selecione o tipo da Transação'
      );

    if (category.key === 'category')
      return Alert.alert('Selecione a categoria');

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
      date: new Date(),
      type: transactionType,
    };

    try {
      const data = await AsyncStorage.getItem(
        dataKey
      );
      const currentData = data
        ? JSON.parse(data)
        : [];
      const dataFormatted = [
        ...currentData,
        newTransaction,
      ];

      await AsyncStorage.setItem(
        dataKey,
        JSON.stringify(dataFormatted)
      );

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });

      navigation.navigate('Listagem');
    } catch (error) {
      console.log(error);
      Alert.alert("'Não foi possível salvar");
    }
  }

  useEffect(() => {
    // async function loadData() {
    //   const data = await AsyncStorage.getItem(dataKey);
    //   console.log(JSON.parse(data!));
    // }
    // async function removeAll() {
    //   await AsyncStorage.removeItem(dataKey);
    // }
    // loadData();
    //// removeAll();
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              placeholder="Nome"
              name="name"
              control={formControll}
              autoCapitalize="sentences"
              autoCorrect={false}
              error={
                errors?.name &&
                errors.name.message
              }
            />
            <InputForm
              placeholder="Preço"
              name="amount"
              control={formControll}
              keyboardType="numeric"
              error={
                errors?.amount &&
                errors.amount.message
              }
            />
            <TransactionTypes>
              <TransactionTypebutton
                title="Entrada"
                type="in"
                onPress={() =>
                  handleTransactionsTypeSelect(
                    'in'
                  )
                }
                isActive={
                  transactionType === 'in'
                }
              />
              <TransactionTypebutton
                title="Saída"
                type="out"
                onPress={() =>
                  handleTransactionsTypeSelect(
                    'out'
                  )
                }
                isActive={
                  transactionType === 'out'
                }
              />
            </TransactionTypes>

            <CategorySelectButton
              title={category.name}
              onPress={
                handleOpenSelectCategoryModal
              }
            />
          </Fields>

          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={
              handleCloseSelectCategoryModal
            }
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
