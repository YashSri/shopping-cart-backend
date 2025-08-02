package models

type cart struct {
	ID     uint `gorm:"primaryKey"`
	UserID uint
	ItemID uint
}
