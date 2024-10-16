"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePropertySchema } from "@/schemas";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProperty } from "@/actions/queries";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

export const revalidate = 0;

interface CreatePropertyFormProps {
  onPropertyCreated: () => void;
}

export const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({ onPropertyCreated }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof CreatePropertySchema>>({
    resolver: zodResolver(CreatePropertySchema),
    defaultValues: {
      lotNo: "",
      titleNo: "",
      propertyCode: "",
      propertyName: "",
      city: "",
      address: "",
      province: "",
      propertyType: "",
      leasableArea: "",
      registeredOwner: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CreatePropertySchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createProperty(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);

          if (!data.error) {
            form.reset();
            onPropertyCreated(); // Call the callback function to update the property list
            setIsOpen(false); // Close the dialog
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
        <Button><PlusCircle className="w-5 h-5 mr-2" />Add Property</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>Fill in the details below:</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="propertyCode"
                  render={({ field }) => (
                    <FormItem>
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
                  <FormItem>
                    <FormLabel className="font-semibold">Title No.</FormLabel>
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
                name="lotNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Lot No.</FormLabel>
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
              </div>
              <FormField
                  control={form.control}
                  name="propertyName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="font-semibold">Property Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                  control={form.control}
                  name="registeredOwner"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="font-semibold">Registered Owner</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


              <div className="flex w-full space-x-4">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Property Type</FormLabel>
                        <FormControl>
                          <Controller
                            name="propertyType"
                            control={form.control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={isPending}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select property type..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='Commercial'>Commercial</SelectItem>
                                  <SelectItem value='Residential'>Residential</SelectItem>
                                  <SelectItem value='Land'>Land</SelectItem>
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
                    name="leasableArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Leasable Area</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} type='number' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex w-full space-x-4">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Address</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} type='address' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">City</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} type='address' />
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
                          <Input {...field} disabled={isPending} type='address' />
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
              Save New Property
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
