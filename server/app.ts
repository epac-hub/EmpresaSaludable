import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express, { type Express, type RequestHandler } from "express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { registerOAuthRoutes } from "./_core/oauth";
import { registerStorageProxy } from "./_core/storageProxy";

const DEFAULT_PRODUCTION_ORIGIN = "https://empresasaludable.com";

type CreateAppOptions = {
  allowedOrigins?: string[];
};

function configuredOrigins() {
  const configured = process.env.APP_ORIGIN?.split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

  return configured?.length ? configured : [DEFAULT_PRODUCTION_ORIGIN];
}

function apiSecurity(allowedOrigins: Set<string>): RequestHandler {
  return (req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Frame-Options", "DENY");

    const origin = req.get("origin");
    if (!origin) {
      next();
      return;
    }

    if (!allowedOrigins.has(origin)) {
      res.status(403).json({ error: "Origin not allowed" });
      return;
    }

    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.vary("Origin");

    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }

    next();
  };
}

export function configureApp(
  app: Express,
  options: CreateAppOptions = {}
): Express {
  const allowedOrigins = new Set(options.allowedOrigins ?? configuredOrigins());

  app.set("trust proxy", 1);
  app.use("/api", apiSecurity(allowedOrigins));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ limit: "1mb", extended: true }));

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
}

export function createApp(options: CreateAppOptions = {}) {
  return configureApp(express(), options);
}
