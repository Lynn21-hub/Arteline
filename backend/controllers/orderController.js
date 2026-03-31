const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

module.exports = {
  placeOrderCOD,
  getUserOrders,
};