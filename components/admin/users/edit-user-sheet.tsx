"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user";
import React, { useState } from "react";
import { transportOptions, payTaxToOptions } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DatePickerWithRange } from "@/components/ui/date-picker";

const slopeActivityMap: Record<string, string> = {
  no: "nu",
  visit: "vizita",
  ski: "schi",
  sled: "sanie",
};

const userFormSchema = z.object({
  // Read-only fields for regular admins, editable for superAdmin
  name: z.string(),
  phone: z.string(),
  church: z.string(),
  age: z.number(),
  imageUrl: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),

  // Editable fields for all admins
  transport: z.enum(["personal", "bus", "other"]),
  payTaxTo: z.string(),
  slopeActivity: z.enum(["no", "visit", "ski", "sled"]),
  amountPaid: z.number().min(0),
  isConfirmed: z.boolean(),
  preferences: z.string().optional(),
  withFamilyMember: z.boolean(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface EditUserSheetProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (user: User) => Promise<void>;
  isSuperAdmin?: boolean;
}

export function EditUserSheet({
  user,
  isOpen,
  onClose,
  onUpdate,
  isSuperAdmin,
}: EditUserSheetProps) {
  const { toast } = useToast();
  const [defaultAccordionValue] = useState(["payment"]);
  const [isDirty, setIsDirty] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      church: "",
      age: 0,
      transport: "personal",
      payTaxTo: "",
      slopeActivity: "no",
      amountPaid: 0,
      isConfirmed: false,
      preferences: "",
      withFamilyMember: false,
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        phone: user.phone || "",
        church: user.church || "",
        age: user.age || 0,
        transport: user.transport as "personal" | "bus" | "other",
        payTaxTo: user.payTaxTo || "",
        slopeActivity: user.slopeActivity as "no" | "visit" | "ski" | "sled",
        amountPaid: user.amountPaid || 0,
        isConfirmed: user.isConfirmed || false,
        preferences: user.preferences || "",
        withFamilyMember: user.withFamilyMember || false,
        startDate: user.startDate ? new Date(user.startDate) : new Date(),
        endDate: user.endDate ? new Date(user.endDate) : new Date(),
      });
      setIsDirty(false);
    }
  }, [user, form]);

  const handleClose = () => {
    if (isDirty) {
      toast({
        title: "Modificări nesalvate",
        description: "Ai făcut modificări care nu au fost salvate",
        variant: "warning",
      });
    }
    onClose();
  };

  async function onSubmit(data: UserFormValues) {
    try {
      const updatedUser = {
        ...user,
        ...data,
        updatedAt: new Date(),
        startDate: data.startDate,
        endDate: data.endDate,
        slopeActivity: slopeActivityMap[data.slopeActivity] || "nu",
      };
      await onUpdate(updatedUser);

      toast({
        title: "Succes",
        description: "Datele au fost actualizate cu succes",
        variant: "success",
      });
      setIsDirty(false);
      onClose();
    } catch {
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza datele",
        variant: "destructive",
      });
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editare Participant</SheetTitle>
          <SheetDescription>{user.name}</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              onChange={() => setIsDirty(true)}
            >
              <FormField
                control={form.control}
                name="isConfirmed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-muted/50 p-3 rounded-lg">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Eligibilitate confirmată</FormLabel>
                      <FormDescription>
                        Participantul a fost verificat și aprobat pentru
                        participare
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {isSuperAdmin && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem
                    value="personal"
                    className="border-none bg-muted/50 rounded-lg"
                  >
                    <AccordionTrigger className="px-4">
                      Date Personale
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 px-4 pb-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nume</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefon</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="church"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Biserica</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vârsta</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <FormLabel>Perioada în tabără</FormLabel>
                        <DatePickerWithRange
                          from={form.getValues("startDate")}
                          to={form.getValues("endDate")}
                          onChange={({ from, to }) => {
                            form.setValue("startDate", from);
                            form.setValue("endDate", to);
                            setIsDirty(true);
                          }}
                        />
                        <FormMessage>
                          {form.formState.errors.startDate?.message}
                        </FormMessage>
                        <FormMessage>
                          {form.formState.errors.endDate?.message}
                        </FormMessage>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              <Accordion
                type="multiple"
                defaultValue={defaultAccordionValue}
                className="w-full space-y-2"
              >
                <AccordionItem
                  value="payment"
                  className="border-none bg-muted/50 rounded-lg"
                >
                  <AccordionTrigger className="px-4">Plată</AccordionTrigger>
                  <AccordionContent className="space-y-4 px-4 pb-4">
                    <FormField
                      control={form.control}
                      name="payTaxTo"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Plătește taxa către</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              {payTaxToOptions.map((option) => (
                                <div
                                  key={option.value}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem
                                    value={option.value}
                                    id={option.value}
                                  />
                                  <Label htmlFor={option.value}>
                                    {option.label}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amountPaid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suma Plătită</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="transport"
                  className="border-none bg-muted/50 rounded-lg"
                >
                  <AccordionTrigger className="px-4">
                    Transport
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-4 pb-4">
                    <FormField
                      control={form.control}
                      name="transport"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Mijloc de transport</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              {transportOptions.map((option) => (
                                <div
                                  key={option.value}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem
                                    value={option.value}
                                    id={option.value}
                                  />
                                  <Label htmlFor={option.value}>
                                    {option.label}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="activities"
                  className="border-none bg-muted/50 rounded-lg"
                >
                  <AccordionTrigger className="px-4">
                    Activități și Preferințe
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-4 pb-4">
                    <FormField
                      control={form.control}
                      name="slopeActivity"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Activitate Pârtie</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="no" />
                                <Label htmlFor="no">
                                  Nu va merge pe pârtie
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="visit" id="visit" />
                                <Label htmlFor="visit">
                                  Da, doar în vizită
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ski" id="ski" />
                                <Label htmlFor="ski">
                                  Da, cu ski/snowboard
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="sled" id="sled" />
                                <Label htmlFor="sled">Da, cu sania</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="withFamilyMember"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Cu membru familie</FormLabel>
                            <FormDescription>
                              Participă împreună cu un membru al familiei
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferences"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferințe colegi de cameră</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Anulează
                </Button>
                <Button type="submit" variant="default">
                  Salvează
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
