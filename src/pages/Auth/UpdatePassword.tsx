"use client";
import { Button } from "@/Components/ui/button";
import Container from "@/Components/ui/CustomUi/Container";
import { FormPassword } from "@/Components/ui/CustomUi/ReuseForm/Form";
import { FieldError, FieldGroup } from "@/Components/ui/field";
import useUserData from "@/hooks/useUserData";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdPassword } from "react-icons/md";
import { RiKey2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import z from "zod";


const changePassSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
});

const UpdatePassword = () => {
    const form = useForm({
        resolver: zodResolver(changePassSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });


    const { watch } = form;
    const password = watch("password");
    const confirmPassword = watch("confirmPassword");

    // Show error if passwords don't match
    const confirmPasswordError = password !== confirmPassword;

    const router = useNavigate();
    const userExist = useUserData();
    const [resetPassword] = useResetPasswordMutation();

    useEffect(() => {
        if (userExist?.role === "admin") {
            router("/", { replace: true });
        }
    }, [router, userExist]);

    const onFinish = async (data: z.infer<typeof changePassSchema>) => {
        const value = {
            newPassword: data.password,
            confirmPassword: data.confirmPassword,
        };

        const res = await tryCatchWrapper(
            resetPassword,
            { body: value },
            "Changing Password..."
        );
        if (res?.statusCode === 200) {
            form.reset();
            Cookies.remove("minoDashboard_forgetOtpMatchToken");
            router("/sign-in");
        }
    };
    return (
        <div className="text-base-color">
            <Container>
                <div className="min-h-screen flex justify-center items-center ">
                    <div className="w-full max-w-150 mx-auto bg-highlight-color p-6 rounded-2xl">
                        <div className="mb-8">
                            <div className="bg-[#0C0C0C0D] w-fit mx-auto p-2 rounded-full  mb-4">
                                <RiKey2Line className="size-10 text-base-color mx-auto" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-semibold text-base-color mb-5 text-center">
                                Create new password
                            </h1>
                            <p className=" sm:text-lg mb-2 text-base-color text-center">
                                Your new password must be different to previously used passwords.
                            </p>
                        </div>

                        <form onSubmit={form.handleSubmit(onFinish)}>
                            <FieldGroup>

                                <FormPassword
                                    prefix={<MdPassword size={20} />}
                                    control={form.control}
                                    name="password"
                                    label="Password"
                                    placeholder="Enter new password"
                                />
                                <FormPassword
                                    prefix={<MdPassword size={20} />}
                                    control={form.control}
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    placeholder="Confirm new password"
                                />

                                {/* Show error message immediately if passwords don't match */}
                                {confirmPasswordError && (
                                    <FieldError errors={[{ message: "Passwords don't match" }]} />
                                )}

                                <Button className="py-5 text-base" type="submit">Proceed</Button>
                            </FieldGroup>
                        </form>
                    </div>
                </div>
            </Container >
        </div >
    );
};
export default UpdatePassword;
