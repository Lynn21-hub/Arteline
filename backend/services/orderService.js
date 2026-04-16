const prisma = require("../lib/prisma");

const ORDER_STATUS = {
  PENDING: "PENDING",
  PLACED: "PLACED",
  PAID: "PAID",
};

const PAYMENT_METHOD = {
  COD: "COD",
  STRIPE: "STRIPE",
};

const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
};

const SHIPPING_AMOUNT = 0;
const TAX_AMOUNT = 0;

const REQUIRED_SHIPPING_FIELDS = [
  "customerName",
  "phoneNumber",
  "addressLine1",
  "city",
  "postalCode",
  "country",
];

const normalizeShippingDetails = (shippingDetails = {}) => {
  const normalized = {
    customerName: String(shippingDetails.customerName || "").trim(),
    phoneNumber: String(shippingDetails.phoneNumber || "").trim(),
    addressLine1: String(shippingDetails.addressLine1 || "").trim(),
    addressLine2: String(shippingDetails.addressLine2 || "").trim(),
    city: String(shippingDetails.city || "").trim(),
    postalCode: String(shippingDetails.postalCode || "").trim(),
    country: String(shippingDetails.country || "").trim(),
  };

  for (const field of REQUIRED_SHIPPING_FIELDS) {
    if (!normalized[field]) {
      const error = new Error("Shipping details are required");
      error.statusCode = 400;
      error.field = field;
      throw error;
    }
  }

  return normalized;
};

const formatCartItem = (item) => {
  const price = Number(item.artwork.price);
  const quantity = item.quantity;
  const lineTotal = price * quantity;

  return {
    cartItemId: item.id,
    artworkId: item.artwork.id,
    title: item.artwork.title,
    imageUrl: item.artwork.image_url,
    artistName: item.artwork.artist_name,
    price,
    quantity,
    lineTotal,
    inventory: item.artwork.inventory ?? 0,
  };
};

const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = SHIPPING_AMOUNT;
  const tax = TAX_AMOUNT;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
};

const getCartItemsForUser = async (userId, db = prisma) => {
  return db.cartItem.findMany({
    where: { user_id: userId },
    include: { artwork: true },
    orderBy: { created_at: "desc" },
  });
};

const getValidatedCartSnapshot = async (userId, db = prisma) => {
  const cartItems = await getCartItemsForUser(userId, db);

  if (!cartItems.length) {
    const error = new Error("Cannot place order because cart is empty");
    error.statusCode = 400;
    throw error;
  }

  for (const item of cartItems) {
    if (!item.artwork) {
      const error = new Error(`Artwork not found for cart item ${item.id}`);
      error.statusCode = 404;
      throw error;
    }

    const inventory = item.artwork.inventory ?? 0;
    if (inventory < item.quantity) {
      const error = new Error(`Not enough stock for ${item.artwork.title}`);
      error.statusCode = 400;
      throw error;
    }
  }

  const items = cartItems.map(formatCartItem);
  const totals = calculateTotals(items);

  return {
    cartItems,
    items,
    ...totals,
  };
};

const finalizeOrderFromCart = async ({
  userId,
  shippingDetails,
  paymentMethod,
  status,
  paymentStatus,
  stripeCheckoutSessionId = null,
  stripePaymentIntentId = null,
}) => {
  const normalizedShippingDetails = normalizeShippingDetails(shippingDetails);

  return prisma.$transaction(async (tx) => {
    const { cartItems, subtotal, shipping, tax, total } =
      await getValidatedCartSnapshot(userId, tx);

    const order = await tx.order.create({
      data: {
        user_id: userId,
        customer_name: normalizedShippingDetails.customerName,
        phone_number: normalizedShippingDetails.phoneNumber,
        shipping_address_line1: normalizedShippingDetails.addressLine1,
        shipping_address_line2: normalizedShippingDetails.addressLine2 || null,
        shipping_city: normalizedShippingDetails.city,
        shipping_postal_code: normalizedShippingDetails.postalCode,
        shipping_country: normalizedShippingDetails.country,
        subtotal,
        shipping,
        tax,
        total,
        status,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        stripe_checkout_session_id: stripeCheckoutSessionId,
        stripe_payment_intent_id: stripePaymentIntentId,
      },
    });

    for (const item of cartItems) {
      const inventoryUpdate = await tx.artwork.updateMany({
        where: {
          id: item.artwork.id,
          inventory: {
            gte: item.quantity,
          },
        },
        data: {
          inventory: {
            decrement: item.quantity,
          },
        },
      });

      if (inventoryUpdate.count === 0) {
        const error = new Error(`Not enough stock for ${item.artwork.title}`);
        error.statusCode = 409;
        throw error;
      }

      const price = Number(item.artwork.price);
      const lineTotal = price * item.quantity;

      await tx.orderItem.create({
        data: {
          order_id: order.id,
          artwork_id: item.artwork.id,
          quantity: item.quantity,
          price_at_purchase: price,
          line_total: lineTotal,
        },
      });
    }

    await tx.cartItem.deleteMany({
      where: { user_id: userId },
    });

    return order;
  });
};

const findOrderByStripeSessionId = async (sessionId) => {
  return prisma.order.findFirst({
    where: { stripe_checkout_session_id: sessionId },
  });
};

module.exports = {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  calculateTotals,
  findOrderByStripeSessionId,
  finalizeOrderFromCart,
  getValidatedCartSnapshot,
  normalizeShippingDetails,
};
