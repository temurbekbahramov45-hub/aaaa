'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { Minus, Plus, Phone, CheckCircle, ShoppingCart } from 'lucide-react'

interface Product {
  id: string
  nameUz: string
  nameRu: string
  price: number
  image?: string
  discount?: number
  category: string
  available: boolean
}

interface CartItem {
  product: Product
  quantity: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [deliveryAddress, setDeliveryAddress] = useState('Xorazm viloyati Xonqa Tumani Halq Banki yonida')
  const [paymentMethod, setPaymentMethod] = useState('Naqd pul')
  const [phoneNumber, setPhoneNumber] = useState('+998331191415')
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const [language, setLanguage] = useState<'uz' | 'ru'>('uz')
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === productId)
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }
      return prev.filter(item => item.product.id !== productId)
    })
  }

  const getQuantityInCart = (productId: string) => {
    const item = cart.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.product.discount
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price
      return total + (price * item.quantity)
    }, 0)
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ')
  }

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: language === 'uz' ? 'Xatolik' : 'Ошибка',
        description: language === 'uz' 
          ? 'Iltimos, kamida bitta mahsulot tanlang' 
          : 'Пожалуйста, выберите хотя бы один товар',
        variant: 'destructive'
      })
      return
    }

    const orderData = {
      deliveryAddress,
      paymentMethod,
      phoneNumber,
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        discount: item.product.discount
      })),
      totalPrice: getTotalPrice()
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        setIsOrderPlaced(true)
        setCart([])
        toast({
          title: language === 'uz' ? 'Buyurtma qabul qilindi' : 'Заказ принят',
          description: language === 'uz' 
            ? 'Sizning buyurtmangiz qabul qilindi. 30–35 daqiqa ichida yetkazib beriladi.'
            : 'Ваш заказ принят. Будет доставлен в течение 30-35 минут.'
        })
      } else {
        throw new Error('Failed to place order')
      }
    } catch (error) {
      toast({
        title: language === 'uz' ? 'Xatolik' : 'Ошибка',
        description: language === 'uz' 
          ? 'Buyurtma berishda xatolik yuz berdi' 
          : 'Произошла ошибка при оформлении заказа',
        variant: 'destructive'
      })
    }
  }

  const makePhoneCall = () => {
    window.open(`tel:${phoneNumber}`, '_self')
  }

  const getProductName = (product: Product) => {
    return language === 'uz' ? product.nameUz : product.nameRu
  }

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: Record<string, string> = {
      'Xot-Doglar': '🌭',
      'Хот-Доги': '🌭',
      'Burgerlar': '🍔',
      'Бургеры': '🍔',
      'Ichimliklar': '🥤',
      'Напитки': '🥤',
      'Qo\'shimchalar': '🍟',
      'Дополнения': '🍟',
      'Setlar': '🍱',
      'Сеты': '🍱'
    }
    return iconMap[categoryName] || '📦'
  }

  const organizeProductsByCategory = (products: Product[]) => {
    const organized: Record<string, Product[]> = {}
    
    // Group products by their actual category text
    products.forEach(product => {
      const category = product.category
      if (!organized[category]) {
        organized[category] = []
      }
      organized[category].push(product)
    })

    return organized
  }

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            {language === 'uz' ? 'Buyurtma qabul qilindi!' : 'Заказ принят!'}
          </h1>
          <p className="text-gray-600 mb-6">
            {language === 'uz' 
              ? 'Sizning buyurtmangiz qabul qilindi. 30–35 daqiqa ichida yetkazib beriladi.'
              : 'Ваш заказ принят. Будет доставлен в течение 30-35 минут.'
            }
          </p>
          <Button 
            onClick={() => setIsOrderPlaced(false)}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {language === 'uz' ? 'Yangi buyurtma' : 'Новый заказ'}
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-orange-600">DendyFood</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/admin'}
              >
                {language === 'uz' ? 'Admin' : 'Админ'}
              </Button>
              <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    🛒 {language === 'uz' ? 'Savat' : 'Корзина'}
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-orange-500">
                        {cart.reduce((total, item) => total + item.quantity, 0)}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {language === 'uz' ? 'Savat' : 'Корзина'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">
                        {language === 'uz' ? 'Savat bo\'sh' : 'Корзина пуста'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Cart Items */}
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {cart.map((item) => {
                          const discountedPrice = item.product.discount
                            ? item.product.price * (1 - item.product.discount / 100)
                            : item.product.price
                          
                          return (
                            <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">
                                  {getProductName(item.product)}
                                </h4>
                                <div className="flex items-center gap-2">
                                  {item.product.discount ? (
                                    <>
                                      <span className="text-xs text-gray-500 line-through">
                                        {formatPrice(item.product.price)} so'm
                                      </span>
                                      <span className="text-sm font-bold text-orange-600">
                                        {formatPrice(discountedPrice)} so'm
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-sm font-bold text-orange-600">
                                      {formatPrice(item.product.price)} so'm
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="w-6 h-6 p-0"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-6 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addToCart(item.product)}
                                  className="w-6 h-6 p-0"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Order Form */}
                      <div className="space-y-4 pt-4 border-t">
                        <div>
                          <Label htmlFor="phone" className="text-sm font-medium">
                            {language === 'uz' ? 'Telefon raqami*' : 'Номер телефона*'}
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+998XX XXX XX XX"
                            className="mt-1"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="address" className="text-sm font-medium">
                            {language === 'uz' ? 'Yetkazib berish manzili' : 'Адрес доставки'}
                          </Label>
                          <Input
                            id="address"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">
                            {language === 'uz' ? 'To\'lov usuli' : 'Способ оплаты'}
                          </Label>
                          <RadioGroup
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                            className="mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Naqd pul" id="cash" />
                              <Label htmlFor="cash" className="text-sm">
                                {language === 'uz' ? 'Naqd pul' : 'Наличные'}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Karta orqali" id="card" />
                              <Label htmlFor="card" className="text-sm">
                                {language === 'uz' ? 'Karta orqali' : 'Картой'}
                              </Label>
                            </div>
                          </RadioGroup>
                          
                          {paymentMethod === 'Karta orqali' && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-600">
                                {language === 'uz' 
                                  ? 'Karta raqamiga pul tashlang: 9860 3501 4506 8143. Otabek Narimanov'
                                  : 'Переведите деньги на карту: 9860 3501 4506 8143. Отабек Нариманов'
                                }
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>{language === 'uz' ? 'Jami summa:' : 'Итого:'}</span>
                            <span className="text-orange-600">
                              {formatPrice(getTotalPrice())} so'm
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={placeOrder}
                            className="flex-1 bg-orange-500 hover:bg-orange-600"
                            disabled={!phoneNumber.trim()}
                          >
                            {language === 'uz' ? 'Buyurtma berish' : 'Оформить заказ'}
                          </Button>
                          <Button
                            onClick={makePhoneCall}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Phone className="w-4 h-4" />
                            <span className="text-sm">
                              {language === 'uz' ? 'Telefon' : 'Телефон'}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <Button
                onClick={() => cart.length > 0 && setIsCartOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                size="sm"
                disabled={cart.length === 0}
              >
                {language === 'uz' ? 'Buyurtma berish' : 'Оформить заказ'}
              </Button>
              <Button
                variant={language === 'uz' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('uz')}
              >
                UZ
              </Button>
              <Button
                variant={language === 'ru' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('ru')}
              >
                RU
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Products by Category */}
        {(() => {
          const organizedProducts = organizeProductsByCategory(products)
          
          return Object.entries(organizedProducts).map(([categoryName, categoryProducts]) => {
            if (categoryProducts.length === 0) return null
            
            const categoryIcon = getCategoryIcon(categoryName)
            
            return (
              <div key={categoryName} className="mb-8">
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{categoryIcon}</span>
                  <h2 className="text-xl font-bold text-gray-800">
                    {categoryName}
                  </h2>
                </div>
                
                {/* Products Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {categoryProducts.map((product) => {
                    const quantityInCart = getQuantityInCart(product.id)
                    const discountedPrice = product.discount
                      ? product.price * (1 - product.discount / 100)
                      : product.price

                    return (
                      <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-square relative">
                          <img
                            src={product.image || '/placeholder-food.jpg'}
                            alt={getProductName(product)}
                            className="w-full h-full object-cover"
                          />
                          {product.discount && (
                            <Badge className="absolute top-2 right-2 bg-red-500 text-xs">
                              -{product.discount}%
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                            {getProductName(product)}
                          </h3>
                          <div className="flex items-center gap-1 mb-3">
                            {product.discount ? (
                              <>
                                <span className="text-xs text-gray-500 line-through">
                                  {formatPrice(product.price)}
                                </span>
                                <span className="text-sm font-bold text-orange-600">
                                  {formatPrice(discountedPrice)}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-bold text-orange-600">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromCart(product.id)}
                                disabled={quantityInCart === 0}
                                className="w-7 h-7 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-7 text-center text-sm font-medium">
                                {quantityInCart}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addToCart(product)}
                                className="w-7 h-7 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })
        })()}
      </div>
    </div>
  )
}