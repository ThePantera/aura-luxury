"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre completo"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(6, "Ingresá un teléfono de contacto"),
  address: z.string().optional(),
  city: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm({ onValid }: { onValid: (values: CheckoutFormValues) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutSchema) });

  return (
    <form onSubmit={handleSubmit(onValid)} id="checkout-form" className="space-y-3">
      <div>
        <input
          {...register("name")}
          placeholder="Nombre completo"
          className="w-full rounded-xl p-2.5 text-sm bg-luxury-surface border border-white/10 text-luxury-warm placeholder:text-luxury-muted focus:outline-none focus:border-luxury-gold"
        />
        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full rounded-xl p-2.5 text-sm bg-luxury-surface border border-white/10 text-luxury-warm placeholder:text-luxury-muted focus:outline-none focus:border-luxury-gold"
        />
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <input
          {...register("phone")}
          placeholder="Teléfono"
          className="w-full rounded-xl p-2.5 text-sm bg-luxury-surface border border-white/10 text-luxury-warm placeholder:text-luxury-muted focus:outline-none focus:border-luxury-gold"
        />
        {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
      </div>
      <input
        {...register("address")}
        placeholder="Dirección (si elegís envío)"
        className="w-full rounded-xl p-2.5 text-sm bg-luxury-surface border border-white/10 text-luxury-warm placeholder:text-luxury-muted focus:outline-none focus:border-luxury-gold"
      />
      <input
        {...register("city")}
        placeholder="Ciudad"
        className="w-full rounded-xl p-2.5 text-sm bg-luxury-surface border border-white/10 text-luxury-warm placeholder:text-luxury-muted focus:outline-none focus:border-luxury-gold"
      />
    </form>
  );
}
