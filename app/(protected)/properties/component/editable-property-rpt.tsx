'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, X, Pencil, Save, Loader } from 'lucide-react'
import axios from 'axios'
import { Badge } from '@/components/ui/badge'
import { RPT } from '@/types/type'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from '@/components/ui/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"

interface EditableRPTTableProps {
    propertyId: string | number;
    rptDetails: RPT[];
    onUpdate: (updatedRPT: RPT[]) => void;
}

export const EditableRPTTable: React.FC<EditableRPTTableProps> = ({ propertyId, rptDetails, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedRPT, setEditedRPT] = useState<RPT[]>(rptDetails);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedRPTs, setSelectedRPTs] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;
        const updatedRPT = [...editedRPT];
        updatedRPT[index] = { ...updatedRPT[index], [name]: value };
        setEditedRPT(updatedRPT);
    };

    const handleSelectChange = (value: string, index: number, field: 'Status' | 'PaymentMode') => {
        const updatedRPT = [...editedRPT];
        updatedRPT[index] = { ...updatedRPT[index], [field]: value };
        setEditedRPT(updatedRPT);
    };

    const handleDateChange = (date: Date | undefined, index: number) => {
      const updatedRPT = [...editedRPT];
      updatedRPT[index] = { ...updatedRPT[index], DueDate: date ? format(date, "yyyy-MM-dd") : '' };
      setEditedRPT(updatedRPT);
  };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updatedRPTs = await Promise.all(
                editedRPT.map(rpt => {
                    const payload = {
                        ...rpt,
                        propertyId: propertyId.toString()
                    };
                    if (rpt.id) {
                        return axios.put(`/api/update-rpt-property/${rpt.id}`, payload);
                    } else {
                        return axios.post('/api/create-rpt-property', payload);
                    }
                })
            );
            const newRPTData = updatedRPTs.map(response => response.data);
            onUpdate(newRPTData);
            setIsEditing(false);
            setIsAdding(false);
            setSelectedRPTs([]);
            toast({
                title: "Success",
                description: "RPT details updated successfully",
                variant: "default",
            });
        } catch (error) {
            console.error('Error updating RPT details:', error);
            toast({
                title: "Error",
                description: "Failed to update RPT details",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddRPT = () => {
        setIsAdding(true);
        setIsEditing(true);

        const newRPT = {
            id: null,
            TaxDecNo: '',
            PaymentMode: '',
            DueDate: '',
            Status: '',
            custodianRemarks: '',
            propertyId: propertyId.toString()
        };

        setEditedRPT([...editedRPT, newRPT]);
    };

    const handleCheckboxChange = (rptId: string) => {
        setSelectedRPTs(prev => 
            prev.includes(rptId) ? prev.filter(id => id !== rptId) : [...prev, rptId]
        );
    };

    return (
        <Card className="mt-4 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">RPT Details</CardTitle>
                {isEditing || isAdding ? (
                    <div>
                        <Button onClick={handleSave} className="mr-2" disabled={isLoading}>
                            {isLoading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save
                        </Button>
                        <Button onClick={() => {
                            setIsEditing(false);
                            setIsAdding(false);
                            setEditedRPT(rptDetails);
                            setSelectedRPTs([]);
                        }} variant="outline" disabled={isLoading}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Button onClick={() => setIsEditing(true)} className="mr-2" disabled={isLoading || editedRPT.length === 0 || selectedRPTs.length === 0}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button onClick={handleAddRPT} variant="outline" disabled={isLoading}>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add RPT
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {editedRPT.length > 0 || isAdding ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {!isAdding && <TableHead className='text-center items-center font-bold'>Select</TableHead>}
                                <TableHead className='text-center items-center font-bold'>Tax Dec No</TableHead>
                                <TableHead className='text-center items-center font-bold'>Payment Mode</TableHead>
                                <TableHead className='text-center items-center font-bold'>Due Date</TableHead>
                                <TableHead className='text-center items-center font-bold'>Custodian Remarks</TableHead>
                                <TableHead className='text-center items-center font-bold'>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {editedRPT.map((rpt, index) => (
                                (!isEditing || selectedRPTs.includes(rpt.id?.toString() || '') || (isAdding && index === editedRPT.length - 1)) && (
                                    <TableRow key={rpt.id || `new-${index}`}>
                                        {!isAdding && (
                                            <TableCell className='text-center'>
                                                <Checkbox
                                                    checked={selectedRPTs.includes(rpt.id?.toString() || '')}
                                                    onCheckedChange={() => rpt.id && handleCheckboxChange(rpt.id.toString())}
                                                    disabled={isEditing}
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell className='text-center'>
                                            {(isEditing && (selectedRPTs.includes(rpt.id?.toString() || '') || (isAdding && index === editedRPT.length - 1))) ? (
                                                <Input
                                                    name="TaxDecNo"
                                                    value={rpt.TaxDecNo}
                                                    onChange={(e) => handleInputChange(e, index)}
                                                />
                                            ) : (
                                                rpt.TaxDecNo
                                            )}
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            {(isEditing && (selectedRPTs.includes(rpt.id?.toString() || '') || (isAdding && index === editedRPT.length - 1))) ? (
                                                <Select onValueChange={(value) => handleSelectChange(value, index, 'PaymentMode')} value={rpt.PaymentMode.toString()}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={rpt.PaymentMode} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                                                            <SelectItem value="Annual">Annual</SelectItem>
                                                            <SelectItem value="Monthly">Monthly</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                rpt.PaymentMode
                                            )}
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            {(isEditing && (selectedRPTs.includes(rpt.id?.toString() || '') || (isAdding && index === editedRPT.length - 1))) ? (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant={"outline"} className="w-full">
                                                            {rpt.DueDate ? format(new Date(rpt.DueDate), "PPP") : "Pick a date"}
                                                            <span className="ml-2">📅</span>
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        <Calendar 
                                                            selected={rpt.DueDate ? new Date(rpt.DueDate) : undefined}
                                                            onSelect={(date) => handleDateChange(date, index)}
                                                            mode='single'
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            ) : (
                                                rpt.DueDate
                                            )}
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            {(isEditing && (selectedRPTs.includes(rpt.id?.toString() || '') || (isAdding && index === editedRPT.length - 1))) ? (
                                                <Input
                                                    name="custodianRemarks"
                                                    value={rpt.custodianRemarks}
                                                    onChange={(e) => handleInputChange(e, index)}
                                                />
                                            ) : (
                                                rpt.custodianRemarks
                                            )}
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            {(isEditing && (selectedRPTs.includes(rpt.id?.toString() || '') || (isAdding && index === editedRPT.length - 1))) ? (
                                                <Select onValueChange={(value) => handleSelectChange(value, index, 'Status')} value={rpt.Status.toString()}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={rpt.Status} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value="Unpaid">Unpaid</SelectItem>
                                                            <SelectItem value="Paid">Paid</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Badge 
                                                className="text-md px-3 py-1"
                                                variant={
                                                  rpt.Status === 'Unpaid' 
                                                    ? 'destructive' 
                                                    : rpt.Status === 'Paid' 
                                                    ? 'success' // Assuming you want a different variant for Pending
                                                    : 'success' // For Paid or other statuses
                                                }
                                              >
                                                {rpt.Status}
                                              </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-gray-500">No RPT details available.</div>
                )}
            </CardContent>
        </Card>
    );
};
