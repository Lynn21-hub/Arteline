const prisma = require("../lib/prisma");
const stripe = require("../lib/stripe");
const {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  findOrderByStripeSessionId,
  finalizeOrderFromCart,
  getValidatedCartSnapshot,
  normalizeShippingDetails,
} = require("../services/orderService");

const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user.sub;
    const shippingDetails = normalizeShippingDetails(req.body.shippingDetails);
    const order = await finalizeOrderFromCart({
      userId,
      shippingDetails,
      paymentMethod: PAYMENT_METHOD.COD,
      status: ORDER_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING,
    });

    return res.status(201).json({
      message: "COD order placed successfully",
      order,
    });
  } catch (error) {
    console.error("placeOrderCOD error:", error);
    return res.status(error.statusCode || 500).json({
      message: "Failed to place COD order",
      error: error.message,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.sub;

    const orders = await prisma.order.findMany({
      where: { user_id: userId },
      include: {
        orderItems: {
          include: {
            artwork: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("getUserOrders error:", error);
    return res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};
const createStripeCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.sub;
    const shippingDetails = normalizeShippingDetails(req.body.shippingDetails);
    const { items } = await getValidatedCartSnapshot(userId);

    if (!process.env.FRONTEND_URL) {
      return res.status(500).json({
        message: "FRONTEND_URL is not configured",
      });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        user_id: userId,
        customer_name: shippingDetails.customerName,
        phone_number: shippingDetails.phoneNumber,
        address_line1: shippingDetails.addressLine1,
        address_line2: shippingDetails.addressLine2 || "",
        city: shippingDetails.city,
        postal_code: shippingDetails.postalCode,
        country: shippingDetails.country,
      },
    });

    return res.status(200).json({
      message: "Stripe checkout session created",
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("createStripeCheckoutSession error:", error);
    return res.status(error.statusCode || 500).json({
      message: "Failed to create Stripe checkout session",
      error: error.message,
    });
  }
};
const stripeWebhook = async (req, res) => {
  let event;

  try {
    const signature = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.user_id;

      if (!userId) {
        throw new Error("Missing user_id in Stripe session metadata");
      }

      const existingOrder = await findOrderByStripeSessionId(session.id);
      if (existingOrder) {
        return res.status(200).json({ received: true });
      }

      await finalizeOrderFromCart({
        userId,
        shippingDetails: {
          customerName: session.metadata?.customer_name,
          phoneNumber: session.metadata?.phone_number,
          addressLine1: session.metadata?.address_line1,
          addressLine2: session.metadata?.address_line2,
          city: session.metadata?.city,
          postalCode: session.metadata?.postal_code,
          country: session.metadata?.country,
        },
        paymentMethod: PAYMENT_METHOD.STRIPE,
        status: ORDER_STATUS.PAID,
        paymentStatus: PAYMENT_STATUS.PAID,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: session.payment_intent
          ? String(session.payment_intent)
          : null,
      });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("stripeWebhook error:", error);
    return res.status(error.statusCode || 500).json({
      message: "Webhook handling failed",
      error: error.message,
    });
  }
};

module.exports = {
  placeOrderCOD,
  getUserOrders,
  createStripeCheckoutSession,
  stripeWebhook,
};
