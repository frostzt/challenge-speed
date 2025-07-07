import express from 'express';

/**
 *  Global error handler catches everything and returns a specific message
 */
export function globalErrorHandler(err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction): void {
    console.error('Global error handler returned error', err);
    res.status(500).json({message: "Something went wrong..."});
}
