import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import useLanguageStore from "@/api/store/language-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/common/components/ui/form";
import { CircleAlert, Mail } from "lucide-react";

const ForgotPasswordDialog = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const [open, setOpen] = useState(false);

  const resetPassSchema = z.object({
    email: z.string().email(t("auth.emailError")).min(1, t("auth.fieldRequired")),
  });

  const form = useForm({
    resolver: zodResolver(resetPassSchema),
    defaultValues: {    
      email: "",
    },
  });

  const handleSubmit = (data) => {
    console.log("Correo enviado a:", data.email);
    toast.success(currentLanguage === "en" ? "Email sent. Check your inbox" : "Correo enviado. Revisa tu bandeja de entrada");
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-blueWakiFix leading-5 hover:underline"
        >
          {t("auth.forgotPassword")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-80 rounded-[9px] p-3">
        <DialogHeader>
          <DialogTitle className="text-left">
            {t("auth.forgotPasswordTitle")}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-x-2 items-center">
          <div className="w-7">
            <CircleAlert className="w-6 h-auto text-purpleWaki" />
          </div>
          <p className="text-[11px] text-left leading-4">
          {t("auth.forgotPasswordDescription")}
          </p>
        </div>
        
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4"
          >
           <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative border-b border-blueWaki">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blueWaki" size={20} />
                      <Input
                        id="email"
                        type="email"
                        {...field}
                        className="w-full pl-10 pr-4 py-2 border-none rounded-md focus:outline-none focus-visible:ring-0 shadow-none"
                        autoComplete="on"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="px-4 py-2 w-full bg-purpleWaki hover:bg-purple-700"
            >
              {t("auth.resetPassword")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;