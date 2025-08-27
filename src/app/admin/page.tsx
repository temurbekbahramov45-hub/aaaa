'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

export default function AdminPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log('Attempting login with:', { username, password: '***' })

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      console.log('Login response status:', response.status)
      
      const data = await response.json()
      console.log('Login response data:', data)

      if (response.ok) {
        localStorage.setItem('isAdminAuthenticated', 'true')
        console.log('Login successful, redirecting to dashboard...')
        window.location.href = '/admin/dashboard'
      } else {
        console.log('Login failed:', data.error)
        toast({
          title: 'Xatolik',
          description: data.error || 'Login yoki parol noto\'g\'ri',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Xatolik',
        description: 'Server xatosi: ' + (error as Error).message,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-orange-600">Admin Panel</CardTitle>
          <p className="text-gray-600">DendyFood boshqaruv paneli</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? 'Kirish...' : 'Kirish'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}