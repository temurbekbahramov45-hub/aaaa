import { db } from './src/lib/db'

const products = [
  {
    nameUz: 'Hotdog 5 tasi 1 da',
    nameRu: 'Хотдог 5 штук 1 шт',
    price: 25000,
    category: 'Hotdog 5 tasi 1 da'
  },
  {
    nameUz: 'Hotdog 5 tasi 1 da (Big)',
    nameRu: 'Хотдог 5 штук 1 шт (Большой)',
    price: 35000,
    category: 'Hotdog 5 tasi 1 da (Big)'
  },
  {
    nameUz: 'Gamburger 5 tasi 1 da',
    nameRu: 'Гамбургер 5 штук 1 шт',
    price: 30000,
    category: 'Gamburger 5 tasi 1 da'
  },
  {
    nameUz: 'Chicken Burger 5 tasi 1 da',
    nameRu: 'Чикен Бургер 5 штук 1 шт',
    price: 32000,
    category: 'Chicken Burger 5 tasi 1 da'
  },
  {
    nameUz: 'Gamburger',
    nameRu: 'Гамбургер',
    price: 18000,
    category: 'Gamburger'
  },
  {
    nameUz: 'DablBurger',
    nameRu: 'ДаблБургер',
    price: 25000,
    category: 'DablBurger'
  },
  {
    nameUz: 'Chizburger',
    nameRu: 'Чизбургер',
    price: 20000,
    category: 'Chizburger'
  },
  {
    nameUz: 'DablChizburger',
    nameRu: 'ДаблЧизбургер',
    price: 28000,
    category: 'DablChizburger'
  },
  {
    nameUz: 'ChickenDog 5 tasi 1 da',
    nameRu: 'ЧикенДог 5 штук 1 шт',
    price: 30000,
    category: 'ChickenDog 5 tasi 1 da'
  },
  {
    nameUz: 'Hot-Dog',
    nameRu: 'Хот-Дог',
    price: 15000,
    category: 'Hot-Dog'
  },
  {
    nameUz: 'Hot-Dog (big)',
    nameRu: 'Хот-Дог (большой)',
    price: 22000,
    category: 'Hot-Dog (big)'
  },
  {
    nameUz: 'Kartoshka Fri',
    nameRu: 'Картошка Фри',
    price: 12000,
    category: 'Kartoshka Fri'
  },
  {
    nameUz: 'Coca Cola 0.5',
    nameRu: 'Кока Кола 0.5',
    price: 8000,
    category: 'Coca Cola 0.5'
  },
  {
    nameUz: 'ChickenBurger',
    nameRu: 'ЧикенБургер',
    price: 20000,
    category: 'ChickenBurger'
  },
  {
    nameUz: 'IceCoffee',
    nameRu: 'АйсКофе',
    price: 15000,
    category: 'IceCoffee'
  },
  {
    nameUz: 'Klab Sendwich',
    nameRu: 'Клаб Сэндвич',
    price: 25000,
    category: 'Klab Sendwich'
  },
  {
    nameUz: 'Klab Sendwich Fri bilan',
    nameRu: 'Клаб Сэндвич с Фри',
    price: 32000,
    category: 'Klab Sendwich Fri bilan'
  },
  {
    nameUz: 'Fri va Cola',
    nameRu: 'Фри и Кола',
    price: 18000,
    category: 'Fri va Cola'
  },
  {
    nameUz: 'Naggets 4',
    nameRu: 'Наггетсы 4',
    price: 20000,
    category: 'Naggets 4'
  },
  {
    nameUz: 'Naggets 8',
    nameRu: 'Наггетсы 8',
    price: 35000,
    category: 'Naggets 8'
  },
  {
    nameUz: 'Strips',
    nameRu: 'Стрипсы',
    price: 22000,
    category: 'Strips'
  },
  {
    nameUz: 'Moxito Classic',
    nameRu: 'Мохито Классик',
    price: 18000,
    category: 'Moxito Classic'
  },
  {
    nameUz: 'Combo 2',
    nameRu: 'Комбо 2',
    price: 45000,
    category: 'Combo 2'
  },
  {
    nameUz: 'Chizburger set 4',
    nameRu: 'Чизбургер сет 4',
    price: 75000,
    category: 'Chizburger set 4'
  },
  {
    nameUz: 'Gigant Hot-Dog',
    nameRu: 'Гигант Хот-Дог',
    price: 28000,
    category: 'Gigant Hot-Dog'
  },
  {
    nameUz: 'Ice-Tea',
    nameRu: 'Айс-Ти',
    price: 10000,
    category: 'Ice-Tea',
    discount: 25
  }
]

async function seedProducts() {
  try {
    console.log('Seeding products...')
    
    for (const product of products) {
      await db.product.create({
        data: product
      })
    }
    
    console.log('Products seeded successfully!')
  } catch (error) {
    console.error('Error seeding products:', error)
  } finally {
    await db.$disconnect()
  }
}

async function seedAdminUser() {
  try {
    console.log('Seeding admin user...')
    
    await db.adminUser.create({
      data: {
        username: 'dendyuz',
        password: 'parolyoq'
      }
    })
    
    console.log('Admin user seeded successfully!')
  } catch (error) {
    console.error('Error seeding admin user:', error)
  }
}

async function main() {
  await seedAdminUser()
  await seedProducts()
}

main()