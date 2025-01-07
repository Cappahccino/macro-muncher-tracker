import { useToast } from "@/hooks/use-toast";

export function useRecipeToast() {
  const { toast } = useToast();

  const showSuccessToast = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  const showErrorToast = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  return {
    showSuccessToast,
    showErrorToast,
  };
}