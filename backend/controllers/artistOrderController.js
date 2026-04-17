const prisma = require("../lib/prisma");

const getMySales = async (req, res) => {
  try {
    const artistSub = req.user?.sub;

    if (!artistSub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orderItems = await prisma.orderItem.findMany({
      where: {
        artwork: {
          creator_sub: artistSub,
        },
      },
      include: {
        artwork: true,
        order: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const sales = orderItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      priceAtPurchase: Number(item.price_at_purchase),
      lineTotal: Number(item.line_total),
      createdAt: item.created_at,
      artwork: {
        id: item.artwork?.id,
        title: item.artwork?.title,
        imageUrl: item.artwork?.image_url,
        artistName: item.artwork?.artist_name,
      },
      order: {
        id: item.order?.id,
        createdAt: item.order?.created_at,
        status: item.order?.status,
        paymentMethod: item.order?.payment_method,
        paymentStatus: item.order?.payment_status,
        customerName: item.order?.customer_name,
        phoneNumber: item.order?.phone_number,
        shippingAddressLine1: item.order?.shipping_address_line1,
        shippingAddressLine2: item.order?.shipping_address_line2,
        shippingCity: item.order?.shipping_city,
        shippingPostalCode: item.order?.shipping_postal_code,
        shippingCountry: item.order?.shipping_country,
      },
    }));

    return res.status(200).json({
      message: "Artist sales fetched successfully",
      sales,
    });
  } catch (error) {
    console.error("getMySales error:", error);
    return res.status(500).json({
      message: "Failed to fetch artist sales",
      error: error.message,
    });
  }
};

module.exports = {
  getMySales,
};
