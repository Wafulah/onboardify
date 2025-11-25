"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/image-upload"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 


import { 
  CustomerOnboardingFormValues, 
  CustomerOnboardingSchema, 
  StepOneSchema, 
  StepTwoSchema, 
  StepThreeSchema, 
  StepFourSchema 
} from "@/schemas"; 


const MAX_STEPS = 4; // Step 1, 2/3, 4, 5

type CurrentSchema = 
  | typeof StepOneSchema 
  | typeof StepTwoSchema 
  | typeof StepThreeSchema 
  | typeof StepFourSchema;


const getSchema = (step: number): CurrentSchema => {
  switch (step) {
    case 1: return StepOneSchema;
    case 2: return StepTwoSchema;
    case 3: return StepThreeSchema;
    case 4: return StepFourSchema;
    default: return StepOneSchema;
  }
};

const CreateCustomerForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CustomerOnboardingFormValues>({
    resolver: zodResolver(CustomerOnboardingSchema), 
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      nationalId: "",
      idFrontImageUrl: [],
      idBackImageUrl: [],
      profileImageUrl: [],
      nationality: "",
      address: "",
      businessName: "",
      businessType: "",
    },
    mode: "onBlur",
  });

  const nextStep = async () => {
    // Dynamically validate only the fields for the current step
    const isValid = await form.trigger(Object.keys(getSchema(currentStep).shape) as (keyof CustomerOnboardingFormValues)[]);

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: CustomerOnboardingFormValues) => {
        setIsLoading(true);
        try {
            console.log("Submitting Customer Data:", data);

            // 1. Normalize image URLs (as defined by your logic)
            const payload = {
                ...data,
                profileImageUrl: data.profileImageUrl[0], // Extract single URL
                idFrontImageUrl: data.idFrontImageUrl[0],
                idBackImageUrl: data.idBackImageUrl[0],
            };

            console.log("payload", payload);

            
            const response = await fetch("/api/onboard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            
           
            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error Response:", errorData);
                
                throw new Error(errorData.message || "Failed to onboard customer.");
            }

            
            form.reset();
            setCurrentStep(1);
            alert("Customer Onboarding Successful!"); 

        } catch (error) {
            // Display specific error message if available
            const errorMessage = error instanceof Error ? error.message : "Submission failed. Check console for details.";
            console.error("Submission failed:", error);
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

  // --- Step Rendering Functions ---

  const renderStepOne = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl><Input placeholder="John" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="middleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name (Optional)</FormLabel>
              <FormControl><Input placeholder="D." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl><Input placeholder="Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl><Input type="tel" placeholder="+254 7XX XXX XXX" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
      <h3 className="text-lg font-semibold mb-4">Identity Verification (ID Documents)</h3>
      <FormField
        control={form.control}
        name="nationalId"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel>National ID Number</FormLabel>
            <FormControl><Input placeholder="e.g. 12345678" {...field} /></FormControl>
            <FormDescription>This ID number must be unique in our system.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="idFrontImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Front Page Scan</FormLabel>
              <FormControl>
                <ImageUpload 
                  value={field.value} 
                  onChange={(urls) => field.onChange(urls)} 
                  onRemove={(url) => field.onChange(field.value.filter(u => u !== url))}
                  // Max files must be 1 for ID scans
                  // NOTE: You'll need to modify the ImageUpload component 
                  // to allow maxFiles option to be passed through props
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idBackImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Back Page Scan</FormLabel>
              <FormControl>
                <ImageUpload 
                  value={field.value} 
                  onChange={(urls) => field.onChange(urls)} 
                  onRemove={(url) => field.onChange(field.value.filter(u => u !== url))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );

  const renderStepThree = () => (
    <>
      <h3 className="text-lg font-semibold mb-4">Customer Profile Photo</h3>
      <FormField
        control={form.control}
        name="profileImageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Live Customer Photo (KYC)</FormLabel>
            <FormControl>
              <ImageUpload 
                value={field.value} 
                onChange={(urls) => field.onChange(urls)} 
                onRemove={(url) => field.onChange(field.value.filter(u => u !== url))}
              />
            </FormControl>
            <FormDescription>This photo is used for identity verification.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
  
  const renderStepFour = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <FormControl><Input placeholder="e.g. Kenyan" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Physical Address</FormLabel>
              <FormControl><Textarea placeholder="123 Main Street" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name (Optional)</FormLabel>
              <FormControl><Input placeholder="Acme Solutions" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type (Optional)</FormLabel>
              <FormControl><Input placeholder="e.g. Retail, Crypto, FinTech" {...field} /></FormControl>
              <FormMessage />
              <FormDescription className="text-red-500">Note: Some business types are automatically flagged.</FormDescription>
            </FormItem>
          )}
        />
      </div>
    </>
  );


  // --- Main Render ---
  return (
    <Card className="max-w-4xl mx-auto my-12 shadow-xl border-t-4 border-cyan-primary">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">New Customer Onboarding 📝</CardTitle>
        <p className="text-sm text-gray-500">
          Step {currentStep} of {MAX_STEPS}: 
          {currentStep === 1 && " Personal Contact Information"}
          {currentStep === 2 && " Identity Verification"}
          {currentStep === 3 && " Customer Photo (KYC)"}
          {currentStep === 4 && " Background Information"}
        </p>
        <Separator className="mt-2" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {currentStep === 1 && renderStepOne()}
            {currentStep === 2 && renderStepTwo()}
            {currentStep === 3 && renderStepThree()}
            {currentStep === 4 && renderStepFour()}
            
            <Separator />
            
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-2">
              <Button 
                type="button" 
                onClick={prevStep} 
                disabled={currentStep === 1 || isLoading} 
                variant="outline"
              >
                Previous
              </Button>
              
              {currentStep < MAX_STEPS ? (
                <Button 
                  type="button" 
                  onClick={nextStep} 
                  disabled={isLoading} 
                  className="bg-cyan-primary hover:bg-teal-accent text-slate-text hover:text-white"
                >
                  Next Step
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="bg-cyan-primary hover:bg-teal-accent text-slate-text hover:text-white"
                >
                  {isLoading ? "Submitting..." : "Submit Customer"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateCustomerForm;