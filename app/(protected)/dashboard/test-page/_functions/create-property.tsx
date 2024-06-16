"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";
import { createProperty } from "@/actions/queries";
import { CreatePropertySchema } from "@/schemas";

type Custodiansx = {
  id: string;
  firstName: string;
  lastName: string;
};

type Companiesx = {
  id: string;
  companyName: string;
}

export const CreatePropertyForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [custodians, setCustodians] = useState<Custodiansx[]>([]);
  const [companies, setCompanies] = useState<Companiesx[]>([]);
  const user = useCurrentUser();

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

  const form = useForm<z.infer<typeof CreatePropertySchema>>({
    resolver: zodResolver(CreatePropertySchema),
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

  const onSubmit = (values: z.infer<typeof CreatePropertySchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createProperty(values)
        .then((data) => {
          setError(data.error);
          toast.error("Property added successfully.")
          
          if (!data.error) {
            form.reset();
          }
        })
        .finally(() => {
          setTimeout(() => {
            setError(undefined);
            setSuccess(undefined);
          }, 5000);
        });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-8">
          <PlusCircleIcon className="mr-2 w-4 h-4" />
          Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Property Information</DialogTitle>
          <DialogDescription>
            Enter required property details. Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col space-y-4">

            <div className="flex w-full space-x-4">
            <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Company</FormLabel>
                      <FormControl>
                        <Controller
                          name="companyId"
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isPending}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select company..." />
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
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>

                <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="custodianId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Custodian</FormLabel>
                      <FormControl>
                        <Controller
                          name="custodianId"
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isPending}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select custodian..." />
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
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>

              <FormField
                control={form.control}
                name="registeredOwner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Registered Owner</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
                control={form.control}
                name="propertyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Property Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="propertyCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="font-semibold">Property Code</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="titleNo"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="font-semibold">Title No.</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                  control={form.control}
                  name="lotNo"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="font-semibold">Lot No.</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
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
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">City</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Province</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending}/>
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
              Save Property
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
