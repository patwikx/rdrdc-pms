'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Lock, Shield } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RegisterForm } from '@/components/auth/register-form'
import axios from 'axios'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function SystemAdminDetails() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [users, setUsers] = useState<any[]>([])

  const handlePasswordChange = (userId: number) => {
    setSelectedUser(userId)
    setIsPasswordModalOpen(true)
  }
  
  const handleEditPermissions = (userId: number) => {
    setSelectedUser(userId)
    setIsPermissionsModalOpen(true)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/fetch-users')
        setUsers(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <motion.div 
      className='flex h-screen bg-background'
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <main className='flex-1 overflow-y-auto'>
        <motion.div className="container mx-auto p-6" variants={itemVariants}>
          <motion.h1 className="text-3xl font-bold mb-6" variants={itemVariants}>User Management</motion.h1>
          <Tabs defaultValue="users">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="users">User List</TabsTrigger>
              <TabsTrigger value="settings">Access Control</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <TabsContent value="users">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <motion.div className="flex justify-between mb-4" variants={itemVariants}>
                        <div className="flex gap-2">
                          <Input placeholder="Search users..." />
                          <Button variant="secondary">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Button>
                        </div>
                        <RegisterForm />
                      </motion.div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <AnimatePresence>
                            {users.map((user) => (
                              <motion.tr
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <TableCell>{user.firstName} {user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    {user.status}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => handlePasswordChange(user.id)}>
                                          <Lock className="h-4 w-4 mr-2" />
                                          Change Password
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Change Password</DialogTitle>
                                          <DialogDescription>Enter a new password for the user.</DialogDescription>
                                        </DialogHeader>
                                        <form className="space-y-4">
                                          <div>
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" />
                                          </div>
                                          <div>
                                            <Label htmlFor="confirm-password">Confirm Password</Label>
                                            <Input id="confirm-password" type="password" />
                                          </div>
                                        </form>
                                        <DialogFooter>
                                          <Button type="submit" onClick={() => setIsPasswordModalOpen(false)}>Change Password</Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                    <Dialog open={isPermissionsModalOpen} onOpenChange={setIsPermissionsModalOpen}>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => handleEditPermissions(user.id)}>
                                          <Shield className="h-4 w-4 mr-2" />
                                          Edit Permissions
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="p-6">
                                        <DialogHeader>
                                          <DialogTitle className="text-lg font-semibold">Edit User Permissions</DialogTitle>
                                          <DialogDescription className="text-sm text-muted-foreground">
                                            Modify access rights for this user.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-6">
                                          <div>
                                            <div className="space-y-4">
                                              <div className="flex items-center justify-between">
                                                <Label htmlFor="property-access">Property Access</Label>
                                                <Switch id="property-access"  />
                                              </div>
                                              <div className="flex items-center justify-between">
                                                <Label htmlFor="tenant-access">Tenant Access</Label>
                                                <Switch id="tenant-access" />
                                              </div>
                                              <div className="flex items-center justify-between">
                                                <Label htmlFor="leasing-access">Leasing Access</Label>
                                                <Switch id="leasing-access"  />
                                              </div>
                                              <div className="flex items-center justify-between">
                                                <Label htmlFor="financial-reports">Financial Reports</Label>
                                                <Switch id="financial-reports"  />
                                              </div>
                                              <div className="flex items-center justify-between">
                                                <Label htmlFor="system-settings">System Settings</Label>
                                                <Switch id="system-settings"  />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <DialogFooter className="flex justify-center space-x-2">
                                          <Button variant="outline" onClick={() => setIsPermissionsModalOpen(false)}>
                                            Cancel
                                          </Button>
                                          <Button type="submit" onClick={() => setIsPermissionsModalOpen(false)}>
                                            Save
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </TableCell>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              <TabsContent value="settings">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Access Control Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <motion.div className="space-y-6" variants={containerVariants}>
                        <motion.div variants={itemVariants}>
                          <h3 className="text-lg font-medium mb-2">Role Management</h3>
                          <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="role-select">Select Role</Label>
                              <Select>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                  <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="user-management">User Management</Label>
                                <Switch id="user-management" />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="property-access">Property Access</Label>
                                <Switch id="property-access" />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="financial-reports">Financial Reports</Label>
                                <Switch id="financial-reports" />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="system-settings">System Settings</Label>
                                <Switch id="system-settings" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <h3 className="text-lg font-medium mb-2">Password Policy</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="min-length">Minimum Password Length</Label>
                              <Input id="min-length" type="number" className="w-20" defaultValue={8} />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="require-uppercase">Require Uppercase</Label>
                              <Switch id="require-uppercase" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="require-number">Require Number</Label>
                              <Switch id="require-number" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="require-special">Require Special Character</Label>
                              <Switch id="require-special" />
                            </div>
                          </div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="2fa-toggle">Require 2FA for all users</Label>
                              <p className="text-sm text-muted-foreground">Enhance security by requiring two-factor authentication</p>
                            </div>
                            <Switch id="2fa-toggle" />
                          </div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <Button>Save Settings</Button>
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </main>
    </motion.div>
  )
}