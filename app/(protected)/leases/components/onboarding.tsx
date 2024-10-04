'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

const steps = [
    { title: 'Personal Information', component: PersonalInformationForm },
    { title: 'Lease Details', component: LeaseDetailsForm },
    { title: 'Payment Information', component: PaymentInformationForm },
    { title: 'Additional Information', component: AdditionalInformationForm },
    { title: 'Confirmation', component: ConfirmationStep },
  ]
  
  export default function TenantOnboarding() {
    const [currentStep, setCurrentStep] = useState(0)
  
    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))
  
    const CurrentComponent = steps[currentStep].component

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
              <CurrentComponent />
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              Previous
            </Button>
            <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
              {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </CardFooter>
           </DialogContent>
           </Dialog>
      </div>
    </div>
  )
}


function PersonalInformationForm() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="John" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Doe" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="john.doe@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" type="tel" placeholder="(123) 456-7890" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth</Label>
        <Input id="dob" type="date" />
      </div>
    </div>
  )
}

function LeaseDetailsForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="propertyAddress">Property Address</Label>
        <Input id="propertyAddress" placeholder="123 Main St, City, State, ZIP" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="leaseStart">Lease Start Date</Label>
          <Input id="leaseStart" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="leaseEnd">Lease End Date</Label>
          <Input id="leaseEnd" type="date" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rentAmount">Monthly Rent Amount</Label>
        <Input id="rentAmount" type="number" placeholder="1000" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="securityDeposit">Security Deposit</Label>
        <Input id="securityDeposit" type="number" placeholder="1000" />
      </div>
    </div>
  )
}

function PaymentInformationForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Preferred Payment Method</Label>
        <RadioGroup defaultValue="card">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card">Credit/Debit Card</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bank" id="bank" />
            <Label htmlFor="bank">Bank Transfer</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input id="expiryDate" placeholder="MM/YY" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input id="cvv" placeholder="123" />
        </div>
      </div>
    </div>
  )
}

function AdditionalInformationForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="emergencyContact">Emergency Contact</Label>
        <Input id="emergencyContact" placeholder="Name and phone number" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pets">Do you have any pets?</Label>
        <Select>
          <SelectTrigger id="pets">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="dog">Dog</SelectItem>
            <SelectItem value="cat">Cat</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="specialRequests">Special Requests or Notes</Label>
        <Textarea id="specialRequests" placeholder="Any additional information..." />
      </div>
    </div>
  )
}

function ConfirmationStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Confirmation</h2>
      <p>Thank you for completing the onboarding process! Your information has been submitted successfully.</p>
      <Button variant="outline" onClick={() => alert('Redirect to homepage or next action')}>Go to Dashboard</Button>
    </div>
  )
}
