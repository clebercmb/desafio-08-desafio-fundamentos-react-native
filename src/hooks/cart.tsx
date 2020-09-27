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

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      // await AsyncStorage.setItem(
      //   '@Challenge-08:products-cart',
      //   JSON.stringify([] as Product[]),
      // );
      const productsCart = await AsyncStorage.getItem(
        '@Challenge-08:products-cart',
      );

      if (productsCart) {
        setProducts(JSON.parse(productsCart));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      // TODO ADD A NEW ITEM TO THE CART
      const newProduct: Product = {
        ...product,
        quantity: 1,
      };

      const newProducts = [...products];
      const index = newProducts.findIndex(prod => prod.id === product.id);

      if (index >= 0) {
        newProducts[index].quantity += 1;
        setProducts([...newProducts]);
      } else {
        setProducts([...newProducts, newProduct]);
      }

      await AsyncStorage.setItem(
        '@Challenge-08:products-cart',
        JSON.stringify(products),
      );
      console.log('newProduct=', newProduct);
      console.log('products=', products);
      console.log('index=', index);
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART

      const newProducts = [...products];
      const index = newProducts.findIndex(prod => prod.id === id);

      if (index >= 0) {
        newProducts[index].quantity += 1;
        setProducts([...newProducts]);

        await AsyncStorage.setItem(
          '@Challenge-08:products-cart',
          JSON.stringify(newProducts),
        );
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      console.log('decrement.id=', id);
      const newProducts = [...products];
      const index = newProducts.findIndex(prod => prod.id === id);

      if (index >= 0 && newProducts[index].quantity > 0) {
        newProducts[index].quantity -= 1;
        setProducts(newProducts);

        await AsyncStorage.setItem(
          '@Challenge-08:products-cart',
          JSON.stringify(newProducts),
        );
      }
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
