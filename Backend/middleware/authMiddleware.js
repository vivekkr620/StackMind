import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // 1. Request ke header se token nikalein
  const authHeader = req.header("Authorization");

  // 2. Check  token  is available or not 
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  // 3. "Bearer " word ko hata kar sirf actual token string lein
  const token = authHeader.split(" ")[1];

  try {
    // 4. Token is verify from the secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // 5. User ki ID request object mein daal dein (jiss se aage routes me use ho sake)
    req.user = verified; 
    
    // 6. Everything is correct go ahed
    next(); 
    
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;