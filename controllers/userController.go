package controllers

import (
	"net/http"
	"time"

	"shopping-cart/database"
	"shopping-cart/models"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var jwtKey = []byte("your_secret_key") // You can change this to a secure env var

type Claims struct {
	UserID uint
	jwt.StandardClaims
}

// POST /users – Register
func CreateUser(c *gin.Context) {
	var input models.User

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if email already exists
	var existing models.User
	if err := database.DB.Where("email = ?", input.Email).First(&existing).Error; err != gorm.ErrRecordNotFound {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	database.DB.Create(&input)
	c.JSON(http.StatusCreated, gin.H{"message": "✅ User registered successfully"})
}

// POST /users/login – Login
func LoginUser(c *gin.Context) {
	var input models.User

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify email/password
	var user models.User
	if err := database.DB.Where("email = ? AND password = ?", input.Email, input.Password).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "❌ Invalid credentials"})
		return
	}

	// Create JWT token
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: user.ID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, _ := token.SignedString(jwtKey)

	c.JSON(http.StatusOK, gin.H{"token": tokenStr})
}
