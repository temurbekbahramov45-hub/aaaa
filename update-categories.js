const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Category mapping for existing products
const productCategoryMapping = {
  'Hotdog 5 tasi 1 da': 'Xot-Doglar',
  'Hotdog 5 tasi 1 da (Big)': 'Xot-Doglar',
  'Gamburger 5 tasi 1 da': 'Burgerlar',
  'Chicken Burger 5 tasi 1 da': 'Burgerlar',
  'Gamburger': 'Burgerlar',
  'DablBurger': 'Burgerlar',
  'Chizburger': 'Burgerlar',
  'DablChizburger': 'Burgerlar',
  'ChickenDog 5 tasi 1 da': 'Xot-Doglar',
  'Hot-Dog': 'Xot-Doglar',
  'Hot-Dog (big)': 'Xot-Doglar',
  'Kartoshka Fri': 'Qo\'shimchalar',
  'Coca Cola 0.5': 'Ichimliklar',
  'ChickenBurger': 'Burgerlar',
  'IceCoffee': 'Ichimliklar',
  'Klab Sendwich': 'Setlar',
  'Klab Sendwich Fri bilan': 'Setlar',
  'Fri va Cola': 'Setlar',
  'Naggets 4': 'Qo\'shimchalar',
  'Naggets 8': 'Qo\'shimchalar',
  'Strips': 'Qo\'shimchalar',
  'Moxito Classic': 'Ichimliklar',
  'Combo 2': 'Setlar',
  'Chizburger set 4': 'Setlar',
  'Gigant Hot-Dog': 'Xot-Doglar',
  'Ice-Tea': 'Ichimliklar'
}

async function updateProductCategories() {
  try {
    console.log('Updating product categories...')
    
    for (const [productName, newCategory] of Object.entries(productCategoryMapping)) {
      const updated = await prisma.product.updateMany({
        where: { category: productName },
        data: { category: newCategory }
      })
      
      if (updated.count > 0) {
        console.log(`Updated ${updated.count} products from "${productName}" to "${newCategory}"`)
      }
    }
    
    console.log('Product categories updated successfully!')
  } catch (error) {
    console.error('Error updating product categories:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateProductCategories()