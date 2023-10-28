import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export const deliveryOptions = [{
  id: '1',
  deliveryDays: 7,
  priceCents: 0
},{
  id: '2',
  deliveryDays: 3,
  priceCents: 499
},{
  id: '3',
  deliveryDays: 1,
  priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if (deliveryOptionId === option.id) {
      deliveryOption = option;
    }
  });
  return deliveryOption;
}

export function calculateDeliveryDate(deliveryOption) {
  const today = dayjs();
  let dayOfWeek = today.day();
  let deliveryDays = 0;
  let i = 0;
  
  while(i<deliveryOption.deliveryDays) {
    deliveryDays++;
    dayOfWeek = today.add(deliveryDays,'days').day();
    if(dayOfWeek!==6 && dayOfWeek!==0) {
      i++;
    }
  }

  const deliveryDate = today.add(deliveryDays, 'days');
  const dateString = deliveryDate.format('dddd, MMMM D');
  return dateString;
}