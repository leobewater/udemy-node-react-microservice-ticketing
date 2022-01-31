import { useState, useEffect } from 'react';

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      // TODO - beware timezone may not implented on this calculator
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    // fire the timer right away
    findTimeLeft();
    
    // this wait 1s later before it starts
    const timerId = setInterval(findTimeLeft, 1000); 

    // clear timer when we navigate away
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return <div>Time left to pay: {timeLeft} seconds</div>;
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
