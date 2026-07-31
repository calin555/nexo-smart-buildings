import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Autentificare necesară.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Nu aveți permisiunea necesară.") {
    super(message, 403, "FORBIDDEN");
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof ZodError) {
    return Response.json({ error: "Date de intrare invalide." }, { status: 400 });
  }

  if (error instanceof AppError) {
    return Response.json({ error: error.message, code: error.code }, { status: error.statusCode });
  }

  console.error("Unexpected request error", error);
  return Response.json({ error: "A apărut o eroare neașteptată." }, { status: 500 });
}
