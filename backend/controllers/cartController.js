const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const recordUserInteraction = async (userId, artworkId, type, db = prisma) => {
  try {
    await db.userInteraction.upsert({
      where: {
        user_id_artwork_id_type: {
          user_id: userId,
          artwork_id: artworkId,
          type,
        },
      },
      update: {
        created_at: new Date(),
      },
      create: {
        user_id: userId,
        artwork_id: artworkId,
        type,
      },
    });
  } catch (err) {
    console.error(`Error recording ${type} interaction:`, err);
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { artworkId, quantity } = req.body;

    if (!artworkId || quantity === undefined || quantity === null) {
      return res.status(400).json({
        message: "artworkId and quantity are required",
      });
    }

    const artId = Number(artworkId);
    const qty = Number(quantity);

    if (Number.isNaN(artId) || Number.isNaN(qty) || qty < 1) {
      return res.status(400).json({
        message: "artworkId must be a number and quantity must be at least 1",
      });
    }

    const artwork = await prisma.artwork.findUnique({
      where: { id: artId },
    });

    if (!artwork) {
      return res.status(404).json({
        message: "Artwork not found",
      });
    }

    if (artwork.inventory <= 0) {
      return res.status(400).json({
        message: "This artwork is out of stock",
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        user_id: userId,
        artwork_id: artId,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + qty;

      if (newQuantity > artwork.inventory) {
        return res.status(400).json({
          message: `Only ${artwork.inventory} item(s) available in stock`,
        });
      }

      const updatedItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });

      return res.status(200).json({
        message: "Cart updated successfully",
        item: updatedItem,
      });
    }

    if (qty > artwork.inventory) {
      return res.status(400).json({
        message: `Only ${artwork.inventory} item(s) available in stock`,
      });
    }

    // Record user interaction for recommendations
    await recordUserInteraction(userId, artId, "cart");

    const newItem = await prisma.cartItem.create({
      data: {
        user_id: userId,
        artwork_id: artId,
        quantity: qty,
      },
    });

    return res.status(201).json({
      message: "Item added to cart",
      item: newItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add item to cart",
      error: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { artworkId } = req.body;

    if (!artworkId) {
      return res.status(400).json({
        message: "artworkId is required",
      });
    }

    const artId = Number(artworkId);

    if (Number.isNaN(artId)) {
      return res.status(400).json({
        message: "artworkId must be a valid number",
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        user_id: userId,
        artwork_id: artId,
      },
    });

    if (!existingItem) {
      return res.status(404).json({
        message: "Item not found in cart",
      });
    }

    await prisma.cartItem.delete({
      where: {
        id: existingItem.id,
      },
    });

    return res.status(200).json({
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove item from cart",
      error: error.message,
    });
  }
};

const getCartItems = async (req, res) => {
  try {
    const userId = req.user.sub;

    const cartItems = await prisma.cartItem.findMany({
      where: {
        user_id: userId,
      },
      include: {
        artwork: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const items = cartItems.map((item) => {
      const price = Number(item.artwork?.price || 0);
      const quantity = item.quantity;
      const lineTotal = price * quantity;

      return {
        cartItemId: item.id,
        artworkId: item.artwork?.id,
        title: item.artwork?.title || "Untitled Artwork",
        image_url: item.artwork?.image_url || "",
        artist_name: item.artwork?.artist_name || "Unknown Artist",
        price,
        quantity,
        lineTotal,
        inventory: item.artwork?.inventory ?? 0,
      };
    });

    return res.status(200).json({
      message: "Cart fetched successfully",
      items,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};
const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { artworkId, quantity } = req.body;

    if (!artworkId || quantity === undefined || quantity === null) {
      return res.status(400).json({
        message: "artworkId and quantity are required",
      });
    }

    const artId = Number(artworkId);
    const qty = Number(quantity);

    if (Number.isNaN(artId) || Number.isNaN(qty)) {
      return res.status(400).json({
        message: "artworkId and quantity must be valid numbers",
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        user_id: userId,
        artwork_id: artId,
      },
    });

    if (!existingItem) {
      return res.status(404).json({
        message: "Item not found in cart",
      });
    }

    if (qty <= 0) {
      await prisma.cartItem.delete({
        where: {
          id: existingItem.id,
        },
      });

      return res.status(200).json({
        message: "Item removed from cart because quantity reached 0",
      });
    }

    const artwork = await prisma.artwork.findUnique({
      where: { id: artId },
    });

    if (!artwork) {
      return res.status(404).json({
        message: "Artwork not found",
      });
    }

    if (qty > artwork.inventory) {
      return res.status(400).json({
        message: `Only ${artwork.inventory} item(s) available in stock`,
      });
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: qty,
      },
    });

    return res.status(200).json({
      message: "Cart quantity updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update cart quantity",
      error: error.message,
    });
  }
};


const getCheckoutSummary = async (req, res) => {
  try {
    const userId = req.user.sub;

    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: userId },
      include: {
        artwork: true,
      },
    });

    if (!cartItems.length) {
      return res.status(200).json({
        items: [],
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        message: "Cart is empty",
      });
    }

    const items = cartItems.map((item) => {
      const price = Number(item.artwork.price);
      const quantity = item.quantity;
      const lineTotal = price * quantity;

      return {
        cartItemId: item.id,
        artworkId: item.artwork.id,
        title: item.artwork.title,
        image_url: item.artwork.image_url,
        artist_name: item.artwork.artist_name,
        price,
        quantity,
        lineTotal,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

    const shipping = 0; // change later if needed
    const tax = 0; // change later if needed
    const total = subtotal + shipping + tax;

    return res.status(200).json({
      items,
      subtotal,
      shipping,
      tax,
      total,
    });
  } catch (error) {
    console.error("Checkout summary error:", error);
    return res.status(500).json({
      message: "Failed to generate checkout summary",
      error: error.message,
    });
  }
};


module.exports = {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCartItems,
  getCheckoutSummary,
  
};

