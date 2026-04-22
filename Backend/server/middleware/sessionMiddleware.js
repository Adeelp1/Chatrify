import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

export const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // secure: true if HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
});
