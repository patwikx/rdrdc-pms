'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Building2, Edit, LandPlot, Mail, MapPin, Phone, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Space, RPT } from '@/types/type'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { SpaceEditableRPTTable } from './space-rpt-table'
import { Label } from '@/components/ui/label'
import { SpaceUtilityTable } from './space-utility-table'

interface EnhancedSpaceDetailsSheetProps {
  space: Space
}

export const SpaceDetailsSheet: React.FC<EnhancedSpaceDetailsSheetProps> = ({ space }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [rptDetails, setRptDetails] = useState<RPT[]>(space.rpt || [])

  const handleRPTUpdate = (updatedRPT: RPT[]) => {
    setRptDetails(updatedRPT)
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="mt-2 w-full">View Details</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full max-w-full mx-auto mt-[-10px]">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold flex items-center">
              <Building className="mr-2 h-6 w-6 text-primary" />
              Space {space.spaceNumber}
            </DrawerTitle>
            <DrawerDescription>View and edit space details</DrawerDescription>
          </DrawerHeader>

          <div className="flex space-x-4 mt-[-10px]">
            {/* Space Information */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 w-[420px] ml-4">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold flex justify-between items-center">
                  <span>Space Information</span>
                  <Button className="ml-4">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground mb-1">Area</span>
                      <div className="flex items-center">
                        <span className="text-lg font-medium">{space.spaceArea} sq ft</span>
                        <LandPlot className="mt-1 ml-2 h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground mb-1">Status</span>
                      <Badge
                        variant={space.spaceStatus === 'Occupied' ? 'destructive' : 'success'}
                        className="text-md px-3 py-1"
                      >
                        {space.spaceStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Rate</span>
                      <div className="flex items-center">
                        <span className="text-lg font-medium">₱{space.spaceRate?.toLocaleString()}.00</span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Monthly Rent</span>
                      <div className="flex items-center">
                        <span className="text-lg font-medium">₱{space.totalSpaceRent?.toLocaleString()}.00</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-semibold mb-2">Additional Information</h4>
                    <p className="text-sm text-muted-foreground">
                      This {space.spaceArea} sq ft space is ideal for {space.spaceStatus === 'Occupied' ? 'the current tenant' : 'potential tenants'}. 
                      It offers a spacious environment with modern amenities, excellent natural lighting, and a prime location within the property.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tenant Information */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 w-[420px]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Tenant Information</CardTitle>
              </CardHeader>
              <CardContent>
                {space.tenant ? (
                  <div className="space-y-4">
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground">Full Name</p>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {space.tenant.firstName} {space.tenant.lastName}
                        </span>
                      </div>
                    </div>

                    {space.tenant.companyName && (
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-muted-foreground">Company Name</p>
                        <div className="flex items-center">
                          <Building2 className="mr-1 h-4 w-4 text-primary" />
                          <span className="text-sm">{space.tenant.companyName}</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground">Email Address</p>
                      <div className="flex items-center">
                        <Mail className="mr-1 h-4 w-4 text-primary" />
                        <span className="text-sm">{space.tenant.email}</span>
                      </div>
                    </div>

                    {space.tenant.contactNo && (
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-muted-foreground">Contact Number</p>
                        <div className="flex items-center">
                          <Phone className="mr-1 h-4 w-4 text-primary" />
                          <span className="text-sm">{space.tenant.contactNo}</span>
                        </div>
                      </div>
                    )}

                    {space.tenant.address && (
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-muted-foreground">Address</p>
                        <div className="flex items-start">
                          <MapPin className="mr-1 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{space.tenant.address}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No tenant information available for this space.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* RPT Details */}
            <div className="flex-1 flex flex-col space-y-4">
              <div className="flex-1">
                <SpaceUtilityTable
                  spaceId={space.id}
                  rptDetails={rptDetails}
                  onUpdate={handleRPTUpdate}
                />
              </div>
              <div className="flex-1">
                <SpaceEditableRPTTable
                  spaceId={space.id}
                  rptDetails={rptDetails}
                  onUpdate={handleRPTUpdate}
                />
              </div>
            </div>
          </div>

          <DrawerFooter className="mt-2">
            <DrawerClose asChild>
              <Button>Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}