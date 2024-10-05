'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { 
  Moon,
  Sun
} from 'lucide-react'

type UserNotifications = {
  email: boolean;
  push: boolean;
  sms: boolean;
};

type UserSettings = {
  name: string;
  email: string;
  company: string;
  language: string;
  theme: 'light' | 'dark';
  notifications: UserNotifications;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const SettingsForm = () => {
  const [user, setUser] = useState<UserSettings>({
    name: 'Patrick Miranda',
    email: 'plmiranda@rdretailgroup.com.ph',
    company: 'RD Hardware & Fishing Supply, Inc.',
    language: 'en',
    theme: 'light',
    notifications: {
      email: true,
      push: false,
      sms: true
    }
  })

  const [loading, setLoading] = useState<boolean>(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (type: keyof UserNotifications) => {
    setUser(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }))
  }

  const handleSave = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <motion.div 
      className='flex h-screen bg-background'
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <main className='flex-1 overflow-hidden'>
        <ScrollArea className="flex-1 p-6">
          <motion.h1 className="text-3xl font-bold mb-6" variants={itemVariants}>Settings</motion.h1>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-5">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <TabsContent value="account">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>Manage your account details and preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={user.name} onChange={handleInputChange} />
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={user.email} onChange={handleInputChange} />
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="language">Language</Label>
                        <Select value={user.language} onValueChange={(value) => setUser(prev => ({ ...prev, language: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Tagalog</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="password">Change Password</Label>
                        <Input id="password" type="password" placeholder="Current password" />
                        <Input id="new-password" type="password" placeholder="New password" />
                      </motion.div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
              <TabsContent value="company">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Settings</CardTitle>
                      <CardDescription>Manage your company information and preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input id="company-name" name="company" value={user.company} onChange={handleInputChange} />
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="company-address">Company Address</Label>
                        <Textarea id="company-address" placeholder="Enter company address" />
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="company-phone">Company Phone</Label>
                        <Input id="company-phone" type="tel" placeholder="Enter company phone number" />
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="company-website">Company Website</Label>
                        <Input id="company-website" type="url" placeholder="Enter company website" />
                      </motion.div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
              <TabsContent value="notifications">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Manage how you receive notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div className="flex items-center justify-between" variants={itemVariants}>
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={user.notifications.email}
                          onCheckedChange={() => handleNotificationChange('email')}
                        />
                      </motion.div>
                      <motion.div className="flex items-center justify-between" variants={itemVariants}>
                        <div className="space-y-0.5">
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={user.notifications.push}
                          onCheckedChange={() => handleNotificationChange('push')}
                        />
                      </motion.div>
                      <motion.div className="flex items-center justify-between" variants={itemVariants}>
                        <div className="space-y-0.5">
                          <Label htmlFor="sms-notifications">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={user.notifications.sms}
                          onCheckedChange={() => handleNotificationChange('sms')}
                        />
                      </motion.div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
              <TabsContent value="appearance">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance Settings</CardTitle>
                      <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label>Theme</Label>
                        <div className="flex space-x-2">
                          <Button 
                            variant={user.theme === 'light' ? 'default' : 'outline'}
                            onClick={() => setUser(prev => ({ ...prev, theme: 'light' }))}
                          >
                            <Sun className="mr-2 h-4 w-4" />
                            Light
                          </Button>
                          <Button 
                            variant={user.theme === 'dark' ? 'default' : 'outline'}
                            onClick={() => setUser(prev => ({ ...prev, theme: 'dark' }))}
                          >
                            <Moon className="mr-2 h-4 w-4" />
                            Dark
                          </Button>
                        </div>
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label>Color Scheme</Label>
                        <div className="flex space-x-2">
                          <Button variant="outline" className="w-8 h-8 p-0 bg-blue-500" />
                          <Button variant="outline" className="w-8 h-8 p-0 bg-green-500" />
                          <Button variant="outline" className="w-8 h-8 p-0 bg-purple-500" />
                          <Button variant="outline" className="w-8 h-8 p-0 bg-orange-500" />
                        </div>
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemVariants}>
                        <Label>Font Size</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue placeholder="Select font size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </ScrollArea>
      </main>
      <Toaster />
    </motion.div>
  )
}

export default SettingsForm