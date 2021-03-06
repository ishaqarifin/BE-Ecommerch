// import package here
const jwt = require('jsonwebtoken')

// endpoint -> middleware -> controller

exports.auth = (req, res, next) => {
  // code here
  const authHeader = req.header("Authorization")
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({message: "Acces denied"})
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_KEY)
    req.user = verified
    next()
  } catch (error) {
    res.status(400).send({
      message: "Invalid token"
    })
  }

};
