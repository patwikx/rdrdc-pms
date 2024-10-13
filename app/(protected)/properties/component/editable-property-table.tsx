'use client'

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Pencil, Save, Loader, Download } from 'lucide-react'
import { Property, Space } from '@/types/type'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'

export const revalidate = 0;

interface EditablePropertyTableProps {
  property: Property
  onUpdate: (updatedProperty: Property) => Promise<void>
  onSpaceAdded: (newSpace: Space) => void
}

// Moved formatCurrency function above calculateTotalRent
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const calculateOccupancyRate = (spaces: Space[], totalLeasableArea: number): string => {
  const occupiedArea = spaces
    .filter(space => space.spaceStatus === 'Occupied')
    .reduce((sum, space) => sum + parseFloat(space.spaceArea), 0)

  return totalLeasableArea > 0
    ? ((occupiedArea / totalLeasableArea) * 100).toFixed(2)
    : '0.00'
}

// New function to calculate totalSpaceRent
const calculateTotalSpaceRent = (spaces: Space[]): number => {
  return spaces.reduce((total, space) => total + space.totalSpaceRent, 0);
}

export const EditablePropertyTable: React.FC<EditablePropertyTableProps> = ({ property, onUpdate, onSpaceAdded }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProperty, setEditedProperty] = useState(property)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setEditedProperty(property)
    const occupancyRate = calculateOccupancyRate(property.space, parseFloat(property.leasableArea))
    setEditedProperty(prev => ({
      ...prev,
      occupancyRate,
    }))
  }, [property])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedProperty(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setEditedProperty(prev => ({ ...prev, propertyType: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onUpdate(editedProperty)
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Property details updated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating property:', error)
      toast({
        title: "Error",
        description: "Failed to update property details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
  }

  const totalSpaceRent = calculateTotalSpaceRent(property.space);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold justify-between">Property Details</CardTitle>
        {isEditing ? (
          <div>
            <Button onClick={handleSave} className="mr-2" disabled={isLoading}>
              {isLoading ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="w-4 h-4 mr-2" size='sm' />
            Edit
          </Button>
        )}
        <Button><Download className='h-4 w-6 mr-2' size='sm' />Export</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center items-center'>Registered Owner</TableHead>
              <TableHead className='text-center items-center'>Title No.</TableHead>
              <TableHead className='text-center items-center'>Lot No.</TableHead>
              <TableHead className='text-center items-center'>Property Type</TableHead>
              <TableHead className='text-center items-center'>Leasable Area</TableHead>
              <TableHead className='text-center items-center'>Property Revenue</TableHead>
              <TableHead className='text-center items-center'>Occupancy Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='text-center items-center'>
                {isEditing ? (
                  <Input
                    name="registeredOwner"
                    value={editedProperty.registeredOwner}
                    onChange={handleInputChange}
                  />
                ) : (
                  editedProperty.registeredOwner
                )}
              </TableCell>
              <TableCell className='text-center items-center'>
                {isEditing ? (
                  <Input
                    name="titleNo"
                    value={editedProperty.titleNo}
                    onChange={handleInputChange}
                  />
                ) : (
                  editedProperty.titleNo
                )}
              </TableCell>
              <TableCell className='text-center items-center'>
                {isEditing ? (
                  <Input
                    name="lotNo"
                    value={editedProperty.lotNo}
                    onChange={handleInputChange}
                  />
                ) : (
                  editedProperty.lotNo
                )}
              </TableCell>
              <TableCell className='text-center items-center'>
                {isEditing ? (
                  <Select onValueChange={handleSelectChange} value={editedProperty.propertyType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={editedProperty.propertyType || "Select Property Type"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  editedProperty.propertyType
                )}
              </TableCell>
              <TableCell className='text-center items-center'>
                {isEditing ? (
                  <Input
                    name="leasableArea"
                    value={editedProperty.leasableArea}
                    onChange={handleInputChange}
                  />
                ) : (
                  editedProperty.leasableArea
                )}
              </TableCell>
              <TableCell className='text-center items-center'>
                <Label>{formatCurrency(totalSpaceRent)}</Label>
              </TableCell>
              <TableCell className='text-center items-center'>
                <Label className='font-bold text-lg'>{editedProperty.occupancyRate}%</Label>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
