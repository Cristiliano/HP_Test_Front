import { z } from 'zod';

export const cepSchema = z.object({
  cep: z
    .string()
    .min(1, 'CEP é obrigatório')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 8, {
      message: 'CEP deve conter 8 dígitos',
    })
    .refine((val) => /^\d{8}$/.test(val), {
      message: 'CEP deve conter apenas números',
    }),
});

export type CepFormData = z.infer<typeof cepSchema>;

export const cepInputSchema = z
  .string()
  .min(1, 'CEP é obrigatório')
  .regex(/^\d{5}-?\d{3}$/, 'CEP inválido. Use o formato 00000-000');
