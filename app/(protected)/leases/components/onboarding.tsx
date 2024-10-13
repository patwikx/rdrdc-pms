'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

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

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  address: string;
  propertyId: string;
  spaceId: string;
  rent: string;
  leaseStartDate: string;
  leaseEndDate: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  contactNo: '',
  address: '',
  propertyId: '',
  spaceId: '',
  rent: '',
  leaseStartDate: '',
  leaseEndDate: '',
}

const steps = [
  { title: 'Personal Information', component: PersonalInformationForm },
  { title: 'Lease Details', component: LeaseDetailsForm },
  { title: 'Confirmation', component: ConfirmationStep },
]

export default function TenantOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [properties, setProperties] = useState<Property[]>([])
  const [vacantSpaces, setVacantSpaces] = useState<Space[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // If the changed field is spaceId, update the rent
    if (name === 'spaceId') {
      const selectedSpace = vacantSpaces.find(space => space.id === value)
      if (selectedSpace) {
        setFormData(prev => ({ ...prev, rent: selectedSpace.totalSpaceRent }))
      }
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/onboard-tenant', formData)
      console.log('Tenant onboarded successfully:', response.data)
      // Handle success (e.g., show a success message, reset form, close dialog)
    } catch (error) {
      console.error('Error onboarding tenant:', error)
      // Handle error (e.g., show error message)
    }
  }

  const CurrentComponent = steps[currentStep].component

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex">
      <div className="flex-1 p-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Tenant</Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>Step {currentStep + 1} of {steps.length}</CardDescription>
              <Separator />
            </CardHeader>

            <CardContent>
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
                />
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                Previous
              </Button>
              <Button onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}>
                {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </CardFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function PersonalInformationForm({ formData, handleInputChange }: { formData: FormData; handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john.doe@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactNo">Phone Number</Label>
        <Input id="contactNo" name="contactNo" type="tel" value={formData.contactNo} onChange={handleInputChange} placeholder="(123) 456-7890" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main St, City, State, ZIP" />
      </div>
    </div>
  )
}

function LeaseDetailsForm({ 
  formData, 
  handleInputChange, 
  properties, 
  vacantSpaces 
}: { 
  formData: FormData; 
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; 
  properties: Property[];
  vacantSpaces: Space[];
}) {
  const filteredSpaces = vacantSpaces.filter(space => space.propertyId === formData.propertyId)

  const formatCurrency = (amount: string | number): string => {
    const number = parseFloat(String(amount));
    if (isNaN(number)) return '₱0.00'; // Return a default value if the input is invalid
  
    return '₱' + number.toLocaleString('en-US', {
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
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="leaseStartDate">Lease Start Date</Label>
          <Input id="leaseStartDate" name="leaseStartDate" type="date" value={formData.leaseStartDate} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="leaseEndDate">Lease End Date</Label>
          <Input id="leaseEndDate" name="leaseEndDate" type="date" value={formData.leaseEndDate} onChange={handleInputChange} />
        </div>
      </div>
    </div>
  )
}

function ConfirmationStep({ formData }: { formData: FormData }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Confirm Your Details</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Contact No:</strong> {formData.contactNo}</p>
        <p><strong>Address:</strong> {formData.address}</p>
        <p><strong>Property ID:</strong> {formData.propertyId}</p>
        <p><strong>Space ID:</strong> {formData.spaceId}</p>
        <p><strong>Rent:</strong> {formData.rent}</p>
        <p><strong>Lease Start Date:</strong> {formData.leaseStartDate}</p>
        <p><strong>Lease End Date:</strong> {formData.leaseEndDate}</p>
      </div>
    </div>
  )
}