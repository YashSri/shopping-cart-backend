package models

type Item struct {
	ID    uint   `gorm:"primaryKey"`
	Name  string `json:"name"`
	Price int    `json:"price"`
}
