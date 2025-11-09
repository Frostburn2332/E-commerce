// Exchange rate: 1 USD = 80 INR
export const USD_TO_INR_RATE = 80;

export const convertToINR = (usdPrice) => {
  return (usdPrice * USD_TO_INR_RATE).toFixed(2);
};
