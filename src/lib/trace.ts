import { NextRequest, NextResponse } from "next/server";

/**
 * Lightweight request tracing for EZinfo API routes.
 *
 * Usage:
 *   const trace = createTrace("ezinfo/apply", req);
 *   trace.info("Provisioning started", { email });
 *   trace.error("RPC failed", { error: err.message });
 *   return trace.success({ slug }, 200);
 *   return trace.fail("Invalid email", 400);
 */

function generateRequestId(): string {
    const ts = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 8);
    return `req_${ts}_${rand}`;
}

export interface Trace {
    requestId: string;
    info: (message: string, data?: Record<string, unknown>) => void;
    warn: (message: string, data?: Record<string, unknown>) => void;
    error: (message: string, data?: Record<string, unknown>) => void;
    success: (data: Record<string, unknown>, status?: number) => NextResponse;
    fail: (error: string, status?: number, extra?: Record<string, unknown>) => NextResponse;
}

export function createTrace(route: string, req: NextRequest): Trace {
    const requestId = generateRequestId();
    const method = req.method;
    const url = req.nextUrl.pathname;

    const format = (
        level: string,
        message: string,
        data?: Record<string, unknown>
    ) => {
        const entry = {
            requestId,
            route,
            level,
            message,
            method,
            url,
            ts: new Date().toISOString(),
            ...data,
        };
        return JSON.stringify(entry);
    };

    return {
        requestId,

        info(message, data) {
            console.log(format("INFO", message, data));
        },

        warn(message, data) {
            console.warn(format("WARN", message, data));
        },

        error(message, data) {
            console.error(format("ERROR", message, data));
        },

        success(data, status = 200) {
            console.log(
                format("INFO", "Request succeeded", {
                    status,
                    responseKeys: Object.keys(data),
                })
            );
            return NextResponse.json(
                { ok: true, requestId, ...data },
                { status }
            );
        },

        fail(error, status = 400, extra) {
            console.error(format("ERROR", error, { status, ...extra }));
            return NextResponse.json(
                { ok: false, error, requestId },
                { status }
            );
        },
    };
}
