import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface OTPFormValues {
  otp: string;
}

const VerifyCode = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<OTPFormValues>();
  const { username } = useParams<{ username: string }>();

  const onSubmit: SubmitHandler<OTPFormValues> = async (values) => {
    try {
      const verifyCode = values.otp;
      const response = await axios.post("/api/v1/users/verify-code", {
        username,
        verifyCode,
      });
      if (response.data.statusCode === 200) {
        navigate("/login");
        toast({
          title: "Verify OTP Successfully",
          description: response.data.message,
        });
      }
    } catch (error: any) { 
        toast({
          title: "Verify OTP Failure",
          description: error.response.data.message,
          variant: "destructive",
        });
     
      
     
    }
  };
  return (
    <div className="w-full mt-24 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="text-2xl font-bold text-center">Verify Code</div>

      <div className="mt-8 w-full flex justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="w-full flex justify-center">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <div className="flex items-center space-x-2 justify-center">
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </div>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button type="submit" className="w-full sm:w-auto">
                Submit OTP
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyCode;
