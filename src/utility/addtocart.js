import axiosInstance from "../interceptors/axios";

const handleAddToCart = async (product, quantity, setAlertMessage, setSuccessStatus, setIsAlertLoaded) => {
  const cartItem = {
    action: 'add',
    product: {'id': product.id, 'price': product.price},
    quantity: quantity,
  };

  setIsAlertLoaded(false);

  try {
    if (quantity < product.stock_number) {
      try {
        const response = await axiosInstance.post('http://localhost:8000/api/cart/', cartItem);
        console.log('Item added to cart:', response.data);
        setAlertMessage('Item successfully added to cart!')
        setSuccessStatus(true)
      } catch (error) {
        console.error('Error adding item to cart:', error);
        setAlertMessage('Failed to add item to cart.')
        setSuccessStatus(false)
      }
    } else {
      setAlertMessage('Quantity exceeds available stock.')
      setSuccessStatus(false)
    }
  } finally {
    setIsAlertLoaded(true);
  }
};

export default handleAddToCart;