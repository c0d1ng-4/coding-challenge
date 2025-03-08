"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CareType } from "@/api/models/CareType";
import { FacilityService } from "@/api/services/FacilityService";
import { facilitySchema, FacilityFormData } from "@/lib/schemas/facility-schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CapacityType } from "@/api/models/CapacityType";

export function FacilityForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FacilityFormData>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: "",
      capacity: CapacityType.AVAILABLE,
      zip_code: "",
      care_types: [],
      min_zip_code: "",
      max_zip_code: "",
    },
    mode: "onChange",
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const careTypeOptions = [
    { id: CareType.STATIONARY, label: "Stationary" },
    { id: CareType.AMBULATORY, label: "Ambulatory" },
    { id: CareType.DAY_CARE, label: "Day Care" },
  ];

  const capacityOptions = [
    { value: CapacityType.AVAILABLE, label: "Available" },
    { value: CapacityType.FULL, label: "Full" },
  ];

  const onSubmit = async (data: FacilityFormData) => {
    setIsSubmitting(true);
    try {
      const result = await FacilityService.addFacility(data);
      if (result.success) {
        toast.success(result.message);
        form.reset();
        setIsOpen(false);
      } else {
        toast.error(result.message || "Failed to add facility");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add facility";
      toast.error(errorMessage);
      console.error("Error submitting facility form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    if (!isSubmitting) {
      setIsOpen(false);
    }
  };

  return (
    <TooltipProvider>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!isSubmitting) setIsOpen(open);
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full h-8 w-8 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-800/50"
                aria-label="Add Facility"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Add Facility</span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create Facility</p>
          </TooltipContent>
        </Tooltip>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold">Add New Facility</DialogTitle>
            <DialogDescription>
              Enter the details of the new care facility.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Facility Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter facility name"
                        {...field}
                        error={!!fieldState.error}
                        className="bg-background"
                        aria-invalid={!!fieldState.error}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="zip_code"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Facility Zip Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter zip code"
                          {...field}
                          error={!!fieldState.error}
                          maxLength={5}
                          inputMode="numeric"
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                            field.onChange(value);
                          }}
                          className="bg-background"
                          aria-invalid={!!fieldState.error}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Capacity</FormLabel>
                      <FormControl>
                        <select
                          className="border-input bg-background text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-lg border px-3 py-2 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                          disabled={isSubmitting}
                        >
                          {capacityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="care_types"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel className="text-foreground">Care Types</FormLabel>
                      <FormDescription className="text-muted-foreground">
                        Select the types of care this facility provides.
                      </FormDescription>
                    </div>
                    <div className="space-y-2 bg-background p-3 rounded-lg border border-border">
                      {careTypeOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="care_types"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-center space-x-3 space-y-0 py-1"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked: boolean | "indeterminate") => {
                                      const currentValue = field.value || [];
                                      return checked === true
                                        ? field.onChange([...currentValue, option.id])
                                        : field.onChange(
                                          currentValue.filter(
                                            (value) => value !== option.id
                                          )
                                        );
                                    }}
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-foreground">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel className="text-foreground">Service Area</FormLabel>
                <FormDescription className="text-muted-foreground">
                  Define the zip code range this facility serves.
                </FormDescription>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="min_zip_code"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Min Zip Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Min zip"
                            {...field}
                            error={!!fieldState.error}
                            maxLength={5}
                            inputMode="numeric"
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                              field.onChange(value);
                            }}
                            className="bg-background"
                            aria-invalid={!!fieldState.error}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="max_zip_code"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Max Zip Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Max zip"
                            {...field}
                            error={!!fieldState.error}
                            maxLength={5}
                            inputMode="numeric"
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                              field.onChange(value);
                            }}
                            className="bg-background"
                            aria-invalid={!!fieldState.error}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter className="mt-6 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isSubmitting}
                  className="bg-background"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="violet"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Facility"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
} 