const prisma = require("../lib/prisma");

const isAdminSub = (sub) => {
  const adminSubs = (process.env.ADMIN_SUBS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return !!sub && adminSubs.includes(sub);
};

const mapPayout = (row) => ({
  id: row.id,
  artistSub: row.artist_sub,
  status: row.status,
  grossAmount: Number(row.gross_amount),
  platformFee: Number(row.platform_fee),
  artistAmount: Number(row.artist_amount),
  paymentReference: row.payment_reference,
  createdAt: row.created_at,
  paidAt: row.paid_at,
  orderItem: row.orderItem
    ? {
        id: row.orderItem.id,
        quantity: row.orderItem.quantity,
        lineTotal: Number(row.orderItem.line_total),
        artwork: row.orderItem.artwork
          ? {
              id: row.orderItem.artwork.id,
              title: row.orderItem.artwork.title,
              imageUrl: row.orderItem.artwork.image_url,
            }
          : null,
        order: row.orderItem.order
          ? {
              id: row.orderItem.order.id,
              customerName: row.orderItem.order.customer_name,
              paymentMethod: row.orderItem.order.payment_method,
              paymentStatus: row.orderItem.order.payment_status,
              shippingAddressLine1: row.orderItem.order.shipping_address_line1,
              shippingAddressLine2: row.orderItem.order.shipping_address_line2,
              shippingCity: row.orderItem.order.shipping_city,
              shippingPostalCode: row.orderItem.order.shipping_postal_code,
              shippingCountry: row.orderItem.order.shipping_country,
              createdAt: row.orderItem.order.created_at,
            }
          : null,
      }
    : null,
});

exports.getMyPayouts = async (req, res) => {
  try {
    const userSub = req.user?.sub;
    if (!userSub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payouts = await prisma.artistPayout.findMany({
      where: { artist_sub: userSub },
      include: {
        orderItem: {
          include: {
            artwork: true,
            order: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    const summary = payouts.reduce(
      (acc, payout) => {
        const amount = Number(payout.artist_amount);
        if (payout.status === "PAID") {
          acc.paid += amount;
        } else {
          acc.pending += amount;
        }
        return acc;
      },
      { pending: 0, paid: 0 }
    );

    return res.status(200).json({
      message: "Payouts fetched successfully",
      summary: {
        pending: Number(summary.pending.toFixed(2)),
        paid: Number(summary.paid.toFixed(2)),
      },
      payouts: payouts.map(mapPayout),
    });
  } catch (error) {
    console.error("getMyPayouts error:", error);
    return res.status(500).json({ message: "Failed to fetch payouts", error: error.message });
  }
};

exports.getAdminPayouts = async (req, res) => {
  try {
    const userSub = req.user?.sub;
    if (!isAdminSub(userSub)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const status = req.query.status ? String(req.query.status).toUpperCase() : undefined;
    const where = status ? { status } : {};

    const payouts = await prisma.artistPayout.findMany({
      where,
      include: {
        orderItem: {
          include: {
            artwork: true,
            order: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { created_at: "desc" }],
    });

    return res.status(200).json({
      message: "Admin payouts fetched successfully",
      payouts: payouts.map(mapPayout),
    });
  } catch (error) {
    console.error("getAdminPayouts error:", error);
    return res.status(500).json({ message: "Failed to fetch admin payouts", error: error.message });
  }
};

exports.markPayoutPaid = async (req, res) => {
  try {
    const userSub = req.user?.sub;
    if (!isAdminSub(userSub)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const payoutId = Number(req.params.id);
    if (!payoutId) {
      return res.status(400).json({ message: "Invalid payout id" });
    }

    const paymentReference = String(req.body?.paymentReference || "").trim() || null;

    const existing = await prisma.artistPayout.findUnique({ where: { id: payoutId } });
    if (!existing) {
      return res.status(404).json({ message: "Payout not found" });
    }

    const updated = await prisma.artistPayout.update({
      where: { id: payoutId },
      data: {
        status: "PAID",
        paid_at: new Date(),
        payment_reference: paymentReference,
      },
      include: {
        orderItem: {
          include: {
            artwork: true,
            order: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Payout marked as paid",
      payout: mapPayout(updated),
    });
  } catch (error) {
    console.error("markPayoutPaid error:", error);
    return res.status(500).json({ message: "Failed to mark payout paid", error: error.message });
  }
};
