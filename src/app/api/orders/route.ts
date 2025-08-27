import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface OrderItem {
  productId: string
  quantity: number
  price: number
  discount?: number
}

interface OrderData {
  deliveryAddress: string
  paymentMethod: string
  phoneNumber: string
  items: OrderItem[]
  totalPrice: number
}

async function sendTelegramNotification(orderData: OrderData, orderItems: any[]) {
  const botToken = '8410799225:AAEkdfVuxr56XGUiqoTesMBW6lrcGIA2rOY'
  const chatId = '-1002821617001'
  
  const now = new Date()
  const formattedDate = now.toISOString().slice(0, 16).replace('T', ' ')
  
  // Use the actual phone number from order data or show "Ko'rsatilmagan" if empty
  const displayPhone = orderData.phoneNumber && orderData.phoneNumber.trim() 
    ? orderData.phoneNumber.trim() 
    : "Ko'rsatilmagan"
  
  let itemsText = ''
  orderItems.forEach(item => {
    const productName = item.product.nameUz
    const price = item.discount 
      ? item.price * (1 - item.discount / 100)
      : item.price
    const totalPrice = price * item.quantity
    itemsText += `• ${productName} - ${item.quantity} x ${price.toLocaleString('uz-UZ')} so'm = ${totalPrice.toLocaleString('uz-UZ')} so'm\n`
  })
  
  const message = `🍔 YANGI BUYURTMA! 📞 Telefon: ${displayPhone} 💰 To'lov usuli: ${orderData.paymentMethod} 📊 Jami summa: ${orderData.totalPrice.toLocaleString('uz-UZ')} so'm 🛒 Buyurtma mahsulotlari:\n${itemsText}📍 Manzil: ${orderData.deliveryAddress} ⏰ Vaqt: ${formattedDate}`
  
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error('Failed to send Telegram notification:', await response.text())
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json()
    
    const order = await db.order.create({
      data: {
        deliveryAddress: orderData.deliveryAddress,
        paymentMethod: orderData.paymentMethod,
        totalPrice: orderData.totalPrice,
        status: 'pending'
      }
    })
    
    const orderItems = await Promise.all(
      orderData.items.map(async (item: OrderItem) => {
        return db.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount
          },
          include: {
            product: true
          }
        })
      })
    )
    
    await sendTelegramNotification(orderData, orderItems)
    
    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}