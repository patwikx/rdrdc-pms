'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Home,
  Download,
  Filter
} from 'lucide-react'

// Mock data
const revenueData = [
  { month: 'Jan', revenue: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Feb', revenue: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Mar', revenue: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Apr', revenue: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'May', revenue: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Jun', revenue: Math.floor(Math.random() * 5000) + 1000 },
]

const expenseData = [
  { name: 'Maintenance', value: 30000 },
  { name: 'Utilities', value: 20000 },
  { name: 'Insurance', value: 15000 },
  { name: 'Property Tax', value: 25000 },
  { name: 'Management', value: 10000 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const transactions = [
  { id: 1, date: '2023-06-01', description: 'Rent Payment - Apt 101', amount: 1500, type: 'Income' },
  { id: 2, date: '2023-06-02', description: 'Plumbing Repair - Apt 205', amount: -350, type: 'Expense' },
  { id: 3, date: '2023-06-03', description: 'Rent Payment - Apt 302', amount: 1800, type: 'Income' },
  { id: 4, date: '2023-06-04', description: 'Property Insurance', amount: -1000, type: 'Expense' },
  { id: 5, date: '2023-06-05', description: 'Rent Payment - Apt 404', amount: 1600, type: 'Income' },
]

const FinancialForms = () => {
  const [timeframe, setTimeframe] = useState('monthly')

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

  return (
    <motion.div 
      className='flex h-screen bg-background'
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <main className='flex-1 overflow-hidden'>
        <ScrollArea className="flex-1 p-6">
          <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
            <h1 className="text-3xl font-bold">Financial Overview</h1>
            <div className="flex space-x-2">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6"
            variants={containerVariants}
          >
            {[
              { title: "Total Revenue", icon: DollarSign, value: "₱54,231", change: "+20.1% from last month" },
              { title: "Total Expenses", icon: TrendingDown, value: "₱13,000", change: "+5.4% from last month" },
              { title: "Net Income", icon: TrendingUp, value: "₱18,013", change: "+14.7% from last month" },
              { title: "Occupancy Rate", icon: Home, value: "92%", change: "+2% from last month" },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <p className="text-xs text-muted-foreground">{item.change}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                <TabsContent value="overview">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Monthly revenue for the current year</CardDescription>
                      </CardHeader>
                      <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                <TabsContent value="income">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Income Sources</CardTitle>
                        <CardDescription>Breakdown of income by category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={expenseData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {expenseData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                <TabsContent value="expenses">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Expense Breakdown</CardTitle>
                        <CardDescription>Detailed view of expenses by category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={expenseData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {expenseData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                <TabsContent value="transactions">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Latest financial activities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Type</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {transactions.map((transaction) => (
                              <TableRow key={transaction.id}>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell className={transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}>
                                ₱{Math.abs(transaction.amount).toFixed(2)}
                                </TableCell>
                                <TableCell>{transaction.type}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </ScrollArea>
      </main>
    </motion.div>
  )
}

export default FinancialForms