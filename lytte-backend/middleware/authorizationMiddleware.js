import JWT from 'jsonwebtoken';
import { db } from './../Model/db.js';
export const verifyToken = (roles = []) => {
  return (req, res, next) => {
 
    const token = req.cookies.token; // Assuming the token is stored in cookies

    if (!token) return res.status(401).json({ message: 'No token found' });

    JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });

      // Check if user is from dashboardUser or vendor table
      const { email, role } = decoded;

      if (!roles.includes(role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const query = role === 'dashboardUser'
        ? "SELECT * FROM dashboardUser WHERE email = ?"
        : "SELECT * FROM vendor WHERE v_email = ?";

      db.query(query, [email], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: 'User not found' });

        // Attach user info to request object
        req.user = results[0];
        req.role = role;

        next(); // Proceed to the next middleware or route handler
      });
    });
  };
};
