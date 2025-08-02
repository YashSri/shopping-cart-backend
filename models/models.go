package models

import "gorm.io/gorm"

// Cart stores selected items for a user
type Cart struct {
	gorm.Model
	UserID uint
	ItemID uint
}

// Order is created from the user's cart
type Order struct {
	gorm.Model
	UserID uint
	ItemID uint
}
