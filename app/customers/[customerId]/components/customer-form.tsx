"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IconFlag, IconUserCheck, IconTrash, IconPencil, IconPhoto, IconId, IconClipboardText } from "@tabler/icons-react";
import * as z from "zod";

import { useParams, useRouter } from "next/navigation";


import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/ui/dashboard/alert-modal";
import { Heading } from "@/components/ui/dashboard/heading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";


import { CustomerWithRelations } from "../page";
import Image from "next/image"; 


const ACCOUNT_STATUSES = [
  "PENDING",
  "VERIFIED",
  "REJECTED",
  "FLAGGED",
] as const;

export const formSchema = z.object({
  status: z.enum(ACCOUNT_STATUSES),
  
  flagReason: z.string().nullable().optional(), 
});

export type CustomerFormValues = z.infer<typeof formSchema>;

interface CustomerFormProps {
  initialData: CustomerWithRelations;
}


const StatusPill: React.FC<{ status: typeof ACCOUNT_STATUSES[number]; flagged: boolean }> = ({ status, flagged }) => {
  let color = "bg-gray-100 text-gray-800";
  
  // 2. Comparisons now work because 'status' is a literal string union type.
  if (status === "VERIFIED") color = "bg-green-100 text-green-800";
  else if (status === "REJECTED") color = "bg-red-100 text-red-800";
  // The 'status' value itself is a string, so it can be compared to "FLAGGED"
  else if (status === "FLAGGED" || flagged) color = "bg-yellow-100 text-yellow-800";
  else if (status === "PENDING") color = "bg-blue-100 text-blue-800";

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${color}`}>
      {/* 3. The value 'status' is a string and can be rendered as a ReactNode. */}
      {status}
    </span>
  );
};


export const CustomerForm: React.FC<CustomerFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false); // For Delete modal
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Enable/Disable admin edit section

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: initialData.status,
      flagReason: initialData.flagReason ?? "",
    },
  });

  
  const imageMap = useMemo(() => {
    return initialData.images.reduce((acc, image) => {
      acc[image.id] = image;
      return acc;
    }, {} as { [key: string]: typeof initialData.images[0] });
  }, [initialData.images]);

  const getImageUrl = (imageId: string) => imageMap[imageId]?.url || "/placeholder-image.png";


  const onSubmit = async (data: CustomerFormValues) => {
    try {
      setLoading(true);
      
      await axios.patch(`/api/admin/customers/${params.customerId}`, data);
      router.refresh();
      toast.success("Customer record updated.");
      setIsEditing(false); 
    } catch (error) {
      toast.error("Failed to update customer record.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/admin/customers/${params.customerId}`);
      router.refresh();
      router.push("/customers"); 
      toast.success("Customer record deleted.");
    } catch (error) {
      toast.error("Failed to delete customer record.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const fullName = `${initialData.firstName} ${initialData.middleName ? initialData.middleName + ' ' : ''}${initialData.lastName}`;


  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />

      {/* Header: Customer Name + Status + Quick Actions */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <Heading 
            title={fullName} 
            description={`National ID: ${initialData.nationalId}`} 
          />
          <div className="mt-2 flex items-center gap-3">
            <StatusPill status={initialData.status} flagged={initialData.flagged} />
            <div className="text-sm text-muted-foreground">
                <span className="font-semibold">ID:</span> <span className="font-mono text-xs">{initialData.id}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Edit, Flag, Delete */}
        <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)} disabled={loading} aria-label="Toggle edit mode">
                <IconPencil className="mr-2 h-4 w-4" /> {isEditing ? "View Mode" : "Edit Status"}
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setOpen(true)} disabled={loading} aria-label="Delete customer">
                <IconTrash className="mr-2 h-4 w-4" /> Delete
            </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          {/* Core Details Grid (Uneditable Information) */}
          <section className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700">
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2 text-neutral-700 dark:text-neutral-200">
                <IconUserCheck className="h-5 w-5" /> Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="col-span-1">
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Full Name</label>
                <Input disabled value={fullName} />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Email Address</label>
                <Input disabled value={initialData.email} />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Phone Number</label>
                <Input disabled value={initialData.phone} />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">National ID</label>
                <Input disabled value={initialData.nationalId} />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Nationality</label>
                <Input disabled value={initialData.nationality} />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Residential Address</label>
                <Input disabled value={initialData.address ?? 'N/A'} />
              </div>
            </div>
          </section>

          {/* Business Details Grid */}
          <section className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700">
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2 text-neutral-700 dark:text-neutral-200">
                <IconClipboardText className="h-5 w-5" /> Business Information (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-1">
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Business Name</label>
                <Input disabled value={initialData.businessName ?? 'N/A'} />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Business Type</label>
                <Input disabled value={initialData.businessType ?? 'N/A'} />
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Verification & Audit Section - Image Preview and Status Update */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Images/Documents (Left/Top) */}
            <section className="lg:col-span-2 space-y-6">
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-2">
                    <IconPhoto className="h-5 w-5" /> Verification Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Profile Image */}
                    <div className="rounded-lg border p-3 bg-white dark:bg-neutral-800 shadow-sm text-center">
                        <div className="aspect-square bg-gray-100 dark:bg-neutral-700 rounded-md overflow-hidden mb-2 relative mx-auto max-w-[150px]">
                            <Image
                                src={getImageUrl(initialData.profileImageId)}
                                alt={`${fullName}'s profile`}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 640px) 100vw, 33vw"
                            />
                        </div>
                        <p className="text-sm font-medium">Profile Photo</p>
                    </div>

                    {/* ID Front */}
                    <div className="rounded-lg border p-3 bg-white dark:bg-neutral-800 shadow-sm text-center">
                        <div className="aspect-[3/2] bg-gray-100 dark:bg-neutral-700 rounded-md overflow-hidden mb-2 relative">
                            <Image
                                src={getImageUrl(initialData.idFrontImageId)}
                                alt="ID Front Page"
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 640px) 100vw, 33vw"
                            />
                        </div>
                        <p className="text-sm font-medium flex items-center justify-center gap-1"><IconId className="h-4 w-4" /> ID Front</p>
                    </div>

                    {/* ID Back */}
                    <div className="rounded-lg border p-3 bg-white dark:bg-neutral-800 shadow-sm text-center">
                        <div className="aspect-[3/2] bg-gray-100 dark:bg-neutral-700 rounded-md overflow-hidden mb-2 relative">
                            <Image
                                src={getImageUrl(initialData.idBackImageId)}
                                alt="ID Back Page"
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 640px) 100vw, 33vw"
                            />
                        </div>
                        <p className="text-sm font-medium flex items-center justify-center gap-1"><IconId className="h-4 w-4" /> ID Back</p>
                    </div>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl">
                    <h4 className="font-semibold text-sm mb-2 text-neutral-700 dark:text-neutral-300">Record Audit Trail</h4>
                    <dl className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-neutral-500 dark:text-neutral-400">Created By</dt>
                            <dd className="font-medium">{initialData.createdBy.name} ({initialData.createdBy.role})</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-neutral-500 dark:text-neutral-400">Date Created</dt>
                            <dd className="font-medium">{new Date(initialData.createdAt).toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-neutral-500 dark:text-neutral-400">Last Updated</dt>
                            <dd className="font-medium">{new Date(initialData.updatedAt).toLocaleString()}</dd>
                        </div>
                    </dl>
                </div>
            </section>

            {/* Admin Action Card (Right/Bottom) */}
            <aside className={`bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700 ${!isEditing && 'opacity-60 pointer-events-none'}`}>
                <h3 className="text-lg font-semibold mb-4 text-neutral-700 dark:text-neutral-200 flex items-center gap-2">
                    <IconFlag className="h-5 w-5 text-blue-600" /> Compliance Review
                </h3>
                
                <div className="space-y-4">
                  <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Verification Status</FormLabel>
                              <FormControl>
                                  <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      disabled={loading || !isEditing}
                                  >
                                      <SelectTrigger>
                                          <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          {ACCOUNT_STATUSES.map((s) => (
                                              <SelectItem key={s} value={s}>
                                                  {s}
                                              </SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />

                  <FormField
                      control={form.control}
                      name="flagReason"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Flagging / Rejection Reason</FormLabel>
                              <FormControl>
                                  <Textarea
                                      {...field}
                                      value={field.value ?? ""}
                                      placeholder="Note why this customer was flagged or rejected (e.g., 'ID mismatch', 'Incomplete documents')"
                                      disabled={loading || !isEditing}
                                  />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <Button 
                        variant="outline" 
                        onClick={() => {
                            form.reset(); // Reset form state
                            setIsEditing(false); // Cancel edit mode
                        }} 
                        disabled={loading || !isEditing}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        onClick={form.handleSubmit(onSubmit)} 
                        disabled={loading || !isEditing}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Save Status
                    </Button>
                </div>

            </aside>
          </div>
        </form>
      </Form>
    </>
  );
};