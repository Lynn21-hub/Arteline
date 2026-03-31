const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user.sub;

    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: userId },
      include: { artwork: true },
    });

    if (!cartItems.length) {
      return res.status(400).json({
        message: "Cannot place order because cart is empty",
      });
    }

    for (const item of cartItems) {
      if (!item.artwork) {
        return res.status(404).json({
          message: `Artwork not found for cart item ${item.id}`,
        });
      }

      if (item.artwork.inventory < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${item.artwork.title}`,
        });
      }
    }

    const subtotal = cartItems.reduce((sum, item) => {
      return sum + Number(item.artwork.price) * item.quantity;
    }, 0);

    const shipping = 0;
    const tax = 0;
    const total = subtotal + shipping + tax;

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          user_id: userId,
          subtotal,
          shipping,
          tax,
          total,
          status: "PLACED",
          payment_method: "COD",
          payment_status: "PENDING",
        },
      });

      for (const item of cartItems) {
        const price = Number(item.artwork.price);
        const lineTotal = price * item.quantity;

        await tx.orderItem.create({
          data: {
            order_id: createdOrder.id,
            artwork_id: item.artwork.id,
            quantity: item.quantity,
            price_at_purchase: price,
            line_total: lineTotal,
          },
        });

        await tx.artwork.update({
          where: { id: item.artwork.id },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: { user_id: userId },
      });

      return createdOrder;
    });

    return res.status(201).json({
      message: "COD order placed successfully",
      order,
    });
  } catch (error) {
    console.error("placeOrderCOD error:", error);
    return res.status(500).json({
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

    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: userId },
      include: { artwork: true },
    });

    if (!cartItems.length) {
      return res.status(400).json({
        message: "Cannot create payment session because cart is empty",
      });
    }

    for (const item of cartItems) {
      if (!item.artwork) {
        return res.status(404).json({
          message: `Artwork not found for cart item ${item.id}`,
        });
      }

      if (item.artwork.inventory < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${item.artwork.title}`,
        });
      }
    }

    const subtotal = cartItems.reduce((sum, item) => {
      return sum + Number(item.artwork.price) * item.quantity;
    }, 0);

    const shipping = 0;
    const tax = 0;
    const total = subtotal + shipping + tax;

    const order = await prisma.order.create({
      data: {
        user_id: userId,
        subtotal,
        shipping,
        tax,
        total,
        status: "PENDING",
        payment_method: "STRIPE",
        payment_status: "PENDING",
      },
    });

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.artwork.title,
          images: item.artwork.image_url ? [item.artwork.image_url] : [],
        },
        unit_amount: Math.round(Number(item.artwork.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: String(order.id),
        userId,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripe_checkout_session_id: session.id,
      },
    });

    return res.status(200).json({
      message: "Stripe checkout session created",
      checkoutUrl: session.url,
      sessionId: session.id,
      orderId: order.id,
    });
  } catch (error) {
    console.error("createStripeCheckoutSession error:", error);
    return res.status(500).json({
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
      const orderId = Number(session.metadata?.orderId);

      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return res.status(404).send("Order not found");
      }

      if (order.payment_status === "PAID") {
        return res.status(200).json({ received: true });
      }

      const cartItems = await prisma.cartItem.findMany({
        where: { user_id: order.user_id },
        include: { artwork: true },
      });

      await prisma.$transaction(async (tx) => {
        for (const item of cartItems) {
          if (!item.artwork) {
            throw new Error(`Artwork not found for cart item ${item.id}`);
          }

          if (item.artwork.inventory < item.quantity) {
            throw new Error(`Not enough stock for ${item.artwork.title}`);
          }
        }

        for (const item of cartItems) {
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

          await tx.artwork.update({
            where: { id: item.artwork.id },
            data: {
              inventory: {
                decrement: item.quantity,
              },
            },
          });
        }

        await tx.order.update({
          where: { id: order.id },
          data: {
            payment_status: "PAID",
            status: "PLACED",
          },
        });

        await tx.cartItem.deleteMany({
          where: { user_id: order.user_id },
        });
      });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("stripeWebhook error:", error);
    return res.status(500).json({
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