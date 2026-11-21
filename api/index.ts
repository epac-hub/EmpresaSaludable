import type { Request, Response } from "express";
import { createApp } from "../server/app";

const app = createApp();

export default function handler(req: Request, res: Response) {
  const pathValue = req.query.path;
  const path = Array.isArray(pathValue) ? pathValue.join("/") : pathValue;

  if (typeof path === "string") {
    const url = new URL(req.url, "http://vercel.internal");
    url.searchParams.delete("path");
    req.url = `/api/${path}${url.search}`;
  }

  return app(req, res);
}
