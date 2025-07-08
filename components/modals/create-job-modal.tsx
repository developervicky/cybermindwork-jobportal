"use client";

import { useModal } from "@/hooks/use-modal-hook";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { addYears, format, startOfMonth } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { CalendarIcon, ChevronsDown, ChevronsRight } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import FileUpload from "../file-upload";

// Draft management utilities
const DRAFT_KEY = 'job_form_draft';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveDraftToStorage = (data: any) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving draft:', error);
  }
};

const loadDraftFromStorage = () => {
  try {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      return JSON.parse(draft);
    }
  } catch (error) {
    console.error('Error loading draft:', error);
  }
  return null;
};

const removeDraftFromStorage = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Error removing draft:', error);
  }
};

export const formSchema = z
  .object({
    companyLogo: z.string().optional(),
    jobTitle: z
      .string()
      .min(2, { message: "Job Title must be above 2 characters" })
      .max(50, { message: "Job Title must be below 50 characters" }),
    companyName: z
      .string()
      .min(2, { message: "Company Name must be above 2 characters" })
      .max(50, { message: "Company Name must be below 50 characters" }),
    location: z
      .string()
      .min(2, { message: "Location must be above 2 characters" })
      .max(50, { message: "Location must be below 50 characters" }),
    jobType: z.enum(["Full-Time", "Part-Time", "Contract", "Internship"]),
    minSalary: z.coerce.number().min(0),
    maxSalary: z.coerce.number().min(0),
    experience: z.enum(["Fresher", "1+ Years", "3+ Years", "6+ Years"]),
    environment: z.enum(["Onsite", "Remote", "Hybrid"]),
    description: z
      .string()
      .min(10, { message: "Description must be above 10 characters" })
      .max(1000, { message: "Description must be below 1000 characters" }),
    applicationDeadline: z.date().optional(),
  })
  .refine(({ minSalary, maxSalary }) => maxSalary > minSalary, {
    path: ["maxSalary"], // highlight the offending field
    message: "Maximum salary > Minimum salary",
  });

const CreateJobModal = () => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyLogo: "",
      jobTitle: "",
      companyName: "",
      location: "",
      jobType: "Full-Time",
      minSalary: undefined,
      maxSalary: undefined,
      experience: "Fresher",
      environment: "Onsite",
      applicationDeadline: undefined,
      description: "",
    },
  });

  const { type, isOpen, onClose } = useModal();
  const isModalOpen = isOpen && type == "createJobModal";

  const isLoading = form.formState.isSubmitting;

  // Load draft when modal opens
  useEffect(() => {
    if (isModalOpen) {
      const savedDraft = loadDraftFromStorage();
      if (savedDraft) {
        form.reset(savedDraft);
        setIsDraftSaved(true);
      }
    }
  }, [isModalOpen, form]);

  // Watch for form changes to mark as unsaved
  useEffect(() => {
    const subscription = form.watch(() => {
      setIsDraftSaved(false);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSaveDraft = () => {
    const formData = form.getValues();
    saveDraftToStorage(formData);
    setIsDraftSaved(true);
    toast.success('Draft saved successfully!');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const resultValues = { ...values, yearlySalary: values.maxSalary * 12 };
      await axios.post("/api/job-openings", resultValues);
      form.reset();
      removeDraftFromStorage();
      setIsDraftSaved(false);
      onClose();
      window.location.reload();
      toast.success("Job Opening create Successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Something went wrong");
      }
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={true}
        className="dark:text-primary-foreground dark:bg-background !w-full !max-w-3xl overflow-hidden bg-white"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-center text-lg font-semibold sm:text-2xl sm:font-bold">
            Create Job Opening
          </DialogTitle>
          <DialogDescription className="sr-only">
            Fill out the form to create a new job posting.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="mt-4 sm:mt-6">
              <FormField
                control={form.control}
                name="companyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        endPoint="companyLogo"
                        fileUrl={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Job Title<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full Stack Developer"
                        className="text-sm font-normal sm:h-12 sm:!text-base sm:font-semibold"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Company Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cybermind Works"
                        className="text-sm font-normal sm:h-12 sm:!text-base sm:font-semibold"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:mt-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Location<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Chennai, India"
                        className="text-sm font-normal sm:h-12 sm:!text-base sm:font-semibold"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Job Type<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full text-sm font-normal sm:!h-12 sm:!text-base sm:font-semibold">
                            <SelectValue defaultValue="Full-Time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-Time">Full-Time</SelectItem>
                          <SelectItem value="Part-Time">Part-Time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:mt-6">
              <FormField
                control={form.control}
                name="minSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Monthly Salary Range
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <FormControl>
                        <Input
                          placeholder={`₹0`}
                          className="text-sm font-normal sm:h-12 sm:!text-base sm:font-semibold"
                          {...field}
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          placeholder={`₹100000`}
                          className="text-sm font-normal sm:h-12 sm:!text-base sm:font-semibold"
                          {...form.register("maxSalary", {
                            setValueAs: (v) =>
                              v === "" ? undefined : Number(v), // 👈 key line
                          })}
                        />
                      </FormControl>
                    </div>
                    <FormMessage>
                      {form.formState.errors.maxSalary?.message ||
                        form.formState.errors.minSalary?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="applicationDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Deadline</FormLabel>
                    <Popover
                      open={calendarOpen}
                      onOpenChange={setCalendarOpen}
                      modal
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            onClick={() => setCalendarOpen(!calendarOpen)}
                            className={cn(
                              "bg-white pl-3 text-left font-normal sm:!h-12 sm:!text-base sm:font-semibold",
                              !field.value &&
                                "text-muted-foreground font-normal sm:font-semibold",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        align="center"
                        side="bottom"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={(date) => {
                            field.onChange(date);
                            setCalendarOpen(false);
                          }}
                          captionLayout="dropdown"
                          startMonth={startOfMonth(new Date())}
                          endMonth={startOfMonth(addYears(new Date(), 5))}
                          disabled={{ before: new Date() }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:mt-6">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Experience<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full text-sm font-normal sm:!h-12 sm:!text-base sm:font-semibold">
                            <SelectValue defaultValue="Full-Time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Fresher">Fresher</SelectItem>
                          <SelectItem value="1+ Years">1+ Years</SelectItem>
                          <SelectItem value="3+ Years">3+ Years</SelectItem>
                          <SelectItem value="6+ Years">6+ Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="environment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Environment<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full text-sm font-normal sm:!h-12 sm:!text-base sm:font-semibold">
                            <SelectValue defaultValue="Onsite" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Onsite">Onsite</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4 sm:mt-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Job Description<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="text-sm font-normal sm:!text-base"
                        placeholder="Please share a description to let the candidate know more about the job role"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <div className="flex w-full items-center justify-between">
                <Button
                  variant="outline"
                  className="cursor-pointer border-gray-600 md:!px-10 md:!py-6"
                  disabled={isLoading}
                  onClick={handleSaveDraft}
                  type="button"
                >
                  {isDraftSaved ? 'Draft Saved ✓' : 'Save Draft'}
                  <ChevronsDown className="!h-4 !w-4 text-gray-600" />
                </Button>
                <Button
                  variant="default"
                  disabled={isLoading}
                  type="submit"
                  className="bg-btn-primary hover:bg-btn-primary/90 cursor-pointer md:!px-10 md:!py-6"
                >
                  {isLoading ? 'Publishing...' : 'Publish'}
                  <ChevronsRight className="!h-4 !w-4 text-white" />
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobModal;