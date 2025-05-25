import { Request, Response, NextFunction } from 'express';

/**
 * Error handling middleware for catching and processing errors in the application.
 * @param err - The error object.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Log the error (you can use a logger utility here)
    console.error(err.stack);

    // Set the response status code and send the error message
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};

export default errorHandler;