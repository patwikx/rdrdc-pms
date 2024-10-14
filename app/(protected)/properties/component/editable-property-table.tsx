'use client'

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Pencil, Save, Loader, Download, Edit2, Edit } from 'lucide-react'
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
    <Card className="shadow-sm border border-border">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6">
        <CardTitle className="text-lg font-semibold">Property Details</CardTitle>
        {isEditing ? (
          <div className="flex space-x-2">
            <Button onClick={handleSave} disabled={isLoading} size="sm" className="h-8 px-3 text-xs">
              {isLoading ? <Loader className="w-3 h-3 mr-2 animate-spin" /> : <Save className="w-3 h-3 mr-2" />}
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="h-8 px-3 text-xs">
              <X className="w-3 h-3 mr-2" />
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} size="sm" className="h-8 px-3 text-xs">
            <Edit className="w-3 h-3 mr-2" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="py-2 px-4 text-xs font-medium">Registered Owner</TableHead>
                <TableHead className="py-2 px-4 text-xs font-medium">Title No.</TableHead>
                <TableHead className="py-2 px-4 text-xs font-medium">Lot No.</TableHead>
                <TableHead className="py-2 px-4 text-xs font-medium">Property Type</TableHead>
                <TableHead className="py-2 px-4 text-xs font-medium">Leasable Area</TableHead>
                <TableHead className="py-2 px-4 text-xs font-medium">Property Revenue</TableHead>
                <TableHead className="py-2 px-4 text-xs font-medium">Occupancy Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b border-border/50 hover:bg-muted/50">
                <TableCell className="py-2 px-4">
                  {isEditing ? (
                    <Input
                      name="registeredOwner"
                      value={editedProperty.registeredOwner}
                      onChange={handleInputChange}
                      className="w-full h-8 text-sm"
                    />
                  ) : (
                    <span className="text-sm">{editedProperty.registeredOwner}</span>
                  )}
                </TableCell>
                <TableCell className="py-2 px-4">
                  {isEditing ? (
                    <Input
                      name="titleNo"
                      value={editedProperty.titleNo}
                      onChange={handleInputChange}
                      className="w-full h-8 text-sm"
                    />
                  ) : (
                    <span className="text-sm">{editedProperty.titleNo}</span>
                  )}
                </TableCell>
                <TableCell className="py-2 px-4">
                  {isEditing ? (
                    <Input
                      name="lotNo"
                      value={editedProperty.lotNo}
                      onChange={handleInputChange}
                      className="w-full h-8 text-sm"
                    />
                  ) : (
                    <span className="text-sm">{editedProperty.lotNo}</span>
                  )}
                </TableCell>
                <TableCell className="py-2 px-4">
                  {isEditing ? (
                    <Select onValueChange={handleSelectChange} value={editedProperty.propertyType}>
                      <SelectTrigger className="w-full h-8 text-sm">
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
                    <span className="text-sm">{editedProperty.propertyType}</span>
                  )}
                </TableCell>
                <TableCell className="py-2 px-4">
                  {isEditing ? (
                    <Input
                      name="leasableArea"
                      value={editedProperty.leasableArea}
                      onChange={handleInputChange}
                      className="w-full h-8 text-sm"
                    />
                  ) : (
                    <span className="text-sm">{editedProperty.leasableArea}</span>
                  )}
                </TableCell>
                <TableCell className="py-2 px-4">
                  <Label className="text-sm font-medium">{formatCurrency(totalSpaceRent)}</Label>
                </TableCell>
                <TableCell className="py-2 px-4">
                  <Label className="text-sm font-bold">{editedProperty.occupancyRate}%</Label>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}