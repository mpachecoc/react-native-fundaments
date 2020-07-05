import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  // TODO RETURN THE SUM OF THE PRICE FROM ALL ITEMS IN THE CART
  const cartTotal = useMemo(() => {
    const totalPrice = products.reduce((sum, product) => {
      return sum + product.quantity * product.price;
    }, 0);

    return formatValue(totalPrice);
  }, [products]);

  // TODO RETURN THE SUM OF THE QUANTITY OF THE PRODUCTS IN THE CART
  const totalItensInCart = useMemo(() => {
    const totalQuantity = products.reduce((sum, product) => {
      return sum + product.quantity;
    }, 0);

    return totalQuantity;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
