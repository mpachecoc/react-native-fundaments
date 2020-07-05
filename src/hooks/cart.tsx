import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // TODO LOAD ITEMS FROM ASYNC STORAGE
  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // await AsyncStorage.removeItem('@GoMarketplace:products');
      const storagedProducts = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );
      if (storagedProducts) {
        setProducts([...JSON.parse(storagedProducts)]);
      }
    }

    loadProducts();
  }, []);

  // TODO ADD A NEW ITEM TO THE CART
  const addToCart = useCallback(
    async product => {
      const productIndex = products.findIndex(
        storeProducts => storeProducts.id === product.id,
      );

      if (productIndex < 0) {
        // If doesn't exist
        const newProduct = {
          ...product,
          quantity: 1,
        };

        setProducts([...products, newProduct]);
      } else {
        // If exists
        const existingProduct = products[productIndex];

        existingProduct.quantity += 1;

        setProducts(
          products.map(prod =>
            prod.id === existingProduct.id ? existingProduct : prod,
          ),
        );
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
  const increment = useCallback(
    async id => {
      const updatedProducts = products.map(prod =>
        prod.id === id ? { ...prod, quantity: prod.quantity + 1 } : prod,
      );

      setProducts(updatedProducts);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
  const decrement = useCallback(
    async id => {
      const updatedProducts = products.map(prod =>
        prod.id === id ? { ...prod, quantity: prod.quantity - 1 } : prod,
      );

      setProducts(updatedProducts);

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
