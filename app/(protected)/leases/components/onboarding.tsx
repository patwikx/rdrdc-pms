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
import { AlertCircle, CheckCircle2 } from 'lucide-react'

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
})

type FormData = z.infer<typeof formSchema>

const initialFormData: FormData = {
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
}

const steps = [
  { title: 'Personal Information', component: PersonalInformationForm },
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
    const currentStepData = steps[currentStep].component === PersonalInformationForm
      ? {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'rent' ? parseFloat(value) || 0 : value }))
    setErrors(prev => prev.filter(error => error.path[0] !== name))

    if (name === 'spaceId') {
      const selectedSpace = vacantSpaces.find(space => space.id === value)
      if (selectedSpace) {
        setFormData(prev => ({ ...prev, rent: parseFloat(selectedSpace.totalSpaceRent) || 0 }))
      }
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const validatedData = formSchema.parse(formData)
      const response = await axios.post('/api/onboard-tenant', {
        ...validatedData,
        leaseStart: validatedData.leaseStartDate,
        leaseEnd: validatedData.leaseEndDate,
      })
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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex">
      <div className="flex-1 p-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Tenant</Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>Step {currentStep + 1} of {steps.length}</CardDescription>
              <Separator />
            </CardHeader>

            <CardContent className='mt-[-20px]'>
              {errors.length > 0 && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <h3 className="text-sm font-medium text-red-800">Please correct the following errors:</h3>
                  </div>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full"
              >
                <CurrentComponent 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                  properties={properties}
                  vacantSpaces={vacantSpaces}
                  errors={errors}
                />
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                Previous
              </Button>
              <Button 
                onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                disabled={isSubmitting}
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

function PersonalInformationForm({ formData, handleInputChange, errors }: { formData: FormData; handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; errors: z.ZodIssue[] }) {
  const getError = (field: keyof FormData) => errors.find(error => error.path[0] === field)?.message

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
          {getError('firstName') && <p className="text-sm text-red-500">{getError('firstName')}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
          {getError('lastName') && <p className="text-sm text-red-500">{getError('lastName')}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john.doe@example.com" />
        {getError('email') && <p className="text-sm text-red-500">{getError('email')}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactNo">Phone Number</Label>
        <Input id="contactNo" name="contactNo" type="tel" value={formData.contactNo} onChange={handleInputChange} placeholder="(123) 456-7890" />
        {getError('contactNo') && <p className="text-sm text-red-500">{getError('contactNo')}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main St, City, State, ZIP" />
        {getError('address') && <p className="text-sm text-red-500">{getError('address')}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name (Optional)</Label>
        <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Company Name" />
        {getError('companyName') && <p className="text-sm text-red-500">{getError('companyName')}</p>}
      </div>
    </div>
  )
}

function LeaseDetailsForm({ 
  formData, 
  handleInputChange, 
  properties, 
  vacantSpaces,
  errors
}: { 
  formData: FormData; 
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; 
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="propertyId">Property</Label>
        <Select 
          name="propertyId" 
          value={formData.propertyId} 
          onValueChange={(value) => handleInputChange({ target: { name: 'propertyId', value } } as any)}
        >
          <SelectTrigger>
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
        
        {getError('propertyId') && <p className="text-sm  text-red-500">{getError('propertyId')}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="spaceId">Space</Label>
        <Select 
          name="spaceId" 
          value={formData.spaceId} 
          onValueChange={(value) => handleInputChange({ target: { name: 'spaceId', value } } as any)}
        >
          <SelectTrigger>
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
        {getError('spaceId') && <p className="text-sm text-red-500">{getError('spaceId')}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="rent">Monthly Rent Amount</Label>
        <Input 
          id="rent" 
          name="rent" 
          type="text" 
          value={formatCurrency(formData.rent)} 
          readOnly 
          className="bg-gray-100"
        />
        {getError('rent') && <p className="text-sm text-red-500">{getError('rent')}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="leaseStartDate">Lease Start Date</Label>
          <Input id="leaseStartDate" name="leaseStartDate" type="date" value={formData.leaseStartDate} onChange={handleInputChange} />
          {getError('leaseStartDate') && <p className="text-sm text-red-500">{getError('leaseStartDate')}</p>}
        </div>
        <div className="space-y-2">
          <Label  htmlFor="leaseEndDate">Lease End Date</Label>
          <Input id="leaseEndDate" name="leaseEndDate" type="date" value={formData.leaseEndDate} onChange={handleInputChange} />
          {getError('leaseEndDate') && <p className="text-sm text-red-500">{getError('leaseEndDate')}</p>}
        </div>
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
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">Confirm Your Details</h2>
          </div>
          <p className="text-sm text-gray-500">
            Please review the information below before submitting.
          </p>
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-6">
          <Section title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <InfoItem label="Rent" value={formatCurrency(formData.rent)} />
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
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  )
}

function InfoItem({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  )
}