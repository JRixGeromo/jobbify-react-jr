/**
 * Form validation hooks and schemas using React Hook Form and Zod
 * Provides type-safe form validation with custom error messages
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * Creates a form validation hook with the provided Zod schema
 * @param schema Zod validation schema
 * @returns React Hook Form instance with Zod validation
 */
export const createFormValidation = <T extends z.ZodType>(schema: T) => {
  return useForm({
    resolver: zodResolver(schema),
  });
};

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number');
export const requiredString = z.string().min(1, 'This field is required');
export const positiveNumber = z.number().positive('Must be a positive number');

/**
 * Client form validation schema
 * Validates client contact information
 */
export const clientSchema = z.object({
  firstName: requiredString,
  lastName: requiredString,
  email: emailSchema,
  phone: phoneSchema,
  address: requiredString,
});

/**
 * Quote form validation schema
 * Validates quote details and line items
 */
export const quoteSchema = z.object({
  client: requiredString,
  service: requiredString,
  date: requiredString,
  dueDate: requiredString,
  items: z.array(
    z.object({
      description: requiredString,
      quantity: positiveNumber,
      unitPrice: positiveNumber,
      taxable: z.boolean(),
    })
  ),
  notes: z.string(),
  terms: z.string(),
});

/**
 * Invoice form validation schema
 * Validates invoice details and line items
 */
export const invoiceSchema = z.object({
  client: requiredString,
  service: requiredString,
  date: requiredString,
  dueDate: requiredString,
  items: z.array(
    z.object({
      description: requiredString,
      quantity: positiveNumber,
      unitPrice: positiveNumber,
      taxable: z.boolean(),
    })
  ),
  notes: z.string(),
  terms: z.string(),
});
