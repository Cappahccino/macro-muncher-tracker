import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      if (!userData.name) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please complete the onboarding process first",
        });
        navigate("/onboarding");
        return;
      }

      // First sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: userData.name,
          },
        },
      });

      if (authError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: authError.message,
        });
        return;
      }

      if (!authData.user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create user account",
        });
        return;
      }

      // Create the user profile
      const { error: profileError } = await supabase
        .from("users")
        .insert({
          user_id: authData.user.id,
          email: values.email,
          username: values.email.split("@")[0],
          date_of_birth: userData.dob,
          gender: userData.gender,
          height_cm: userData.height,
          weight_kg: userData.weightUnit === "kg" 
            ? userData.currentWeight 
            : userData.weightUnit === "lbs"
            ? userData.currentWeight * 0.453592
            : userData.currentWeight * 6.35029,
          activity_level: userData.activityLevel,
          preferred_weight_unit: userData.weightUnit,
          preferred_height_unit: "cm",
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create user profile",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Your account has been created. Please check your email to verify your account.",
      });

      // Sign in the user immediately after signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Account created but couldn't sign in automatically. Please sign in manually.",
        });
        navigate("/sign-in");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={() => navigate("/sign-in")}>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your email and create a password to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;