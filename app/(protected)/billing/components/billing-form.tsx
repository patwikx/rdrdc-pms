'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Mail, 
  CreditCard, 
  FileText, 
  Search, 
  Filter, 
  DollarSign, 
  Users, 
  Calendar, 
  AlertTriangle 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

type Tenant = {
  id: string
  name: string
  unit: string
  dueDate: string
  amountDue: number
  status: 'Paid' | 'Overdue' | 'Pending'
  email: string
  phone: string
  leaseStart: string
  leaseEnd: string
}

const tenants: Tenant[] = [
  { id: "1", name: "John Doe", unit: "101", dueDate: "2023-06-01", amountDue: 1000, status: 'Pending', email: "john@example.com", phone: "(555) 123-4567", leaseStart: "2023-01-01", leaseEnd: "2023-12-31" },
  { id: "2", name: "Jane Smith", unit: "102", dueDate: "2023-06-01", amountDue: 1200, status: 'Overdue', email: "jane@example.com", phone: "(555) 234-5678", leaseStart: "2023-02-01", leaseEnd: "2024-01-31" },
  { id: "3", name: "Bob Johnson", unit: "103", dueDate: "2023-06-02", amountDue: 950, status: 'Paid', email: "bob@example.com", phone: "(555) 345-6789", leaseStart: "2023-03-01", leaseEnd: "2024-02-29" },
  { id: "4", name: "Alice Brown", unit: "104", dueDate: "2023-06-03", amountDue: 1100, status: 'Pending', email: "alice@example.com", phone: "(555) 456-7890", leaseStart: "2023-04-01", leaseEnd: "2024-03-31" },
  { id: "5", name: "Charlie Davis", unit: "105", dueDate: "2023-06-04", amountDue: 1050, status: 'Overdue', email: "charlie@example.com", phone: "(555) 567-8901", leaseStart: "2023-05-01", leaseEnd: "2024-04-30" },
]

export function BillingManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Overdue' | 'Pending'>('All')

  const handleTransaction = (tenant: Tenant) => {
    setSelectedTenant(tenant)
  }

  const handleEmailBilling = (tenantId: string) => {
    console.log(`Emailing billing for tenant ${tenantId}`)
  }

  const filteredTenants = tenants.filter(tenant =>
    (tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.unit.includes(searchTerm)) &&
    (filterStatus === 'All' || tenant.status === filterStatus)
  )

  const totalDue = tenants.reduce((sum, tenant) => sum + tenant.amountDue, 0)
  const overdueTenants = tenants.filter(tenant => tenant.status === 'Overdue').length
  const pendingPayments = tenants.filter(tenant => tenant.status === 'Pending').length
  const totalTenants = tenants.length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mt-[-20px]">
        <h1 className="text-3xl font-bold">Billing Management</h1>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Due</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{totalDue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tenants</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTenants}</div>
            <p className="text-xs text-muted-foreground">{((overdueTenants / totalTenants) * 100).toFixed(1)}% of total tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">{((pendingPayments / totalTenants) * 100).toFixed(1)}% of total tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTenants}</div>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select onValueChange={(value) => setFilterStatus(value as any)} defaultValue="All">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant Billing Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>{tenant.name}</TableCell>
                  <TableCell>{tenant.unit}</TableCell>
                  <TableCell>{tenant.dueDate}</TableCell>
                  <TableCell>₱{tenant.amountDue.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${tenant.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        tenant.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {tenant.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => handleTransaction(tenant)}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Transact
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Process Payment for {selectedTenant?.name}</DialogTitle>
                            <DialogDescription>
                              Enter the payment details below.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="amount" className="text-right">
                                Amount
                              </Label>
                              <Input
                                id="amount"
                                defaultValue={selectedTenant?.amountDue.toFixed(2)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="paymentMethod" className="text-right">
                                Payment Method
                              </Label>
                              <Select defaultValue="credit_card">
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="credit_card">Credit Card</SelectItem>
                                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                  <SelectItem value="cash">Cash</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Process Payment</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline" onClick={() => handleEmailBilling(tenant.id)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Billing Process Information</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Tenant Billing Process</DialogTitle>
            <DialogDescription>
              Understanding the billing cycle and payment process for tenants.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="cycle">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cycle">Billing Cycle</TabsTrigger>
              <TabsTrigger value="methods">Payment Methods</TabsTrigger>
              <TabsTrigger value="late">Late Payments</TabsTrigger>
            </TabsList>
            <TabsContent value="cycle">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Cycle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Rent is due on the 1st of each month.</p>
                  <p>Grace period extends until the 5th of each month.</p>
                  <p>Statements are sent out on the 25th of the previous month.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="methods">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>We accept the following payment methods:</p>
                  <ul className="list-disc list-inside">
                    <li>Credit Card (Visa, MasterCard, American Express)</li>
                    <li>Bank Transfer (ACH)</li>
                    <li>Check</li>
                    <li>Cash (in person at the office only)</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="late">
              <Card>
                <CardHeader>
                  <CardTitle>Late Payments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>A late fee of ₱500.00 is applied for payments received after the 5th of the month.</p>
                  <p>Additional ₱100.00 per day fee for payments received after the 10th of the month.</p>
                  <p>Eviction process may begin for payments more than 30 days late.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}