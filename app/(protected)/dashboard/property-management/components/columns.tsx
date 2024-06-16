"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Row } from "@tanstack/react-table";
import { useEffect, useState, useTransition } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EyeIcon, FileText, History, MoreHorizontal, PenIcon, Trash, UserCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Properties } from "../data/schema";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { UpdatePropertySchema, UpdateRPTSchema } from "@/schemas";
import { UpdateProperty, UpdateRPT } from "@/actions/queries";


type Custodiansx = {
  id: string;
  firstName: string;
  lastName: string;
};

type Companiesx = {
  id: string;
  companyName: string;
}

type RowData = Row<Properties>;

const CellComponent = ({ row }: { row: RowData }) => {
  const leaves = row.original;
  const [isRPTModalOpen, setIsRPTModalOpen] = useState(false);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<Properties | null>(null);


  const handleOpenRPTModal = () => {
    setSelectedProperties(leaves);
    setIsRPTModalOpen(true);
  };

  const handleOpenPropertyModal = () => {
    setSelectedProperties(leaves);
    setIsPropertyModalOpen(true);
  };

  const handleCloseRPTModal = () => {
    setSelectedProperties(null);
    setIsRPTModalOpen(false);
  };

  const handleClosePropertyModal = () => {
    setSelectedProperties(null);
    setIsPropertyModalOpen(false);
  };

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  const form = useForm<z.infer<typeof UpdateRPTSchema>>({
    resolver: zodResolver(UpdateRPTSchema),
    defaultValues: {
      Status: undefined,
      custodianRemarks: "",
      TaxDecNo: "",
      DueDate: "",
      PaymentMode: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof UpdateRPTSchema>) => {
    setError("");
    setSuccess("");

    // Check if selectedProperties is not null and selectedProperties.id is a string
    if (selectedProperties?.id) {
      startTransition(() => {
        UpdateRPT({ ...values, id: selectedProperties.id }) // Include the leave ID in the request
          .then((data) => {
            setError(data.error);
            toast.success("RPT details updated successfully.");

            if (!data.error) {
              form.reset();
              handleCloseRPTModal();
            }
          })
          .finally(() => {
            setTimeout(() => {
              setError(undefined);
              setSuccess(undefined);
            }, 5000);
          });
      });
    }
  };

  const [custodians, setCustodians] = useState<Custodiansx[]>([]);
  const [companies, setCompanies] = useState<Companiesx[]>([]);

  useEffect(() => {
    fetch('/api/fetch-custodian')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setCustodians(data.custodians))
      .catch(() =>
        toast.error('An error occurred while fetching approvers. Please try again.')
      );
  }, []);

  useEffect(() => {
    fetch('/api/fetch-company')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setCompanies(data.companies))
      .catch(() =>
        toast.error('An error occurred while fetching approvers. Please try again.')
      );
  }, []);

  const formProperty = useForm<z.infer<typeof UpdatePropertySchema>>({
    resolver: zodResolver(UpdatePropertySchema),
    defaultValues: {
      propertyCode: '',
      propertyName: '',
      titleNo: '',
      lotNo: '',
      registeredOwner: '',
      address: '',
      city: '',
      province: '',
      custodianId: '',
      companyId: '',
    },
  });

  useEffect(() => {
    if (selectedProperties) {
      formProperty.reset({
        propertyCode: selectedProperties.propertyCode,
        propertyName: selectedProperties.propertyName,
        titleNo: selectedProperties.titleNo,
        lotNo: selectedProperties.lotNo,
        registeredOwner: selectedProperties.registeredOwner,
        address: selectedProperties.address,
        city: selectedProperties.city,
        province: selectedProperties.province,
        custodianId: selectedProperties.custodian.id,
        companyId: selectedProperties.company.id,
      });
    }
  }, [selectedProperties, formProperty]);

  const onSubmitProperty = (values: z.infer<typeof UpdatePropertySchema>) => {
    setError("");
    setSuccess("");

    // Check if selectedProperties is not null and selectedProperties.id is a string
    if (selectedProperties?.id) {
      startTransition(() => {
        UpdateProperty({ ...values, id: selectedProperties.id }) // Include the leave ID in the request
          .then((data) => {
            setError(data.error);
            toast.success("RPT details updated successfully.");

            if (!data.error) {
              form.reset();
              handleClosePropertyModal();
            }
          })
          .finally(() => {
            setTimeout(() => {
              setError(undefined);
              setSuccess(undefined);
            }, 5000);
          });
      });
    }
  };

  return (
    <>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleOpenPropertyModal}>
              Property Status <PenIcon className="h-3.5 w-3.5 ml-2" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenPropertyModal}>
              View Attachments <EyeIcon className="h-3.5 w-3.5 ml-2" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenRPTModal}>
              View RPT Details <FileText className="h-3.5 w-3.5 ml-2" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenPropertyModal}>
              Audit Trail <MagnifyingGlassIcon className="h-3.5 w-3.5 ml-1" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex justify-center items-center z-50">
          <Dialog open={isRPTModalOpen} onOpenChange={handleCloseRPTModal}>
            <DialogContent className="sm:max-w-[550px]">
              <CardTitle>
                RPT Details
                <CardDescription className="mb-4">
                  Fill in the form below to update RPT details.
                </CardDescription>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col space-y-4">
                      <div className="flex space-x-4">
                        <div className="w-1/2">
                        <FormField
        control={form.control}
        name="TaxDecNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">Tax Dec No.</FormLabel>
            <FormControl>
              <Input
                {...field}
                defaultValue={selectedProperties?.rpt.TaxDecNo}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
                        </div>
                        <div className="w-1/2">
                          <FormLabel>Payment Mode</FormLabel>
                          <Input
                            value={selectedProperties?.rpt.PaymentMode}
                           
                            className="mt-2 font-xl"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-4 mt-4">
                        <div className="w-1/2">
                          <FormLabel>Due Date</FormLabel>
                          <Input
                            value={selectedProperties?.rpt.DueDate}
                            
                            className="mt-2"
                          />
                        </div>
                        <div className="w-1/2">
                          <FormLabel>Status</FormLabel>
                          <Input
                            value={selectedProperties?.rpt.Status}
                          
                            className="mt-2"
                          />
                        </div>
                      </div>
                      <div className="mt-4 mb-4">
                        <FormLabel>Custodian Remarks</FormLabel>
                        <Textarea
                          value={selectedProperties?.rpt.custodianRemarks}
                          placeholder="Enter remarks here..."
                          className="h-[60px] mt-2"
                        
                        />
                      </div>
                      <div></div>
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button disabled={isPending} type="submit" className="w-full mt-4">
                      Save RPT Details
                    </Button>
                  </form>
                </Form>
              </CardTitle>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-center items-center z-50">
          <Dialog open={isPropertyModalOpen} onOpenChange={handleClosePropertyModal}>
            <DialogContent className="sm:max-w-[550px]">
              <CardTitle>
                Property Details
                <CardDescription className="mb-4">
                  Fill in the form below to update RPT details.
                </CardDescription>

                <Form {...formProperty}>
  <form onSubmit={formProperty.handleSubmit(onSubmitProperty)} className="space-y-6">
    <div className="flex flex-col space-y-4">

      <div className="flex w-full space-x-4">
        <div className="w-1/2">
          <FormField
            control={formProperty.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Company</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={selectedProperties?.company.id}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder={selectedProperties?.company.companyName} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.companyName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-1/2">
          <FormField
            control={formProperty.control}
            name="custodianId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Custodian</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={selectedProperties?.custodian.id}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder={`${selectedProperties?.custodian.firstName} ${selectedProperties?.custodian.lastName}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {custodians.map((custodian) => (
                          <SelectItem key={custodian.id} value={custodian.id}>
                            {custodian.firstName} {custodian.lastName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={formProperty.control}
        name="registeredOwner"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">Registered Owner</FormLabel>
            <FormControl>
              <Input
                {...field}
                defaultValue={selectedProperties?.registeredOwner}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={formProperty.control}
        name="propertyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">Property Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                defaultValue={selectedProperties?.propertyName}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex space-x-4">
        <FormField
          control={formProperty.control}
          name="propertyCode"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="font-semibold">Property Code</FormLabel>
              <FormControl>
                <Input {...field} defaultValue={selectedProperties?.propertyCode} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formProperty.control}
          name="titleNo"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="font-semibold">Title No.</FormLabel>
              <FormControl>
                <Input {...field} defaultValue={selectedProperties?.titleNo} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formProperty.control}
          name="lotNo"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="font-semibold">Lot No.</FormLabel>
              <FormControl>
                <Input {...field} defaultValue={selectedProperties?.lotNo} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={formProperty.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">Address</FormLabel>
            <FormControl>
              <Input
                {...field}
                defaultValue={selectedProperties?.address}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex w-full space-x-4">
        <div className="w-1/2">
          <FormField
            control={formProperty.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">City</FormLabel>
                <FormControl>
                  <Input {...field} defaultValue={selectedProperties?.city} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-1/2">
          <FormField
            control={formProperty.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Province</FormLabel>
                <FormControl>
                  <Input {...field} defaultValue={selectedProperties?.province} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
    <FormError message={error} />
    <FormSuccess message={success} />
    <Button disabled={isPending} type="submit" className="w-full">
      Update Property Details
    </Button>
  </form>
</Form>
              </CardTitle>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export const columns: ColumnDef<Properties>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="hidden sm:table-cell">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="hidden sm:table-cell">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "propertyCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property Code" />
    ),
    cell: ({ row }) => {
      const propertyCode = row.original.propertyCode;
      return <Badge variant="secondary">{propertyCode}</Badge>;
    },
  },
  {
    accessorKey: "propertyName",
    header: ({ column }) => (
      <div className="hidden sm:table-cell">
        <DataTableColumnHeader column={column} title="Property Name" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="hidden sm:table-cell">
        {row.original.propertyName}
      </div>
    ),
  },
  {
    accessorKey: "titleNo",
    header: ({ column }) => (
      <div className="hidden sm:table-cell">
        <DataTableColumnHeader column={column} title="Title No." />
      </div>
    ),
    cell: ({ row }) => (
      <div className="hidden sm:table-cell">
        {row.original.titleNo}
      </div>
    ),
  },
  {
    accessorKey: "lotNo",
    header: ({ column }) => (
      <div className="hidden sm:table-cell">
        <DataTableColumnHeader column={column} title="Lot No." />
      </div>
    ),
    cell: ({ row }) => (
      <div className="hidden sm:table-cell">
        {row.original.lotNo}
      </div>
    ),
  },
  {
    accessorKey: "registeredOwner",
    header: ({ column }) => (
      <div className="hidden sm:table-cell">
        <DataTableColumnHeader column={column} title="Registered Owner" />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.registeredOwner;
      return (
        <div className="hidden sm:table-cell">
          <Badge variant="default">{status}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <div className="hidden sm:table-cell">
        <DataTableColumnHeader column={column} title="Address" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="hidden sm:table-cell">
        {row.original.address}
      </div>
    ),
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <div className="hidden sm:table-cell">
        <DataTableColumnHeader column={column} title="City" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="hidden sm:table-cell">
        {row.original.city}
      </div>
    ),
  },
  {
    accessorKey: "province",
    header: ({ column }) => (
      <div className="hidden sm:table-cell">
        <DataTableColumnHeader column={column} title="Province" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="hidden sm:table-cell">
        {row.original.province}
      </div>
    ),
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <div className="hidden sm:table-cell">
        <DataTableColumnHeader column={column} title="Company" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="hidden sm:table-cell">
        {row.original.company?.companyName}
      </div>
    ),
  },
  {
    id: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Custodian" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.custodian.firstName} {row.original.custodian.lastName}
      </span>
    ),
  },
  {
    accessorKey: 'rpt.TaxDecNo',
    header: ({ column }) => (
      <div className="hidden sm:table-cell">
        <DataTableColumnHeader column={column} title="Tax Dec No." />
      </div>
    ),
    cell: ({ row }) => (
      <div className="hidden sm:table-cell">
        {row.original.rpt?.TaxDecNo}
      </div>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: CellComponent,
  },
];