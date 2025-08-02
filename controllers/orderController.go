package controllers

import (
	"net/http"

	"shopping-cart/database"
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
)

// POST /orders – Place an order from user's cart
func PlaceOrder(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var cartItems []models.Cart
	database.DB.Where("user_id = ?", userID).Find(&cartItems)

	if len(cartItems) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "🛒 Cart is empty"})
		return
	}

	for _, cartItem := range cartItems {
		order := models.Order{
			UserID: userID,
			ItemID: cartItem.ItemID,
		}
		database.DB.Create(&order)
	}

	// Clear cart
	database.DB.Where("user_id = ?", userID).Delete(&models.Cart{})

	c.JSON(http.StatusOK, gin.H{"message": "✅ Order placed successfully"})
}

// GET /orders – View user’s order history
func ViewOrders(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var orders []models.Order
	database.DB.Where("user_id = ?", userID).Find(&orders)

	var items []models.Item
	for _, order := range orders {
		var item models.Item
		database.DB.First(&item, order.ItemID)
		items = append(items, item)
	}

	c.JSON(http.StatusOK, items)
}
