"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getPathname } from "@/utils/other";
import { handleSignIn, handleSignUp } from "@/components/auth/server";
import Image from "next/image";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthForm(props = {}) {
    const pathname = getPathname(props?.params?.slug || []);
    const authType = props?.mode || (pathname === "auth/signin" ? "signin" : "signup");
    // console.log('pathname: ', pathname);
    // console.log('authType: ', authType);


    const isSignIn = authType === "signin";

    const initialValues = useMemo(
        () => ({
            email: "",
            password: "",
            confirmPassword: "",
            remember: true,
        }),
        []
    );

    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const nextErrors = {};

        if (!formData.email || !emailRegex.test(formData.email)) {
            nextErrors.email = "Please enter a valid email address.";
        }

        if (!formData.password || formData.password.length < 6) {
            nextErrors.password = "Password must be at least 6 characters long.";
        }

        if (!isSignIn && formData.confirmPassword !== formData.password) {
            nextErrors.confirmPassword = "Passwords do not match.";
        }



        return nextErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setSuccessMessage("");
            return;
        }

        setIsSubmitting(true);
        setSuccessMessage("");

        try {
            const payload = {
                email: formData.email,
                password: formData.password,
                type: authType,
            };

            if (typeof props.onSubmit === "function") {
                await props.onSubmit(payload);
            }

            const responseObj = isSignIn
                ? await handleSignIn(payload)
                : await handleSignUp(payload);


            if (!responseObj.success) {
                setErrors({ submit: responseObj.message || "Something went wrong. Please try again." });
                return;
            }

            setSuccessMessage(
                isSignIn ? "Signed in successfully." : "Account created successfully."
            );
            setFormData(initialValues);
        } catch (error) {
            setErrors({
                submit: error?.message || "Something went wrong. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const title = isSignIn ? "Sign in" : "Create account";
    const subtitle = isSignIn
        ? "Welcome back. Enter your details to continue."
        : "Create your account to get started.";

    const switchLink = isSignIn ? "/auth/signup" : "/auth/signin";
    const switchText = isSignIn ? "Need an account? Sign up" : "Already have an account? Sign in";

    return (
        <div className="">
            <div className="mx-auto w-full max-w-md rounded-2xl border border-accent/30 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 text-center">
                    <h1 className="mt-3 text-3xl font-bold text-slate-900">{title}</h1>
                    <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={(event) => updateField("email", event.target.value)}
                            className="w-full rounded-xl border border-accent/30 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={isSignIn ? "current-password" : "new-password"}
                            value={formData.password}
                            onChange={(event) => updateField("password", event.target.value)}
                            className="w-full rounded-xl border border-accent/30 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>

                    {!isSignIn && (
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                                Confirm password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={(event) => updateField("confirmPassword", event.target.value)}
                                className="w-full rounded-xl border border-accent/30 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20"
                                placeholder="Repeat your password"
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>
                    )}

                    {isSignIn && (
                        <div className="flex items-center justify-between gap-3 text-sm">
                            <label className="flex items-center gap-2 text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={formData.remember}
                                    onChange={(event) => updateField("remember", event.target.checked)}
                                    className="h-4 w-4 rounded border-accent text-accent focus:ring-accent"
                                />
                                Remember me
                            </label>

                            <Link href="/auth/forgot-password" className="font-medium text-accent hover:text-accent/80">
                                Forgot password?
                            </Link>
                        </div>
                    )}

                    {errors.submit && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {errors.submit}
                        </div>
                    )}

                    {successMessage && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                            {successMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? (isSignIn ? "Signing in..." : "Creating account...") : title}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    <Link href={switchLink} className="font-medium text-accent hover:text-accent/80">
                        {switchText}
                    </Link>
                </div>




            </div>
            <div className="max-w-80 sm:max-w-96 opacity-55 text-center px-4 m-auto py-10">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Legal & Account Information
                </h4>
                <p className="text-xs leading-relaxed text-slate-500 font-normal">
                    By continuing, you agree to our{" "}
                    <Link href="/terms-and-conditions/" className="underline hover:text-slate-800 transition-colors">
                        Terms and Conditions
                    </Link>
                    ,{" "}
                    <Link href="/privacy-policy/" className="underline hover:text-slate-800 transition-colors">
                        Privacy Policy
                    </Link>
                    , and{" "}
                    <Link href="/cookie-policy/" className="underline hover:text-slate-800 transition-colors">
                        Cookie Policy
                    </Link>
                    . Access to course materials, safety certifications, and progress tracking requires an active account. Registered users receive access to interactive training modules, automated record tracking, and completion verification. For enterprise fleet management or bulk account provisioning assistance, contact our support team.
                </p>
            </div>
        </div>
    );
}