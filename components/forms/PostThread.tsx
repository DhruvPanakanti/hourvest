"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";

interface Props {
  userId: string;
}

function PostThread({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      fullName: "",
      phoneNo: "",
      email: "",
      approvalType: "online",
      description: "",
      timePeriod: "",
      rewards: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      fullName: values.fullName,
      phoneNo: values.phoneNo,
      email: values.email,
      approvalType: values.approvalType,
      description: values.description,
      timePeriod: values.timePeriod,
      rewards: values.rewards,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-6'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='text-base-semibold text-light-2'>
                Full Name
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phoneNo'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='text-base-semibold text-light-2'>
                Phone Number
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='text-base-semibold text-light-2'>
                Email
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='approvalType'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='text-base-semibold text-light-2'>
                Type of Approval
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <label htmlFor="online" className="text-light-2">Online</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="offline" id="offline" />
                    <label htmlFor="offline" className="text-light-2">Offline</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='text-base-semibold text-light-2'>
                Description
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='timePeriod'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='text-base-semibold text-light-2'>
                Time Period
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <select 
                  className="w-full h-10 px-3 py-2 bg-dark-3 border border-dark-4 rounded-md text-light-1"
                  onChange={field.onChange}
                  value={field.value}
                >
                  <option value="">Select time period...</option>
                  <option value="1hr">1 hour</option>
                  <option value="2hr">2 hours</option>
                  <option value="6hr">6 hours</option>
                  <option value="12hr">12 hours</option>
                  <option value="1day">1 day</option>
                  <option value="3days">3 days</option>
                  <option value="1week">1 week</option>
                  <option value="2weeks">2 weeks</option>
                  <option value="30days">30 days</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='rewards'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='text-base-semibold text-light-2'>
                Rewards
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500 mt-4'>
          Post Thread
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;