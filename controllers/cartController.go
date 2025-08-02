package controllers

import (
	"net/http"

	"shopping-cart/database"
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
)

// POST /carts – Add item to cart
func AddToCart(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var input struct {
		ItemID uint `json:"item_id"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cart := models.Cart{
		UserID: userID,
		ItemID: input.ItemID,
	}

	database.DB.Create(&cart)
	c.JSON(http.StatusCreated, gin.H{"message": "🛒 Item added to cart"})
}

// GET /carts – View current user's cart
func ViewCart(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var cartItems []models.Cart
	database.DB.Preload("Item").Where("user_id = ?", userID).Find(&cartItems)

	var items []models.Item
	for _, cart := range cartItems {
		var item models.Item
		database.DB.First(&item, cart.ItemID)
		items = append(items, item)
	}

	c.JSON(http.StatusOK, items)
}
