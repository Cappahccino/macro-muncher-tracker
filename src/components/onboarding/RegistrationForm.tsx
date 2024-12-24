import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>
          Complete your registration to save your preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0f172a',
                  brandAccent: '#334155'
                }
              }
            }
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/dashboard`}
          view="sign_up"
        />
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;