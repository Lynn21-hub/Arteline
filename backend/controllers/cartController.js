const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const addToCart = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { artworkId, quantity } = req.body;

    if (!artworkId) {
      return res.status(400).json({
        message: "artworkId is required",
      });
    }

    const qty = quantity ? Number(quantity) : 1;
    const artId = Number(artworkId);

    if (Number.isNaN(artId) || Number.isNaN(qty) || qty < 1) {
      return res.status(400).json({
        message: "artworkId must be a number and quantity must be at least 1",
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        user_id: userId,
        artwork_id: artId,
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + qty,
        },
      });

      return res.status(200).json({
        message: "Cart updated successfully",
        item: updatedItem,
      });
    }

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

    const items = await prisma.cartItem.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
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

module.exports = {
  addToCart,
  removeFromCart,
  getCartItems,
};
 /*
Create a Node.js Express cart backend using Prisma and MySQL.

Requirements:
- Use Prisma ORM only, no raw SQL
- Expect authenticated user from AWS Cognito JWT
- JWT comes from Authorization header as Bearer token
- Verify token and extract "sub"
- Use "sub" as user_id
- Never trust user_id from request body

Cart item fields:
- id
- user_id
- artwork_id
- quantity default 1
- created_at

Routes to support:
- POST /cart/add
- POST /cart/remove
- GET /cart

Logic:
- Add to cart:
  - if item already exists for user and artwork_id, increase quantity
  - otherwise create new item
- Remove from cart:
  - delete item matching authenticated user and artwork_id
- Get cart:
  - return all items for authenticated user

Use async/await, proper error handling, and CommonJS exports.
*/  
