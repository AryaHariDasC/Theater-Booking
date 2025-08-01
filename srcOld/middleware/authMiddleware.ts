import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Itheater } from '../interface/theaterInterface';
import { JwtPayload } from '../interface/screenInterface';

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        // Only use Authorization header, no cookies
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'No token provided in Authorization header' });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET as string) as JwtPayload;

        // Attach decoded user info to req
        (req as any).user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
};



// const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';

// export const authorizeRoles = (allowedRoles: string[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized: Token missing' });
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//       // Decode and verify token
//       const decoded = jwt.verify(token, JWT_SECRET) as { role: string };

//       if (!decoded.role || !allowedRoles.includes(decoded.role)) {
//         return res.status(403).json({ message: 'Access denied: insufficient role' });
//       }

//       // Role is authorized
//       next();
//     } catch (error) {
//       return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//     }
//   };
// };


