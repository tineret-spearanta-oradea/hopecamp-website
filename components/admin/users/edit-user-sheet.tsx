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
import React, { useState } from "react";
import {
  transportOptions,
  payTaxToOptions,
  slopeActivityOptions,
  sumToPay,
} from "@/lib/constants";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { toast } from "sonner";

import {RegistrationWithProfile} from "@/types/registrationWithProfile";

const userFormSchema = z.object({
  // Read-only fields for regular admins, editable for superAdmin
  name: z.string().min(1, "Numele este obligatoriu"),
  phone: z.string().min(1, "Numărul de telefon este obligatoriu"),
  church: z.string().min(1, "Biserica este obligatorie"),
  age: z.number().min(1, "Vârsta este obligatorie"),
  imageUrl: z.string().optional(),
  startDate: z.date({
    required_error: "Data de început este obligatorie",
    invalid_type_error: "Data de început nu este validă",
  }),
  endDate: z.date({
    required_error: "Data de sfârșit este obligatorie",
    invalid_type_error: "Data de sfârșit nu este validă",
  }),

  // Editable fields for all admins
  transport: z.enum(["personal", "prieten", "autocar"], {
    required_error: "Mijlocul de transport este obligatoriu",
    invalid_type_error: "Mijlocul de transport nu este valid",
  }),
  payTaxTo: z.string().min(1, "Metoda de plată este obligatorie"),
  slopeActivity: z.enum(["nu", "vizita", "schi", "sanie"], {
    required_error: "Activitatea la pârtie este obligatorie",
    invalid_type_error: "Opțiunea pentru pârtie nu este validă",
  }),
  amountPaid: z.number().min(0, "Suma plătită nu poate fi negativă"),
  isConfirmed: z.boolean(),
  preferences: z.string().optional(),
  withFamilyMember: z.boolean(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface EditUserSheetProps {
  registration: RegistrationWithProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (user: RegistrationWithProfile) => Promise<void>;
  isSuperAdmin?: boolean;
  isUpdating?: boolean;
}

export function EditUserSheet({
  registration,
  isOpen,
  onClose,
  onUpdate,
  isSuperAdmin,
  isUpdating = false,
}: EditUserSheetProps) {
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
      slopeActivity: "nu",
      amountPaid: 0,
      isConfirmed: false,
      preferences: "",
      withFamilyMember: false,
      startDate: new Date(),
      endDate: new Date(),
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (registration) {
      const formValues = {
        name: registration.name,
        phone: registration.phone || "",
        church: registration.church || "",
        age: registration.age || 0,
        transport: registration.transport as "personal" | "prieten" | "autocar",
        payTaxTo: registration.payTaxTo || "",
        slopeActivity: registration.slopeActivity as "nu" | "vizita" | "schi" | "sanie",
        amountPaid: registration.amountPaid || 0,
        isConfirmed: registration.isConfirmed || false,
        preferences: registration.preferences || "",
        withFamilyMember: registration.withFamilyMember || false,
        startDate: registration.startDate ? new Date(registration.startDate) : new Date(),
        endDate: registration.endDate ? new Date(registration.endDate) : new Date(),
      };
      form.reset(formValues);
      setIsDirty(false);
    }
  }, [registration, form]);

  const handleClose = () => {
    if (isDirty) {
      toast.warning("Modificări nesalvate", {
        description: "Ai făcut modificări care nu au fost salvate",
      });
    }
    onClose();
  };

  async function onSubmit(data: UserFormValues) {
    try {
      const updatedUser = {
        ...registration,
        ...data,
        updatedAt: new Date(),
        startDate: data.startDate,
        endDate: data.endDate,
      };
      await onUpdate(updatedUser);
      setIsDirty(false);
      toast.success("Salvat cu succes", {
        description: "Datele au fost actualizate cu succes",
      });
    } catch (error) {
      toast.error("Eroare", {
        description:
          "A apărut o eroare la salvarea datelor. Te rugăm să încerci din nou.",
      });
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editare Participant</SheetTitle>
          <SheetDescription>{registration.name}</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Form {...form}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const isValid = await form.trigger();
                if (isValid) {
                  const values = form.getValues();
                  await onSubmit(values);
                } else {
                  const errorMessages = Object.entries(form.formState.errors)
                    .map(([field, error]) => `${field}: ${error?.message}`)
                    .join("\n");
                  toast.error("Eroare de validare", {
                    description: errorMessages,
                  });
                }
              }}
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
                          <div className="space-y-2">
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber)
                                }
                              />
                            </FormControl>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  field.onChange(0);
                                  setIsDirty(true);
                                }}
                              >
                                0 RON
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  field.onChange(sumToPay.deposit);
                                  setIsDirty(true);
                                }}
                              >
                                {sumToPay.deposit} RON (Avans)
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  field.onChange(sumToPay.normal);
                                  setIsDirty(true);
                                }}
                              >
                                {sumToPay.normal} RON (Integral)
                              </Button>
                            </div>
                            <FormMessage />
                          </div>
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
                          <FormLabel>Activitate la pârtie</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              {slopeActivityOptions.map((option) => (
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isUpdating}
                >
                  Anulează
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating || !isDirty}
                  className="min-w-[100px]"
                >
                  {isUpdating ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Salvează...
                    </div>
                  ) : (
                    "Salvează"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
