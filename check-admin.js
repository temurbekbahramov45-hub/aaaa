const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAdminUser() {
  try {
    console.log('Checking admin user...')
    
    const adminUser = await prisma.adminUser.findUnique({
      where: { username: 'dendyuz' }
    })
    
    if (adminUser) {
      console.log('Admin user found:')
      console.log('Username:', adminUser.username)
      console.log('Password:', adminUser.password)
      console.log('Created at:', adminUser.createdAt)
    } else {
      console.log('Admin user not found!')
      console.log('Creating admin user...')
      
      await prisma.adminUser.create({
        data: {
          username: 'dendyuz',
          password: 'parolyoq'
        }
      })
      
      console.log('Admin user created successfully!')
    }
  } catch (error) {
    console.error('Error checking admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdminUser()