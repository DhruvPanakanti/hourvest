import * as z from "zod";

export const ThreadValidation = z.object({
  fullName: z.string().nonempty({ message: "Full name is required." }),
  phoneNo: z.string().nonempty({ message: "Phone number is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  approvalType: z.enum(["online", "offline"], { 
    required_error: "Approval type is required." 
  }),
  description: z.string().nonempty().min(3, { message: "Minimum 3 characters for description." }),
  timePeriod: z.string().nonempty({ message: "Time period is required." }),
  rewards: z.string().nonempty({ message: "Rewards field is required." }),
  accountId: z.string(),
})

export const CommentValidation = z.object({
    thread: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
})