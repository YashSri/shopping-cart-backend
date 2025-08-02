package main

import (
	"log"
	"net/http"

	"shopping-cart/controllers"
	"shopping-cart/database"
	"shopping-cart/middleware"
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	database.DB.AutoMigrate(
		&models.User{},
		&models.Item{},
		&models.Cart{},
		&models.Order{},
	)

	log.Println("✅ Database connected and models migrated.")

	router := gin.Default()

	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "✅ Backend is running!"})
	})

	router.POST("/users", controllers.CreateUser)
	router.POST("/users/login", controllers.LoginUser)

	auth := router.Group("/")
	auth.Use(middleware.AuthMiddleware())

	auth.GET("/protected", func(c *gin.Context) {
		userID := c.MustGet("userID").(uint)
		c.JSON(http.StatusOK, gin.H{"message": "🔐 Protected route access granted", "user": userID})
	})

	// Items
	auth.GET("/items", controllers.GetItems)
	auth.POST("/items", controllers.CreateItem)

	// Cart
	auth.POST("/carts", controllers.AddToCart)
	auth.GET("/carts", controllers.ViewCart)

	// Orders
	auth.POST("/orders", controllers.PlaceOrder)
	auth.GET("/orders", controllers.ViewOrders)

	log.Println("🌐 Server running at http://localhost:8080")
	router.Run(":8080")
}
