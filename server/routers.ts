import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createContactSubmission } from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ─── Contact Form ───
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(2, "Nombre requerido"),
        email: z.string().email("Email inválido"),
        company: z.string().optional(),
        message: z.string().min(10, "Mensaje muy corto"),
      }))
      .mutation(async ({ input }) => {
        // Save to database
        await createContactSubmission(input);

        // Notify owner
        await notifyOwner({
          title: `Nuevo contacto: ${input.name}`,
          content: `Email: ${input.email}\nEmpresa: ${input.company || "No especificada"}\nMensaje: ${input.message}`,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
