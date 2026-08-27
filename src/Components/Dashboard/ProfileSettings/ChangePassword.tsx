import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@/schemas/auth";
import { FieldError, FieldGroup } from "@/Components/ui/field";
import { FormPassword } from "@/Components/ui/CustomUi/ReuseForm/Form";
import z from "zod";
import { Button } from "@/Components/ui/button";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import Cookies from "js-cookie";


const ChangePassword = () => {
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { watch } = form;
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Show error if passwords don't match
  const confirmPasswordError = password !== confirmPassword;

  const [updatePassword] = useChangePasswordMutation();

  const onFinish = async (data: z.infer<typeof changePasswordSchema>) => {
    const values = {
      oldPassword: data.currentPassword,
      newPassword: data.confirmPassword,
    };

    const res = await tryCatchWrapper(
      updatePassword,
      { body: values },
      "Changing Password..."
    );
    if (res?.statusCode === 200) {
      Cookies.remove("photoop_accessToken");

      window.location.href = "/sign-in";
      window.location.reload();
    }
  };
  return (
    <div className="max-w-xl mt-20">
      <form onSubmit={form.handleSubmit(onFinish)}>
        <FieldGroup>
          <FormPassword
            control={form.control}
            name="currentPassword"
            label="Current Password"
            placeholder="Enter your current password"
          />
          <FormPassword
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your new password"
          />
          <FormPassword
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your new password"
          />

          {/* Show error message immediately if passwords don't match */}
          {confirmPasswordError && (
            <FieldError errors={[{ message: "Passwords don't match" }]} />
          )}

          <Button className="py-5 text-base" type="submit">Change Password</Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default ChangePassword;
