'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  FileText, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from '@/components/ui/skeleton'
import TenantOnboarding from './onboarding'

// Define types for the lease data
interface Tenant {
  firstName: string
  lastName: string
}

interface Space {
  spaceNumber: string
}

interface Property {
  propertyName: string
  space: Space[]
}

interface Lease {
  id: string
  tenant: Tenant
  property: Property
  leaseStart: string
  leaseEnd: string
  rent: number
  status: string
}

export default function LeaseManagement() {
  const [leases, setLeases] = useState<Lease[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { toast } = useToast()

  const fetchLeases = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get<Lease[]>('/api/fetch-lease')
      setLeases(response.data)
    } catch (error) {
      console.error('Error fetching leases:', error)
      toast({
        title: "Error",
        description: "Failed to fetch leases. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchLeases()
  }, [fetchLeases])

  const filteredLeases = leases.filter(lease => 
    (lease.tenant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     lease.tenant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     lease.property.propertyName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || lease.status === statusFilter)
  )

  const getLeaseStatus = (leaseEnd: string) => {
    const today = new Date();
    const endDate = new Date(leaseEnd);
    
    // Set the time to midnight for both dates
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
  
    const daysUntilExpiration = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
    if (daysUntilExpiration < 0) {
      return 'Expired'; // Lease has expired
    } else if (daysUntilExpiration <= 30) {
      return 'For Renewal'; // Lease is about to expire (less than or equal to 30 days)
    } else {
      return 'Active'; // Lease is active (more than 30 days)
    }
  };
  
  const getStatusBadge = (leaseEnd: string) => {
    const status = getLeaseStatus(leaseEnd);
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'For Renewal':
        return <Badge className="bg-yellow-400">For Renewal</Badge>; // Yellow-orange color for renewal
      case 'Expired':
        return <Badge className="bg-red-500">Expired</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

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

  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  )

  const expiringLeases = leases.filter(lease => getLeaseStatus(lease.leaseEnd) === 'For Renewal').length

  return (
    <motion.div 
      className="flex h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="flex-1 p-6">
          <motion.div 
            className="flex justify-between items-center mb-6"
            variants={itemVariants}
          >
            <h1 className="text-3xl font-bold mt-[-30px]">Leases</h1>
            <div className="flex items-center space-x-2 mt-[-30px]">
              <TenantOnboarding onLeaseCreated={fetchLeases} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="mb-6 mt-[-20px]">
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
                      <span className="sr-only">Search</span>
                    </Button>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Expiring">Expiring</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
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
                    {loading ? (
                      <>
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                      </>
                    ) : (
                      <AnimatePresence>
                        {filteredLeases.map((lease) => (
                          <motion.tr
                            key={lease.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <TableCell>{`${lease.tenant.firstName} ${lease.tenant.lastName}`}</TableCell>
                            <TableCell>{lease.property.propertyName}</TableCell>
                            <TableCell>{lease.property.space[0]?.spaceNumber || 'N/A'}</TableCell>
                            <TableCell>{lease.leaseStart}</TableCell>
                            <TableCell>{lease.leaseEnd}</TableCell>
                            <TableCell>
                              ₱{new Intl.NumberFormat('en-PH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(lease.rent)}
                            </TableCell>
                            <TableCell>{getStatusBadge(lease.leaseEnd)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="icon">
                                  <FileText className="h-4 w-4" />
                                  <span className="sr-only">View details</span>
                                </Button>
                                <Button variant="outline" size="icon">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit lease</span>
                                </Button>
                                <Button variant="outline" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete lease</span>
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
          >
            {[
              { title: "Total Active Leases", value: leases.filter(l => getLeaseStatus(l.leaseEnd) === 'Active').length, icon: CheckCircle2 },
              { title: "For Renewal", value: expiringLeases, icon: Clock },
              { title: "Expired Leases", value: leases.filter(l => getLeaseStatus(l.leaseEnd) === 'Expired').length, icon: AlertTriangle },
              { title: "Vacant Units", value: 'N/A', icon: XCircle }
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {loading ? <Skeleton className="h-4 w-32" /> : item.title}
                    </CardTitle>
                    {loading ? (
                      <Skeleton className="h-4 w-4 rounded-full" />
                    ) : (
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-2xl font-bold">{item.value}</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </ScrollArea>
      </main>
    </motion.div>
  )
}