'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { AlertCircle, CheckCircle2, CalendarIcon } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface Space {
  id: string;
  spaceNumber: string;
  spaceArea: string;
  spaceRate: string | null;
  spaceStatus: string | null;
  propertyId: string;
  totalSpaceRent: string;
}

interface Property {
  id: string;
  propertyName: string;
  propertyCode: string;
}

const formSchema = z.object({
  bpCode: z.string().min(1, "BP Code is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  contactNo: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Address is required"),
  companyName: z.string().optional(),
  propertyId: z.string().min(1, "Property selection is required"),
  spaceId: z.string().min(1, "Space selection is required"),
  rent: z.number().min(0, "Rent must be a positive number"),
  leaseStartDate: z.string().min(1, "Lease start date is required"),
  leaseEndDate: z.string().min(1, "Lease end date is required"),
  securityDeposit: z.number().min(0, "Security deposit must be a positive number"),
  utilityDeposit: z.number().min(0, "Utility deposit must be a positive number"),
  specialConditions: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const initialFormData: FormData = {
  bpCode: '',
  firstName: '',
  lastName: '',
  email: '',
  contactNo: '',
  address: '',
  companyName: '',
  propertyId: '',
  spaceId: '',
  rent: 0,
  leaseStartDate: '',
  leaseEndDate: '',
  securityDeposit: 0,
  utilityDeposit: 0,
  specialConditions: '',
}

const steps = [
  { title: 'Tenant Information', component: TenantInformationForm },
  { title: 'Lease Details', component: LeaseDetailsForm },
  { title: 'Confirmation', component: ConfirmationStep },
]

export default function TenantOnboarding({ onLeaseCreated }: { onLeaseCreated: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [properties, setProperties] = useState<Property[]>([])
  const [vacantSpaces, setVacantSpaces] = useState<Space[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [errors, setErrors] = useState<z.ZodIssue[]>([])

  useEffect(() => {
    fetchOnboardingData()
  }, [])

  const fetchOnboardingData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/fetch-vacant-spaces')
      setProperties(response.data.properties)
      setVacantSpaces(response.data.vacantSpaces)
    } catch (error) {
      console.error('Error fetching onboarding data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch onboarding data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const validateStep = (stepData: Partial<FormData>) => {
    const stepSchema = z.object(
      Object.fromEntries(
        Object.entries(formSchema.shape).filter(([key]) => key in stepData)
      )
    )
    return stepSchema.safeParse(stepData)
  }

  const nextStep = () => {
    const currentStepData = steps[currentStep].component === TenantInformationForm
      ? {
          bpCode: formData.bpCode,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          contactNo: formData.contactNo,
          address: formData.address,
          companyName: formData.companyName,
        }
      : {
          propertyId: formData.propertyId,
          spaceId: formData.spaceId,
          rent: formData.rent,
          leaseStartDate: formData.leaseStartDate,
          leaseEndDate: formData.leaseEndDate,
          securityDeposit: formData.securityDeposit,
          utilityDeposit: formData.utilityDeposit,
          specialConditions: formData.specialConditions,
        }

    const result = validateStep(currentStepData)
    if (!result.success) {
      setErrors(result.error.issues)
      const errorFields = result.error.issues.map(issue => issue.path[0]).join(', ')
      toast({
        title: "Validation Error",
        description: `Please correct the errors in the following fields: ${errorFields}`,
        variant: "destructive",
      })
      return
    }
    setErrors([])
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['rent', 'securityDeposit', 'utilityDeposit'].includes(name) ? parseFloat(value) || 0 : value 
    }))
    setErrors(prev => prev.filter(error => error.path[0] !== name))

    if (name === 'spaceId') {
      const selectedSpace = vacantSpaces.find(space => space.id === value)
      if (selectedSpace) {
        const rent = parseFloat(selectedSpace.totalSpaceRent) || 0
        setFormData(prev => ({ 
          ...prev, 
          rent: rent,
          securityDeposit: rent * 3, // Set security deposit to 2 months' rent
          utilityDeposit: rent * 0.5 // Set utility deposit to half month's rent
        }))
      }
    }
  }

  const handleDateChange = (date: Date | undefined, field: 'leaseStartDate' | 'leaseEndDate') => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [field]: format(date, "yyyy-MM-dd")
      }))
      setErrors(prev => prev.filter(error => error.path[0] !== field))
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const validatedData = formSchema.parse(formData)
      const response = await axios.post('/api/onboard-tenant', validatedData)
      console.log('Tenant onboarded successfully:', response.data)
      toast({
        title: "Success",
        description: "Tenant has been successfully onboarded.",
      })
      onLeaseCreated() // Call the prop function to update the lease list
      setFormData(initialFormData)
      setCurrentStep(0)
      setIsDialogOpen(false)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.issues)
        const errorFields = error.issues.map(issue => issue.path[0]).join(', ')
        toast({
          title: "Validation Error",
          description: `Please correct the errors in the following fields: ${errorFields}`,
          variant: "destructive",
        })
      } else if (axios.isAxiosError(error)) {
        toast({
          title: "Submission Error",
          description: error.response?.data?.message || "An error occurred while submitting the form.",
          variant: "destructive",
        })
      } else {
        console.error('Error onboarding tenant:', error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentComponent = steps[currentStep].component

  return (
    <div className="flex">
      <div className="flex-1 p-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Add New Tenant</Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">{steps[currentStep].title}</CardTitle>
              <CardDescription>Step {currentStep + 1} of {steps.length}</CardDescription>
              <Separator className="my-4" />
            </CardHeader>

            <CardContent className="mt-[-30px]">
              {errors.length > 0 && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <h3 className="text-sm font-medium text-destructive">Please correct the following errors:</h3>
                  </div>
                  <ul className="mt-2 text-sm text-destructive list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative w-full"
              >
                <CurrentComponent 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                  handleDateChange={handleDateChange}
                  properties={properties}
                  vacantSpaces={vacantSpaces}
                  errors={errors}
                />
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-between mt-2">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                Previous
              </Button>
              <Button 
                onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? 'Submitting...' : currentStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </CardFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function TenantInformationForm({ formData, handleInputChange, errors }: { formData: FormData; handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; errors: z.ZodIssue[] }) {
  const getError = (field: keyof FormData) => errors.find(error => error.path[0] === field)?.message

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="bpCode">BP Code</Label>
        <Input id="bpCode" name="bpCode" value={formData.bpCode} onChange={handleInputChange} placeholder="BP-12345" className="w-full" />
        {getError('bpCode') && <p className="text-sm text-destructive">{getError('bpCode')}</p>}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className="w-full" />
          {getError('firstName') && <p className="text-sm text-destructive">{getError('firstName')}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className="w-full" />
          {getError('lastName') && <p className="text-sm text-destructive">{getError('lastName')}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john.doe@example.com" className="w-full" />
        {getError('email') && <p className="text-sm text-destructive">{getError('email')}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactNo">Phone Number</Label>
        <Input id="contactNo" 

 name="contactNo" type="tel" value={formData.contactNo} onChange={handleInputChange} placeholder="(123) 456-7890" className="w-full" />
        {getError('contactNo') && <p className="text-sm text-destructive">{getError('contactNo')}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main St, City, State, ZIP" className="w-full" />
        {getError('address') && <p className="text-sm text-destructive">{getError('address')}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name (Optional)</Label>
        <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Company Name" className="w-full" />
        {getError('companyName') && <p className="text-sm text-destructive">{getError('companyName')}</p>}
      </div>
    </div>
  )
}

function LeaseDetailsForm({ 
  formData, 
  handleInputChange,
  handleDateChange,
  properties,
  vacantSpaces,
  errors
}: { 
  formData: FormData; 
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void; 
  handleDateChange: (date: Date | undefined, field: 'leaseStartDate' | 'leaseEndDate') => void;
  properties: Property[];
  vacantSpaces: Space[];
  errors: z.ZodIssue[];
}) {
  const filteredSpaces = vacantSpaces.filter(space => space.propertyId === formData.propertyId)
  const getError = (field: keyof FormData) => errors.find(error => error.path[0] === field)?.message

  const formatCurrency = (amount: number): string => {
    return '₱' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="propertyId">Property</Label>
        <Select 
          name="propertyId" 
          value={formData.propertyId} 
          onValueChange={(value) => handleInputChange({ target: { name: 'propertyId', value } } as any)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a property" />
          </SelectTrigger>
          <SelectContent>
            {properties.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                {property.propertyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {getError('propertyId') && <p className="text-sm text-destructive">{getError('propertyId')}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="spaceId">Space</Label>
        <Select 
          name="spaceId" 
          value={formData.spaceId} 
          onValueChange={(value) => handleInputChange({ target: { name: 'spaceId', value } } as any)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a space" />
          </SelectTrigger>
          <SelectContent>
            {filteredSpaces.map((space) => (
              <SelectItem key={space.id} value={space.id}>
                {space.spaceNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {getError('spaceId') && <p className="text-sm text-destructive">{getError('spaceId')}</p>}
      </div>

      <div className='grid grid-cols-2 gap-6'>
      <div className="space-y-2">
        <Label htmlFor="rent">Monthly Rent Amount</Label>
        <Input 
          id="rent" 
          name="rent" 
          type="text" 
          value={formatCurrency(formData.rent)} 
          readOnly 
          className="w-full bg-muted"
        />
        {getError('rent') && <p className="text-sm text-destructive">{getError('rent')}</p>}
      </div>
        <div className="space-y-2">
          <Label htmlFor="securityDeposit">Security Deposit</Label>
          <Input 
            id="securityDeposit" 
            name="securityDeposit" 
            type="text" 
            value={formatCurrency(formData.securityDeposit)}
            onChange={handleInputChange}
            className="w-full"
          />
          {getError('securityDeposit') && <p className="text-sm text-destructive">{getError('securityDeposit')}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="leaseStartDate">Lease Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!formData.leaseStartDate && "text-muted-foreground"}`}
              >
                {formData.leaseStartDate ? format(new Date(formData.leaseStartDate), "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.leaseStartDate ? new Date(formData.leaseStartDate) : undefined}
                onSelect={(date) => handleDateChange(date, 'leaseStartDate')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {getError('leaseStartDate') && <p className="text-sm text-destructive">{getError('leaseStartDate')}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="leaseEndDate">Lease End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!formData.leaseEndDate && "text-muted-foreground"}`}
              >
                {formData.leaseEndDate ? format(new Date(formData.leaseEndDate), "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.leaseEndDate ? new Date(formData.leaseEndDate) : undefined}
                onSelect={(date) => handleDateChange(date, 'leaseEndDate')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {getError('leaseEndDate') && <p className="text-sm text-destructive">{getError('leaseEndDate')}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="specialConditions">Special Conditions (Optional)</Label>
        <Textarea 
          id="specialConditions" 
          name="specialConditions" 
          value={formData.specialConditions} 
          onChange={handleInputChange}
          placeholder="Enter any special conditions or notes"
          className="w-full h-24"
        />
        {getError('specialConditions') && <p className="text-sm text-destructive">{getError('specialConditions')}</p>}
      </div>
    </div>
  )
}

function ConfirmationStep({ formData }: { formData: FormData }) {
  const formatCurrency = (amount: number): string => {
    return '₱' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card text-card-foreground shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 space-y-6">                
        <div className="space-y-6">
          <Section title="Tenant Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="BP Code" value={formData.bpCode} />
              <InfoItem label="Name" value={`${formData.firstName} ${formData.lastName}`} />
              <InfoItem label="Email" value={formData.email} />
              <InfoItem label="Contact No" value={formData.contactNo} />
              <InfoItem label="Company Name" value={formData.companyName || 'N/A'} />
            </div>
            <InfoItem label="Address" value={formData.address} className="mt-2" />
          </Section>
          
          <Separator className="my-6" />
          
          <Section title="Lease Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Property ID" value={formData.propertyId} />
              <InfoItem label="Space ID" value={formData.spaceId} />
              <InfoItem label="Monthly Rent" value={formatCurrency(formData.rent)} />
              <InfoItem label="Security Deposit" value={formatCurrency(formData.securityDeposit)} />
              <InfoItem label="Utility Deposit" value={formatCurrency(formData.utilityDeposit)} />
              <InfoItem label="Lease Start Date" value={formData.leaseStartDate} />
              <InfoItem label="Lease End Date" value={formData.leaseEndDate} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      {children}
    </div>
  )
}

function InfoItem({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  )
}