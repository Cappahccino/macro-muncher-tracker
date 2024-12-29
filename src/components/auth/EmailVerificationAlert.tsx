import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmailVerificationAlertProps {
  onResend: () => void;
  isResending: boolean;
}

export const EmailVerificationAlert = ({
  onResend,
  isResending,
}: EmailVerificationAlertProps) => {
  return (
    <Alert className="mb-6">
      <AlertDescription className="flex flex-col gap-3">
        <p>Please verify your email address before signing in.</p>
        <Button 
          variant="outline" 
          onClick={onResend}
          disabled={isResending}
        >
          {isResending ? "Sending..." : "Resend verification email"}
        </Button>
      </AlertDescription>
    </Alert>
  );
};