'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Loader } from 'lucide-react'
import axios from 'axios'
import { Space, Property } from '@/types/type'
import { toast } from '@/components/ui/use-toast'

interface AddSpaceModalProps {
  propertyId: string
  onSpaceAdded: (newSpace: Space) => void
  onPropertyUpdate: (updatedProperty: Property) => void
  property: Property
}

export default function AddSpaceModal({ propertyId, onSpaceAdded, onPropertyUpdate, property }: AddSpaceModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [spaceData, setSpaceData] = useState({
    spaceNumber: '',
    spaceArea: '',
    spaceRate: '',
    spaceStatus: '',
    spaceRemarks: ''
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpaceData({ ...spaceData, [e.target.name]: e.target.value })
  }

  const handleStatusChange = (value: string) => {
    setSpaceData({ ...spaceData, spaceStatus: value })
  }

  const calculateOccupancyRate = (spaces: Space[], totalLeasableArea: number): string => {
    const occupiedArea = spaces
      .filter(space => space.spaceStatus === 'Occupied')
      .reduce((sum, space) => sum + parseFloat(space.spaceArea), 0)

    return totalLeasableArea > 0
      ? ((occupiedArea / totalLeasableArea) * 100).toFixed(2)
      : '0.00'
  }

  const calculateTotalRent = (spaces: Space[]): string => {
    const totalRent = spaces.reduce((total: number, space: Space) => {
      return total + (parseFloat(space.spaceRate) * parseFloat(space.spaceArea));
    }, 0);

    return totalRent.toFixed(2);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post<Space>('/api/add-space-property', { ...spaceData, propertyId })
      const newSpace: Space = {
        ...response.data,
        id: response.data.id || '',
        spaceId: response.data.spaceId || '',
        rent: response.data.rent || '',
      }
      onSpaceAdded(newSpace)

      // Update property details
      const updatedProperty = { ...property }
      updatedProperty.space = [...updatedProperty.space, newSpace]
      
      // Recalculate occupancy rate
      const totalLeasableArea = parseFloat(updatedProperty.leasableArea)
      updatedProperty.occupancyRate = calculateOccupancyRate(updatedProperty.space, totalLeasableArea)

      // Recalculate property revenue
      updatedProperty.rent = calculateTotalRent(updatedProperty.space)

      onPropertyUpdate(updatedProperty)

      toast({
        title: "Success",
        description: "Space added and property details updated successfully.",
        variant: "default",
      })
      setIsOpen(false)
      setSpaceData({
        spaceNumber: '',
        spaceArea: '',
        spaceRate: '',
        spaceStatus: '',
        spaceRemarks: ''
      })
    } catch (error) {
      console.error('Error adding new space:', error)
      toast({
        title: "Error",
        description: "Failed to add space and update property details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
          <PlusCircle className="w-5 h-5 mr-2" />Add New Space
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Space</DialogTitle>
        </DialogHeader>
        <AnimatePresence>
          {isOpen && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="spaceNumber">Space Number</Label>
                <Input
                  id="spaceNumber"
                  name="spaceNumber"
                  value={spaceData.spaceNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spaceArea">Space Area (sq ft)</Label>
                <Input
                  id="spaceArea"
                  name="spaceArea"
                  value={spaceData.spaceArea}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spaceRate">Space Rate</Label>
                <Input
                  id="spaceRate"
                  name="spaceRate"
                  value={spaceData.spaceRate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spaceStatus">Space Status</Label>
                <Select onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                    <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="spaceRemarks">Remarks</Label>
                <Input
                  id="spaceRemarks"
                  name="spaceRemarks"
                  value={spaceData.spaceRemarks}
                  onChange={handleInputChange}
                />
              </div>
              <Button
                type="submit"
                className='w-full flex items-center justify-center'
                disabled={loading}
              >
                {loading ? (
                  <Loader className="animate-spin w-5 h-5 mr-2" />
                ) : (
                  'Add Space'
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}