'use client';

import { formHandler } from "@/components/formBuilder/server";
import { useMemo, useState } from "react";

function getInitialValues(fields) {
    return fields.reduce((acc, field) => {
        if (field.type === "checkbox") {
            acc[field.name] = Boolean(field.defaultValue);
            return acc;
        }

        acc[field.name] = field.defaultValue ?? "";
        return acc;
    }, {});
}

function normalizeValidationResult(result, fallbackMessage) {
    if (result === true || result === undefined || result === null) {
        return "";
    }

    if (result === false) {
        return fallbackMessage;
    }

    if (typeof result === "string") {
        return result;
    }

    return fallbackMessage;
}

export default function FormBuilder({
    title,
    afterText,
    fields = [],
    data,
    className,
    method = "POST",
    submitLabel = "Submit",
    successMessage = "Form submitted successfully.",
}) {
    const initialValues = useMemo(() => getInitialValues(fields), [fields]);

    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const validateField = (field, value, allValues) => {
        if (field.required) {
            const isEmptyValue =
                field.type === "checkbox" ? !value : String(value ?? "").trim().length === 0;

            if (isEmptyValue) {
                return `${field.label || field.name} is required.`;
            }
        }

        if (typeof field.check === "function") {
            return normalizeValidationResult(
                field.check(value, allValues),
                field.errorMessage || `${field.label || field.name} is not valid.`
            );
        }

        return "";
    };

    const validateForm = (values) => {
        const nextErrors = {};

        for (const field of fields) {
            const errorMessage = validateField(field, values[field.name], values);
            if (errorMessage) {
                nextErrors[field.name] = errorMessage;
            }
        }

        return nextErrors;
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        const nextValue = type === "checkbox" ? checked : value;

        setFormData((prev) => {
            const nextValues = {
                ...prev,
                [name]: nextValue,
            };

            const targetField = fields.find((field) => field.name === name);
            if (targetField) {
                const fieldError = validateField(targetField, nextValue, nextValues);
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: fieldError,
                }));
            }

            return nextValues;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitError("");
        setIsSuccess(false);

        const validationErrors = validateForm(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        // if (!endpoint) {
        //     setSubmitError("Missing endpoint for form submission.");
        //     return;
        // }

        try {
            setIsSubmitting(true);

            formHandler({
                ...data,
                data: formData,
            });

            setIsSuccess(true);
            setFormData(initialValues);
            setErrors({});
        } catch (error) {
            setSubmitError(error.message || "Unable to submit form.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderField = (field) => {
        const fieldValue = formData[field.name];
        const commonProps = {
            id: field.name,
            name: field.name,
            required: field.required,
            onChange: handleChange,
            className: "w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 outline-none transition focus:border-emerald-600",
        };

        const helperText = field.helperText || (field.type === "checkbox" ? field.label : "");

        if (field.type === "header") {
            return (
                <div className="mt-10">
                    <p className="text-2xl font-semibold">{field.label}</p>
                </div>
            );
        }

        if (field.type === "paragraph") {
            return (
                <div className="mt-2">
                    <p className="text-neutral-700">{field.label}</p>
                </div>
            );
        }

        if (field.type === "textarea") {
            return (
                <div>
                    {helperText && <p className="text-sm text-neutral-500">{helperText}</p>}
                    <textarea
                        {...commonProps}
                        value={fieldValue}
                        placeholder={field.placeholder || ""}
                        rows={field.rows || 4}
                    />
                </div>
            );
        }

        if (field.type === "select") {
            return (
                <div>
                    {helperText && <p className="text-sm text-neutral-500">{helperText}</p>}
                    <select {...commonProps} value={fieldValue}>
                        {(field.options || []).map((option) => {
                            const normalizedOption =
                                typeof option === "string"
                                    ? { label: option, value: option }
                                    : option;

                            return (
                                <option key={normalizedOption.value} value={normalizedOption.value}>
                                    {normalizedOption.label}
                                </option>
                            );
                        })}
                    </select>
                </div>
            );
        }

        if (field.type === "checkbox") {
            return (
                <label htmlFor={field.name} className="flex items-center gap-2 text-neutral-700">
                    <input
                        id={field.name}
                        name={field.name}
                        type="checkbox"
                        checked={Boolean(fieldValue)}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-neutral-300 text-emerald-700"
                    />
                    <span>{field.checkboxLabel || field.label}</span>
                </label>
            );
        }

        return (
            <div>
                {helperText && <p className="text-sm text-neutral-500">{helperText}</p>}
                <input
                    {...commonProps}
                    type={field.type || "text"}
                    value={fieldValue}
                    placeholder={field.placeholder || ""}
                />
            </div>
        );
    };

    return (
        <div className={className || "w-full rounded-2xl border border-neutral-200 p-5 shadow-sm "}>
            {title && <h3 className="mb-4 text-2xl font-semibold text-neutral-900">{title}</h3>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                    <div key={field.name} className="space-y-1">
                        {!["checkbox", "header", "paragraph"].includes(field.type) && (
                            <label htmlFor={field.name} className="block  font-medium text-neutral-700">
                                {field.label || field.name}
                                {
                                    field.required && <span className="text-gray-400"> *</span>
                                }
                            </label>
                        )}
                        {renderField(field)}
                        {errors[field.name] && (
                            <p className=" text-red-600">{errors[field.name]}</p>
                        )}
                    </div>
                ))}

                {submitError && (
                    <p className="rounded-lg bg-red-50 px-3 py-2  text-red-700">{submitError}</p>
                )}

                {isSuccess && (
                    <p className="rounded-lg bg-emerald-50 px-3 py-2  text-emerald-700">{successMessage}</p>
                )}

                <div className="w-full py-5 flex justify-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary max-w-4xl w-full disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Submitting..." : submitLabel}
                    </button>
                </div>
            </form>

            {afterText && <p className="mt-4  text-neutral-600">{afterText}</p>}
        </div>
    );
}
