import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { handleAuthError } from "@/utils/authErrors";
import { SignInForm } from "@/components/auth/SignInForm";
import { EmailVerificationAlert } from "@/components/auth/EmailVerificationAlert";
import type { z } from "zod";

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  const handleResendVerification = async (email: string) => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your email address",
      });
      return;
    }

    try {
      setResendingEmail(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Verification email has been resent. Please check your inbox.",
      });
    } catch (error) {
      console.error("Error resending verification:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend verification email. Please try again later.",
      });
    } finally {
      setResendingEmail(false);
    }
  };

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setEmailNotVerified(false);
      setSignInError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        const errorMessage = handleAuthError(error);
        if (errorMessage === "Email not confirmed") {
          setEmailNotVerified(true);
          return;
        }
        
        setSignInError(errorMessage);
        return;
      }

      if (data.user) {
        toast({
          title: "Success",
          description: "Successfully signed in",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setSignInError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailNotVerified && (
            <EmailVerificationAlert
              onResend={() => handleResendVerification(email)}
              isResending={resendingEmail}
            />
          )}

          {signInError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{signInError}</AlertDescription>
            </Alert>
          )}
          
          <SignInForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            onSignUpClick={() => navigate("/sign-up")}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;