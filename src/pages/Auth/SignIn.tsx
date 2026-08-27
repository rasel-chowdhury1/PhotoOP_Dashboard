import { Button } from "@/Components/ui/button";
import Container from "@/Components/ui/CustomUi/Container";
import {
    FormInput,
    FormPassword,
} from "@/Components/ui/CustomUi/ReuseForm/Form";
import { FieldGroup } from "@/Components/ui/field";
import useUserData from "@/hooks/useUserData";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineEmail, MdPassword } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

import logo from "/images/logo-large.png";
import signInImage from "../../../public/authImages/signIn.png";

const signInSchema = z.object({
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

const SignIn = () => {
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useNavigate();

    const [login] = useLoginMutation();

    const userExist = useUserData();

    useEffect(() => {
        if (userExist?.role === "admin") {
            router("/", { replace: true });
        }
    }, [router, userExist]);

    const onFinish = async (data: z.infer<typeof signInSchema>) => {
        const res = await tryCatchWrapper(
            login,
            { body: data },
            "Logging In..."
        );

        if (
            res?.statusCode === 200 &&
            res?.data?.user?.role === "admin"
        ) {
            Cookies.remove("photoop_forgetToken");
            Cookies.remove("photoop_forgetEmail");
            Cookies.remove("photoop_forgetOtpMatchToken");

            Cookies.set(
                "photoop_accessToken",
                res?.data?.accessToken,
                {
                    path: "/",
                    expires: 365,
                    secure: false,
                }
            );

            form.reset();

            router("/", { replace: true });
        } else if (
            res?.statusCode === 200 &&
            res?.data?.user?.role !== "admin"
        ) {
            form.reset();

            toast.error("Access Denied", {
                duration: 2000,
            });
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#28314e]">
            <Container>
                <div className="min-h-screen flex items-center justify-center py-8">
                    <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">

                        {/* ================= LEFT SIDE ================= */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src={logo}
                                    alt="PhotoOp Logo"
                                    className="w-60 sm:w-72 lg:w-80 object-contain mb-6"
                                />

                                <img
                                    src={signInImage}
                                    alt="Sign In"
                                    className="w-64 sm:w-72 lg:w-80 object-contain"
                                />
                            </div>
                        </div>

                        {/* ================= DIVIDER ================= */}
                        <div className="hidden lg:block w-px h-100 bg-[#6b7280]/40" />

                        {/* ================= RIGHT SIDE ================= */}
                        <div className="w-full lg:w-1/2 max-w-xl">
                            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10">

                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-[#28314e] text-3xl sm:text-4xl font-bold mb-3">
                                        Login to Account
                                    </h1>

                                    <p className="text-[#6b7280] text-base sm:text-lg">
                                        Please enter your email and password
                                        to continue.
                                    </p>
                                </div>

                                {/* Form */}
                                <form
                                    onSubmit={form.handleSubmit(onFinish)}
                                >
                                    <FieldGroup>

                                        {/* Email */}
                                        <FormInput
                                            prefix={
                                                <MdOutlineEmail
                                                    size={20}
                                                    className="text-[#28314e]"
                                                />
                                            }
                                            control={form.control}
                                            name="email"
                                            label="Email"
                                            placeholder="Enter your email"
                                        />

                                        {/* Password */}
                                        <FormPassword
                                            prefix={
                                                <MdPassword
                                                    size={20}
                                                    className="text-[#28314e]"
                                                />
                                            }
                                            control={form.control}
                                            name="password"
                                            label="Password"
                                            placeholder="Enter your password"
                                        />

                                        {/* Forgot Password */}
                                        <div className="flex justify-end -mt-2">
                                            <Link
                                                to="/forgot-password"
                                                className="text-[#e53935] hover:text-[#28314e] font-medium text-sm transition-colors"
                                            >
                                                Forgot Password?
                                            </Link>
                                        </div>

                                        {/* Sign In Button */}
                                        <Button
                                            className="w-full h-12 mt-2 bg-[#e53935] hover:bg-[#28314e] text-white font-semibold text-base rounded-lg transition-colors cursor-pointer"
                                            type="submit"
                                        >
                                            Sign In
                                        </Button>

                                    </FieldGroup>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default SignIn;