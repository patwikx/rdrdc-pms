'use client'

import React, { useState } from 'react'
import Header from '@/components/header/page'
import Sidebar from '@/components/sidebar/page'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  Plus, 
  FileText, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'
import TenantOnboarding from './onboarding'


// Mock data for leases
const leases = [
  { id: 1, tenant: "Larry Paler", property: "RD Hardware Santiago", unit: "101", startDate: "2023-01-01", endDate: "2024-01-01", rent: 1500, status: "Active" },
  { id: 2, tenant: "Jimster Santillan", property: "RD Retail Campang Ext.", unit: "205", startDate: "2023-03-15", endDate: "2024-03-15", rent: 2000, status: "Active" },
  { id: 3, tenant: "Kristian Quizon", property: "Tambykez", unit: "302", startDate: "2023-06-01", endDate: "2024-06-01", rent: 1800, status: "Pending" },
  { id: 4, tenant: "Argie Tacay", property: "PAG-IBIG Office", unit: "404", startDate: "2022-12-01", endDate: "2023-12-01", rent: 2200, status: "Expiring Soon" },
  { id: 5, tenant: "Cezar Regalado", property: "7-11 Daproza Avenue", unit: "501", startDate: "2023-02-15", endDate: "2024-02-15", rent: 1700, status: "Active" },
]

const LeaseForm = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredLeases = leases.filter(lease => 
    (lease.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
     lease.property.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || lease.status === statusFilter)
  )

  const getStatusBadge = (status: 'Active' | 'Pending' | 'Expiring Soon' | string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'Pending':
        return <Badge className="bg-yellow-500">Pending</Badge>
      case 'Expiring Soon':
        return <Badge className="bg-orange-500">Expiring Soon</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  return (
    <div className='flex h-screen bg-background'>
      <main className='flex-1 overflow-hidden'>
        <ScrollArea className="flex-1 p-6">
          <div className="flex justify-between items-center mt-[-30px]">
            <h1 className="text-3xl font-bold">Leases</h1>
            <div className="flex items-center space-x-2">
            <TenantOnboarding />
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search leases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-[300px]"
                  />
                  <Button variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeases.map((lease) => (
                    <TableRow key={lease.id}>
                      <TableCell>{lease.tenant}</TableCell>
                      <TableCell>{lease.property}</TableCell>
                      <TableCell>{lease.unit}</TableCell>
                      <TableCell>{lease.startDate}</TableCell>
                      <TableCell>{lease.endDate}</TableCell>
                      <TableCell>
                        ₱{new Intl.NumberFormat('en-PH', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        }).format(lease.rent)}
                      </TableCell>
                      <TableCell>{getStatusBadge(lease.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Active Leases
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Expiring This Month
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Renewals
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Vacant Units
                </CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}

export default LeaseForm