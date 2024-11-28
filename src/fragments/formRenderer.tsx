"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'sonner';
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

type FormField = {
    name: string;
    type: string;
    label?: string;
    value?: string | number | boolean;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    description?: string;
};

const createValidationSchema = (fields: FormField[]) => {
    const schemaFields: Record<string, z.ZodType> = {};

    fields.forEach(field => {
        let validator: z.ZodType;

        switch (field.type) {
            case 'email':
                validator = field.required
                    ? z.string().email("Invalid email format")
                    : z.string().email("Invalid email format").optional();
                break;
            case 'number':
                validator = field.name === 'age'
                    ? (field.required
                        ? z.coerce.number({
                            errorMap: () => ({ message: "Age must be a number" })
                        }).min(1, "Age must be at least 1").max(120, "Age must be less than 120")
                        : z.coerce.number().min(1).max(120).optional())
                    : (field.required
                        ? z.coerce.number().min(1).max(100)
                        : z.coerce.number().min(1).max(100).optional());
                break;
            case 'tel':
                validator = field.required
                    ? z.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                        "Invalid phone number format")
                    : z.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                        "Invalid phone number format").optional();
                break;
            case 'checkbox':
                validator = z.boolean().optional();
                break;
            default:
                validator = field.required
                    ? z.string().trim().min(1, { message: `${field.label || field.name} is required` })
                    : z.string().optional();
        }

        schemaFields[field.name] = validator;
    });

    schemaFields['contact'] = z.string()
        .refine(value => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            return emailRegex.test(value) || phoneRegex.test(value);
        }, { message: "Please enter a valid email or phone number" });

    return z.object(schemaFields);
};

const fetchFormFields = async (): Promise<FormField[]> => {
    const response = await fetch("/api/form");
    if (!response.ok) throw new Error("Failed to fetch form fields");
    return response.json();
};

const updateFormFields = async (formData: FormField[]) => {
    const response = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Form submission failed");
    return response.json();
};

export default function Form() {
    const queryClient = useQueryClient();
    const [interactionCount, setInteractionCount] = useState<Record<string, number>>({});

    const {
        data: formFields,
        isPending,
        isError
    } = useQuery<FormField[]>({
        queryKey: ["formFields"],
        queryFn: fetchFormFields,
        staleTime: 5 * 60 * 1000,
        retry: 2
    });

    const defaultValues = useMemo(() => {
        if (!formFields) return {};
        return formFields.reduce((acc, field) => {
            acc[field.name] = field.type === 'checkbox'
                ? !!field.value
                : field.value || '';
            return acc;
        }, {} as Record<string, string | boolean>);
    }, [formFields]);

    const validationSchema = useMemo(() => {
        return formFields ? createValidationSchema(formFields) : null;
    }, [formFields]);

    const mutation = useMutation({
        mutationFn: updateFormFields,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["formFields"] });
            toast.success("Form saved successfully!", {
                icon: <CheckCircle2 className="text-green-500" />
            });
        },
        onError: () => {
            toast.error("Submission failed", {
                icon: <AlertCircle className="text-red-500" />
            });
        }
    });

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        resolver: validationSchema ? zodResolver(validationSchema) : undefined,
        mode: 'onChange',
        defaultValues,
        values: defaultValues
    });

    const age = watch('age');
    const showPhoneEmail = age && Number(age) > 18;

    const onSubmit = (data: Record<string, string | boolean>) => {
        const updatedFields = formFields?.map(field => ({
            ...field,
            value: data[field.name],
        })) || [];

        mutation.mutate(updatedFields);
    };

    const handleReset = () => {
        reset(defaultValues);
        setInteractionCount({});
    };

    const trackInteraction = (fieldName: string) => {
        setInteractionCount(prev => ({
            ...prev,
            [fieldName]: (prev[fieldName] || 0) + 1
        }));
    };

    if (isPending) return <p>Loading form...</p>;
    if (isError) return <p>Error loading form</p>;

    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 w-[400px]"
        >
            <AnimatePresence>
                {formFields?.map((field) => (
                    field.name !== 'contact' && (
                        <motion.div
                            key={field.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2"
                        >
                            <Controller
                                key={field.name}
                                name={field.name}
                                control={control}
                                render={({ field: controllerField }) => (
                                    <>
                                        {field.type === "checkbox" ? (
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    type="checkbox"
                                                    {...controllerField}
                                                    checked={!!controllerField.value}
                                                    onChange={(e) => {
                                                        controllerField.onChange(e.target.checked);
                                                        trackInteraction(field.name);
                                                    }}
                                                    className="rounded border-gray-300 text-blue-600 size-4"
                                                />
                                                <label htmlFor={field.name} className="text-sm font-medium">
                                                    {field.label || field.name}
                                                </label>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="group flex justify-between">
                                                    <label htmlFor={field.name} className="block text-sm font-medium">
                                                        {field.label || field.name}
                                                        {field.required && <span className="text-red-500">*</span>}
                                                    </label>
                                                    {interactionCount[field.name] && (
                                                        <span className="text-xs text-gray-500">
                                                            Interactions: {interactionCount[field.name]}
                                                        </span>
                                                    )}
                                                </div>
                                                <Input
                                                    {...controllerField}
                                                    type={field.type}
                                                    placeholder={field.placeholder}
                                                    value={controllerField.value || ''}
                                                    onChange={(e) => {
                                                        controllerField.onChange(e.target.value);
                                                        trackInteraction(field.name);
                                                    }}
                                                    className={`w-full p-2 border rounded-md ${errors[field.name] ? 'border-red-500' : ''
                                                        }`}
                                                />
                                                {errors[field.name] && (
                                                    <motion.p
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-xs text-red-500 mt-1"
                                                    >
                                                        {errors[field.name]?.message as string}
                                                    </motion.p>
                                                )}
                                                {field.description && (
                                                    <p className="text-xs text-gray-500">{field.description}</p>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            />
                        </motion.div>
                    )
                ))}

                {showPhoneEmail && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                    >
                        <Controller
                            name="contact"
                            control={control}
                            render={({ field: contactField }) => (
                                <div>
                                    <label htmlFor="contact" className="block text-sm font-medium mb-1">
                                        Phone or Email
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        {...contactField}
                                        type="text"
                                        placeholder="Enter phone or email"
                                        value={contactField.value || ''}
                                        onChange={(e) => {
                                            contactField.onChange(e.target.value);
                                            trackInteraction('contact');
                                        }}
                                        className={`w-full p-2 border rounded-md ${errors.contact ? 'border-red-500' : ''
                                            }`}
                                    />
                                    {errors.contact && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-xs text-red-500 mt-1"
                                        >
                                            {errors.contact?.message as string}
                                        </motion.p>
                                    )}
                                </div>
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full"
                >
                    {mutation.isPending ? (
                        <div className="flex items-center space-x-2">
                            <Loader2 className="animate-spin" />
                            <span>Submitting...</span>
                        </div>
                    ) : (
                        <span>Submit</span>
                    )}
                </Button>

                <Button
                    type="button"
                    onClick={handleReset}
                    variant="secondary"
                    className="w-full"
                >
                    Reset
                </Button>
            </div>
        </motion.form>
    );
}