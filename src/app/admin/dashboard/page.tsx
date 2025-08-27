'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, LogOut } from 'lucide-react'

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

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    nameUz: '',
    nameRu: '',
    price: '',
    image: '',
    discount: '',
    category: '',
    available: true
  })

  useEffect(() => {
    checkAuth()
    fetchProducts()
  }, [])

  const checkAuth = () => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated')
    if (!isAuthenticated) {
      window.location.href = '/admin'
    }
  }

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

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated')
    window.location.href = '/admin'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: 'Muvaffaqiyatli',
          description: editingProduct ? 'Mahsulot yangilandi' : 'Mahsulot qo\'shildi'
        })
        
        setIsAddDialogOpen(false)
        setEditingProduct(null)
        setFormData({
          nameUz: '',
          nameRu: '',
          price: '',
          image: '',
          discount: '',
          category: '',
          available: true
        })
        
        fetchProducts()
      } else {
        throw new Error('Failed to save product')
      }
    } catch (error) {
      toast({
        title: 'Xatolik',
        description: 'Mahsulotni saqlashda xatolik yuz berdi',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      nameUz: product.nameUz,
      nameRu: product.nameRu,
      price: product.price.toString(),
      image: product.image || '',
      discount: product.discount?.toString() || '',
      category: product.category,
      available: product.available
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (confirm('Mahsulotni o\'chirishni xohlaysizmi?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          toast({
            title: 'Muvaffaqiyatli',
            description: 'Mahsulot o\'chirildi'
          })
          fetchProducts()
        } else {
          throw new Error('Failed to delete product')
        }
      } catch (error) {
        toast({
          title: 'Xatolik',
          description: 'Mahsulotni o\'chirishda xatolik yuz berdi',
          variant: 'destructive'
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-orange-600">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingProduct(null)
                    setFormData({
                      nameUz: '',
                      nameRu: '',
                      price: '',
                      image: '',
                      discount: '',
                      category: '',
                      available: true
                    })
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Mahsulot qo'shish
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="nameUz">Nomi (Uzbek)</Label>
                      <Input
                        id="nameUz"
                        value={formData.nameUz}
                        onChange={(e) => setFormData({...formData, nameUz: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="nameRu">Nomi (Russian)</Label>
                      <Input
                        id="nameRu"
                        value={formData.nameRu}
                        onChange={(e) => setFormData({...formData, nameRu: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Narxi</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Kategoriya</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        placeholder="Masalan: Xot-Doglar, Burgerlar, Ichimliklar"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Rasm URL</Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount">Chegirma (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discount}
                        onChange={(e) => setFormData({...formData, discount: e.target.value})}
                        placeholder="0-100"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {editingProduct ? 'Yangilash' : 'Qo\'shish'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Chiqish
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={product.image || '/placeholder-food.jpg'}
                  alt={product.nameUz}
                  className="w-full h-full object-cover"
                />
                {product.discount && (
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    -{product.discount}%
                  </Badge>
                )}
                {!product.available && (
                  <Badge className="absolute top-2 left-2 bg-gray-500">
                    Mavjud emas
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">{product.nameUz}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.nameRu}</p>
                <div className="flex items-center gap-2 mb-2">
                  {product.discount ? (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        {product.price.toLocaleString('uz-UZ')} so'm
                      </span>
                      <span className="font-bold text-orange-600">
                        {(product.price * (1 - product.discount / 100)).toLocaleString('uz-UZ')} so'm
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-orange-600">
                      {product.price.toLocaleString('uz-UZ')} so'm
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}