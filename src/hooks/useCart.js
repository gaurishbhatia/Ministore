import { useCartContext } from '../context/CartContext';

export const useCart = () => {
  const { state, dispatch } = useCartContext();

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  return {
    cart: state.items,
    total: state.total,
    itemCount: state.itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
};
