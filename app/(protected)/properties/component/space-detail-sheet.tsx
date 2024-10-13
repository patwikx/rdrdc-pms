'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Building, LandPlot, AlertTriangle, Users, FileText, DollarSign, XCircle, CheckCircle2, Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Space } from '@/types/type'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export const revalidate = 0

interface SpaceDetailsSheetProps {
  space: Space
}

// ... (imports remain unchanged)

export const SpaceDetailsSheet: React.FC<SpaceDetailsSheetProps> = ({ space }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="mt-2 w-full">View Details</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-3xl font-bold flex items-center">
            <Building className="mr-2 h-8 w-8 text-primary" />
            Space {space.spaceNumber}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {/* Space Information Card */}
            <motion.div variants={cardVariants}>
              <Card className="mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold flex justify-between items-center">
                    <span>Space Information</span>
                    <Button className="ml-4"><Edit className='w-4 h-4 mr-4' />Edit</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground mb-1">Area</span>
                        <div className="flex">
                          <LandPlot className="mr-2 h-5 w-5 text-primary" />
                          <span className="text-lg font-medium">{space.spaceArea} sq ft</span>
                        </div>
                      </div>
                      <div className="flex flex-col mr-36">
                        <span className="text-sm text-muted-foreground mb-1">Status</span>
                        <Badge
                          variant={space.spaceStatus === 'Occupied' ? 'destructive' : 'success'}
                          className="text-md px-3 py-1"
                        >
                          {space.spaceStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Rate</span>
                        <div className="flex items-center">
                          <span className="text-lg font-medium">₱{space.spaceRate.toLocaleString()}.00</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Monthly Rent</span>
                        <div className="flex items-center">
                          <span className="text-lg font-medium">₱{space.totalSpaceRent.toLocaleString()}.00</span>
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
            </motion.div>

            <Separator className="my-6" />

            {/* RPT Details Card */}
            <motion.div variants={cardVariants}>
              <Card className="mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                <CardTitle className="text-2xl font-semibold flex justify-between items-center">
                    <span>RPT Details</span>
                    <Button className="ml-4"><Edit className='w-4 h-4 mr-4' />Edit</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {space.rpt && space.rpt.length > 0 ? (
                    space.rpt.map((rptDetail, index) => (
                      <React.Fragment key={rptDetail.id || index}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold">Tax Dec No: {rptDetail.TaxDecNo}</h4>
                            <Badge variant={rptDetail.Status === 'Paid' ? 'success' : 'destructive'} className="text-md px-3 py-1">
                              {rptDetail.Status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center">
                              <span>Due: {rptDetail.DueDate}</span>
                            </div>
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-primary" />
                              <span>Mode: {rptDetail.PaymentMode}</span>
                            </div>
                          </div>
                          {rptDetail.custodianRemarks && (
                            <div className="flex items-start bg-muted p-3 rounded-md">
                              <AlertTriangle className="mr-2 h-5 w-5 text-warning flex-shrink-0 mt-1" />
                              <p className="text-sm">{rptDetail.custodianRemarks}</p>
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No RPT details available for this space.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Amenities Card */}
            <motion.div variants={cardVariants}>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "Air Conditioning", available: true },
                      { name: "High-Speed Internet", available: true },
                      { name: "24/7 Security", available: true },
                      { name: "Parking Space", available: false },
                      { name: "Meeting Rooms", available: true },
                      { name: "CCTV Cameras Available", available: false },
                    ].map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        {amenity.available ? (
                          <CheckCircle2 className="mr-2 h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                        )}
                        <span className={amenity.available ? "text-foreground" : "text-muted-foreground"}>
                          {amenity.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
