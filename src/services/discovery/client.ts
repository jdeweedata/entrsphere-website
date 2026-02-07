// Convex client initialization for discovery services

import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
