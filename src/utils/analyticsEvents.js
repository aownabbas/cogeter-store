import { formatDecimal } from './helperFile';


const userJSON = localStorage.getItem("user");

// Check if userJSON is not null before parsing
const user = userJSON ? JSON.parse(userJSON) : null;

// Access properties if user is not null
const phone = user?.phone;
const email = user?.email;

export const trackAddToCart = (product, variant, rateMultiplier, currency) => {
  window?.dataLayer?.push({
    event: 'add_to_cart',
    currency: 'AED',
    value: product?.sale_price ? formatDecimal(product?.sale_price) : '',
    items: [
      {
        item_id: variant?.sku,
        item_variant: product?.color + '-' + variant?.size,
        item_name: product?.title,
        item_list_id: product?.category ? product?.category?.identifier : product.identifier,
        item_category: product?.category ? product?.category?.title : product.title,
        price: product?.regular_price ? formatDecimal(product?.regular_price) : '',
        quantity: 1,
      },
    ],
  });
};

export const trackViewItem = (item, currency, rateMultiplier) => {
  window?.dataLayer?.push({
    event: 'view_item',
    currency: 'AED',
    value: item?.sale_price ? formatDecimal(item?.sale_price) : '',
    items: [
      {
        item_id: item?.id,
        item_name: item?.title,
        discount: item.on_sale == true ? item.regular_price - item.sale_price : '',
        item_brand: 'Cogeter',
        item_category: item?.category?.identifier,
        item_variant: item?.depoter_color,
        price: item?.regular_price ? formatDecimal(item?.regular_price) : '',
        quantity: 1,
      },
    ],
  });
};

export const trackPurchase = (currency, item, rateMultiplier, orderId) => {
  window?.dataLayer?.push({
    event: 'purchase',
    transaction_id: orderId, // e.g., "T_12345"
    currency: 'AED',
    value: item?.sale_price ? formatDecimal(item?.sale_price) : '',
    items: [
      {
        item_id: item?.id,
        item_name: item?.title,
        discount: item.on_sale == true ? item.regular_price - item.sale_price : '',
        item_brand: 'Cogeter',
        item_category: item?.category?.identifier,
        item_variant: item?.depoter_color,
        price: item?.regular_price ? formatDecimal(item?.regular_price) : '',
        quantity: 1,
      },
    ],
  });
};

export const trackBeginCheckout = (currency, item, rateMultiplier) => {
  window?.dataLayer?.push({
    event: 'begin_checkout',
    currency: 'AED',
    value: item?.sale_price ? formatDecimal(item?.sale_price) : '',
    items: [
      {
        item_id: item?.id,
        item_name: item?.title,
        discount: item.on_sale == true ? item.regular_price - item.sale_price : '',
        item_brand: 'Cogeter',
        item_category: item?.category?.identifier,
        item_variant: item?.depoter_color,
        price: item?.regular_price ? formatDecimal(item?.regular_price) : '',
        quantity: 1,
      },
    ],
  });
};

export const trackAddPaymentInfo = (currency, item, promoCode, payment_type, rateMultiplier) => {
  window?.dataLayer?.push({
    event: 'add_payment_info',
    currency: 'AED',
    value: item?.sale_price ? formatDecimal(item?.sale_price) : '',
    coupon: promoCode, // e.g., "SUMMER_FUN"
    payment_type: payment_type, // e.g., "Credit Card"
    items: [
      {
        item_id: item?.id,
        item_name: item?.title,
        discount: item.on_sale == true ? item.regular_price - item.sale_price : '',
        item_brand: 'Cogeter',
        item_category: item?.category?.identifier,
        item_variant: item?.depoter_color,
        price: item?.regular_price ? formatDecimal(item?.regular_price) : '',
        quantity: 1,
      },
    ],
  });
};

export const trackAddShippingInfo = (currency, item, rateMultiplier) => {
  window?.dataLayer?.push({
    event: 'add_shipping_info',
    currency: 'AED',
    value: item?.sale_price ? formatDecimal(item?.sale_price) : '',
    items: [
      {
        item_id: item?.id,
        item_name: item?.title,
        discount: item.on_sale == true ? item.regular_price - item.sale_price : '',
        item_brand: 'Cogeter',
        item_category: item?.category?.identifier,
        item_variant: item?.depoter_color,
        price: item?.regular_price ? formatDecimal(item?.regular_price) : '',
        quantity: 1,
      },
    ],
  });
};

export const ttqtrackAddToCart = (item, variant) => {
  window?.ttq?.identify({
    email: email,
    phone_number: phone,
  });

  window?.ttq?.track('AddToCart', {
    currency: 'AED',
    contents: [
      {
        content_id: variant?.sku,
        value: item?.regular_price ? formatDecimal(item?.regular_price) : '',
      },
    ],
  });
};

export const ttqTrackViewContent = (item) => {
  window?.ttq?.identify({
    email: email,
    phone_number: phone,
  });

  window?.ttq?.track('ViewContent', {
    currency: 'AED',
    contents: [
      {
        content_id: item?.id,
        price: item?.regular_price ? formatDecimal(item?.regular_price) : '',
      },
    ],
  });
};

export const ttqTrackAddPaymentInfo = (item) => {
  window?.ttq?.identify({
    email: email,
    phone_number: phone,
  });

  window?.ttq?.track('AddPaymentInfo', {
    currency: 'AED',
    contents: [
      {
        content_id: item?.id,
        price: item?.regular_price ? formatDecimal(item?.regular_price) : '',
      },
    ],
  });
};

export const ttqTrackInitiateCheckout = (item) => {
  window?.ttq?.identify({
    email: email,
    phone_number: phone,
  });

  window?.ttq?.track('InitiateCheckout', {
    currency: 'AED',
    contents: [
      {
        content_id: item?.id,
        price: item?.regular_price ? formatDecimal(item?.regular_price) : '',
      },
    ],
  });
};

export const ttqTrackCompletePayment = (item) => {
  window?.ttq?.identify({
    email: email,
    phone_number: phone,
  });

  window?.ttq?.track('CompletePayment', {
    currency: 'AED',
    contents: [
      {
        content_id: item?.id,
        price: item?.regular_price ? formatDecimal(item?.regular_price) : '',
      },
    ],
  });
};
