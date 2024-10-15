'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import axios from 'axios'

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
  { id: "1", name: "Larry Paler", unit: "101", dueDate: "2023-06-01", amountDue: 1000, status: 'Pending', email: "larry@example.com", phone: "(555) 123-4567", leaseStart: "2023-01-01", leaseEnd: "2023-12-31" },
  { id: "2", name: "Jimster Santillan", unit: "102", dueDate: "2023-06-01", amountDue: 1200, status: 'Overdue', email: "jimster@example.com", phone: "(555) 234-5678", leaseStart: "2023-02-01", leaseEnd: "2024-01-31" },
  { id: "3", name: "Argie Tacay", unit: "103", dueDate: "2023-06-02", amountDue: 950, status: 'Paid', email: "argie@example.com", phone: "(555) 345-6789", leaseStart: "2023-03-01", leaseEnd: "2024-02-29" },
  { id: "4", name: "Cezar Regalado", unit: "104", dueDate: "2023-06-03", amountDue: 1100, status: 'Pending', email: "cezar@example.com", phone: "(555) 456-7890", leaseStart: "2023-04-01", leaseEnd: "2024-03-31" },
  { id: "5", name: "Patrick Lacap Miranda", unit: "105", dueDate: "2024-10-15", amountDue: 1050, status: 'Overdue', email: "plmiranda@rdretailgroup.com.ph", phone: "(555) 567-8901", leaseStart: "2023-05-01", leaseEnd: "2024-04-30" },
]

export function BillingManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Overdue' | 'Pending'>('All')

  const handleTransaction = (tenant: Tenant) => {
    setSelectedTenant(tenant)
  }

  const handleEmailBilling = async (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    const invoiceNumber = `BILL INV. ${Math.floor(100000 + Math.random() * 900000)}`;
    const invoiceDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const dueDate = new Date(tenant.dueDate);
    const formattedDueDate = dueDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

    const vatableAmount = tenant.amountDue / 1.12; // Assuming 12% VAT
    const vatAmount = tenant.amountDue - vatableAmount;

    try {
      await axios.post("/api/send-email", {
        to: tenant.email,
        subject: `Billing Invoice ${invoiceNumber}`,
        body: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td colspan="2" style="font-size: 18px; font-weight: bold;">RD REALTY DEVELOPMENT CORPORATION</td>
            </tr>
            <tr>
              <td colspan="2">General Santos Business Park, National Highway, General Santos City</td>
            </tr>
            <tr>
              <td colspan="2">VAT Registration TIN 000-636-006-000</td>
            </tr>
            <tr>
              <td colspan="2" style="font-size: 16px; font-weight: bold; padding-top: 20px;">BILLING INVOICE</td>
            </tr>
            <tr>
              <td>
                Customer's Name: ${tenant.name}<br>
                Business Address: ${tenant.unit}<br>
                TIN: (Customer's TIN)
              </td>
              <td style="text-align: right;">
                Invoice Date: ${invoiceDate}<br>
                ${invoiceNumber}
              </td>
            </tr>
          </table>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Unit Price</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">AMOUNT</th>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">MONTHLY RENTAL - ${dueDate.toLocaleString('default', { month: 'long' })} ${dueDate.getFullYear()}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">1</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₱${vatableAmount.toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₱${vatableAmount.toFixed(2)}</td>
            </tr>
          </table>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="width: 70%;">
                Terms: 7 days<br><br>
                This is a system-generated invoice and if issued without<br>
                alteration, does not require a signature.<br><br>
                "This document is valid for claim of input tax"<br>
                CAS Permit No. 01-2016-123-0001-00000<br>
                Range of serial nos. from 100000 to 199999<br>
                Date Issue: Jan. 04, 2016
              </td>
              <td style="width: 30%; text-align: right;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td>Vatable Sales</td>
                    <td style="text-align: right;">₱${vatableAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>VAT Exempt Sales</td>
                    <td style="text-align: right;">₱0.00</td>
                  </tr>
                  <tr>
                    <td>Zero Rated Sales</td>
                    <td style="text-align: right;">₱0.00</td>
                  </tr>
                  <tr>
                    <td>VAT Amount</td>
                    <td style="text-align: right;">₱${vatAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold;">Total Amount Due</td>
                    <td style="font-weight: bold; text-align: right;">₱${tenant.amountDue.toFixed(2)}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <div style="margin-top: 20px; text-align: center; font-style: italic;">
            This is a system generated billing invoice.
          </div>
        </div>
        `
      });

      console.log(`Billing invoice emailed to tenant ${tenantId}`);
    } catch (error) {
      console.error(`Error sending billing invoice to tenant ${tenantId}:`, error);
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    (tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.unit.includes(searchTerm)) &&
    (filterStatus === 'All' || tenant.status === filterStatus)
  )

  const totalDue = tenants.reduce((sum, tenant) => sum + tenant.amountDue, 0)
  const overdueTenants = tenants.filter(tenant => tenant.status === 'Overdue').length
  const pendingPayments = tenants.filter(tenant => tenant.status === 'Pending').length
  const totalTenants = tenants.length

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
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex justify-between items-center mt-[-20px]" variants={itemVariants}>
        <h1 className="text-3xl font-bold">Billing Management</h1>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </motion.div>

      <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" variants={containerVariants}>
        {[
          { title: "Total Due", value: `₱${totalDue.toFixed(2)}`, icon: DollarSign, subtext: "+2.1% from last month" },
          { title: "Overdue Tenants", value: overdueTenants, icon: AlertTriangle, subtext: `${((overdueTenants / totalTenants) * 100).toFixed(1)}% of total tenants` },
          { title: "Pending Payments", value: pendingPayments, icon: Calendar, subtext: `${((pendingPayments / totalTenants) * 100).toFixed(1)}% of total tenants` },
          { title: "Total Tenants", value: totalTenants, icon: Users, subtext: "+3 new this month" },
        ].map((item, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.subtext}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="flex justify-between items-center" variants={itemVariants}>
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
      </motion.div>

      <motion.div variants={itemVariants}>
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
                <AnimatePresence>
                  {filteredTenants.map((tenant) => (
                    <motion.tr
                      key={tenant.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
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
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
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
      </motion.div>
    </motion.div>
  )
}