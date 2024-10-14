'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, X, Pencil, Save, Loader, CalendarIcon, Edit3, Edit } from 'lucide-react'
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
    spaceId: string | number;
    rptDetails: RPT[];
    onUpdate: (updatedRPT: RPT[]) => void;
}

export const SpaceEditableRPTTable: React.FC<EditableRPTTableProps> = ({ spaceId, rptDetails, onUpdate }) => {
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
      updatedRPT[index] = { ...updatedRPT[index], DueDate: date ? format(date, "MM-dd-yyyy") : '' };
      setEditedRPT(updatedRPT);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updatedRPTs = await Promise.all(
                editedRPT.map(rpt => {
                    const payload = {
                        ...rpt,
                        spaceId: spaceId.toString()
                    };
                    if (rpt.id) {
                        return axios.put(`/api/update-rpt-space/${rpt.id}`, payload);
                    } else {
                        return axios.post('/api/create-rpt-space', payload);
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
            spaceId: spaceId.toString()
        };

        setEditedRPT([...editedRPT, newRPT]);
    };

    const handleCheckboxChange = (rptId: string) => {
        setSelectedRPTs(prev => 
            prev.includes(rptId) ? prev.filter(id => id !== rptId) : [...prev, rptId]
        );
    };

    return (
        <Card className="shadow-sm border border-border mr-4">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6">
                <CardTitle className="text-lg font-semibold">RPT Details</CardTitle>
                <div className="flex space-x-2">
                    {isEditing || isAdding ? (
                        <>
                            <Button onClick={handleSave} disabled={isLoading} size="sm" className="h-8 px-3 text-xs">
                                {isLoading ? <Loader className="w-3 h-3 mr-2 animate-spin" /> : <Save className="w-3 h-3 mr-2" />}
                                Save
                            </Button>
                            <Button onClick={() => {
                                setIsEditing(false);
                                setIsAdding(false);
                                setEditedRPT(rptDetails);
                                setSelectedRPTs([]);
                            }} variant="outline" disabled={isLoading} size="sm" className="h-8 px-3 text-xs">
                                <X className="w-3 h-3 mr-2" />
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setIsEditing(true)} disabled={isLoading || editedRPT.length === 0 || selectedRPTs.length === 0} size="sm" className="h-8 px-3 text-xs">
                                <Edit className="w-3 h-3 mr-2" />
                                Edit
                            </Button>
                            <Button onClick={handleAddRPT} variant="outline" disabled={isLoading} size="sm" className="h-8 px-3 text-xs">
                                <PlusCircle className="w-3 h-3 mr-2" />
                                Add RPT
                            </Button>
                        </>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {editedRPT.length > 0 || isAdding ? (
                    <div className="overflow-x-auto">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    {!isAdding && !isEditing && <TableHead className="w-[50px] py-2 px-4 text-xs font-medium">Select</TableHead>}
                                    <TableHead className="py-2 px-4 text-xs font-medium">Tax Dec No</TableHead>
                                    <TableHead className="py-2 px-4 text-xs font-medium">Payment Mode</TableHead>
                                    <TableHead className="py-2 px-4 text-xs font-medium">Due Date</TableHead>
                                    <TableHead className="py-2 px-4 text-xs font-medium">Custodian Remarks</TableHead>
                                    <TableHead className="py-2 px-4 text-xs font-medium">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {editedRPT.map((rpt, index) => (
                                    (!isEditing || selectedRPTs.includes(rpt.id?.toString() || '') || (isAdding && index === editedRPT.length - 1)) && (
                                        <TableRow key={rpt.id || `new-${index}`} className="border-b border-border/50 hover:bg-muted/50">
                                            {!isAdding && !isEditing && (
                                                <TableCell className="py-2 px-4">
                                                    <Checkbox
                                                        checked={selectedRPTs.includes(rpt.id?.toString() || '')}
                                                        onCheckedChange={() => rpt.id && handleCheckboxChange(rpt.id.toString())}
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell className="py-2 px-4">
                                                {(isEditing && (selectedRPTs.includes(rpt.id?.toString() || '') || (isAdding && index === editedRPT.length - 1))) ? (
                                                    <Input
                                                        name="TaxDecNo"
                                                        value={rpt.TaxDecNo}
                                                        onChange={(e) => handleInputChange(e, index)}
                                                        className="w-full h-8 text-sm"
                                                    />
                                                ) : (
                                                    <span className="text-sm">{rpt.TaxDecNo}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-2 px-4">
                                                {(isEditing && (selectedRPTs.includes(rpt.id?.toString() || '') || (isAdding && index === editedRPT.length - 1))) ? (
                                                    <Select onValueChange={(value) => handleSelectChange(value, index, 'PaymentMode')} value={rpt.PaymentMode?.toString() || ''}>
                                                        <SelectTrigger className="w-full h-8 text-sm">
                                                            <SelectValue placeholder={rpt.PaymentMode || 'Select'} />
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
                                                    <span className="text-sm">{rpt.PaymentMode}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-2 px-4">
                                                {(isEditing && (selectedRPTs.includes(rpt.id?.toString() || '') || (isAdding && index === editedRPT.length - 1))) ? (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline" className="w-full h-8 justify-start text-left text-sm font-normal">
                                                                {rpt.DueDate ? format(new Date(rpt.DueDate), "PPP") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={rpt.DueDate ? new Date(rpt.DueDate) : undefined}
                                                                onSelect={(date) => handleDateChange(date, index)}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                ) : (
                                                    <span className="text-sm">{rpt.DueDate}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-2 px-4">
                                                {(isEditing && (selectedRPTs.includes(rpt.id?.toString() || '') || (isAdding && index === editedRPT.length - 1))) ? (
                                                    <Input
                                                        name="custodianRemarks"
                                                        value={rpt.custodianRemarks}
                                                        onChange={(e) => handleInputChange(e, index)}
                                                        className="w-full h-8 text-sm"
                                                    />
                                                ) : (
                                                    <span className="text-sm">{rpt.custodianRemarks}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-2 px-4">
                                                {(isEditing && (selectedRPTs.includes(rpt.id?.toString() || '') || (isAdding && index === editedRPT.length - 1))) ? (
                                                    <Select onValueChange={(value) => handleSelectChange(value, index, 'Status')} value={rpt.Status?.toString() || ''}>
                                                        <SelectTrigger className="w-full h-8 text-sm">
                                                            <SelectValue placeholder={rpt.Status || 'Select'} />
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
                                                    className="text-xs px-2 py-0.5"
                                                    variant={
                                                      rpt.Status === 'Unpaid' 
                                                        ? 'destructive' 
                                                        : rpt.Status === 'Paid' 
                                                        ? 'success'
                                                        : 'default'
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
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">No RPT details available.</div>
                )}
            </CardContent>
        </Card>
    );
};