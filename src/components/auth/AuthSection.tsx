import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const AuthSection = () => {
  return (
    <div className="p-4">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={[]}
        localization={{
          variables: {
            sign_in: {
              email_label: "Email",
              password_label: "Пароль",
              button_label: "Войти",
              loading_button_label: "Вход...",
            },
            sign_up: {
              email_label: "Email",
              password_label: "Пароль",
              button_label: "Зарегистрироваться",
              loading_button_label: "Регистрация...",
            },
          },
        }}
      />
    </div>
  );
};