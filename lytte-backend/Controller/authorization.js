import { db } from "./../Model/db.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "Enter email" });
  if (!password) return res.status(400).json({ message: "Enter password" });

  // Check dashboardUser table
  db.query(
    "SELECT * FROM dashboardUser WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.log("error in login", err);
        return res.status(500).json({ message: "Error in login", error: err });
      }

      if (results.length > 0) {
        const user = results[0];
        const databasePassword = user.password;

        if (databasePassword === password) {
          // Create JWT with role included
          const token = JWT.sign(
            {
              email: user.email,
              role: "dashboardUser", // Role for dashboardUser
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );

          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
          return res.status(200).json({ message: "Login successful" ,user:{role: "dashboardUser"}});
        } else {
          return res.status(400).json({ message: "Wrong credentials" });
        }
      } else {
        // Check vendor table
        db.query(
          "SELECT * FROM vendor WHERE v_email = ?",
          [email],
          (err, results) => {
            if (err) {
              console.log("error in login", err);
              return res
                .status(500)
                .json({ message: "Error in login", error: err });
            }

            if (results.length > 0) {
              const vendor = results[0];
              const databasePassword = vendor.v_password;

              if (databasePassword === password) {
                // Create JWT with role included
                const token = JWT.sign(
                  {
                    email: vendor.v_email,
                    role: "vendor", // Role for vendor
                    name: vendor.v_name,
                    Id: vendor.v_id,
                  },
                  process.env.JWT_SECRET,
                  { expiresIn: "7d" }
                );

                res.cookie("token", token, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                });
                return res
                  .status(200)
                  .json({
                    message: "Login successful",
                    user: {
                      email: vendor.v_email,
                      role: "vendor",
                      name: vendor.v_name,
                      Id: vendor.v_id,
                    },
                  });
              } else {
                return res.status(400).json({ message: "Wrong credentials" });
              }
            } else {
              return res.status(400).json({ message: "User not found" });
            }
          }
        );
      }
    }
  );
};

export const checkAuth = (req, res) => {
  const token = req.cookies.token; // Assuming the token is stored in cookies

  if (!token) return res.status(401).json({ message: "No token found" });

  JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    // Check if user is from dashboardUser or vendor table
    if (decoded.role === "dashboardUser") {
      db.query(
        "SELECT * FROM dashboardUser WHERE email = ?",
        [decoded.email],
        (err, results) => {
          if (err || results.length === 0)
            return res.status(401).json({ message: "User not found" });

          const user = results[0];
          res.status(200).json({
            user: {
              email: user.email,
              role: "dashboardUser",
            },
          });
        }
      );
    } else if (decoded.role === "vendor") {
      db.query(
        "SELECT * FROM vendor WHERE v_email = ?",
        [decoded.email],
        (err, results) => {
          if (err || results.length === 0)
            return res.status(401).json({ message: "User not found" });

          const vendor = results[0];
          res.status(200).json({
            user: {
              email: vendor.v_email,
              Id: vendor.v_id,
              role: "vendor",
              name: vendor.v_name,
            },
          });
        }
      );
    } else {
      res.status(401).json({ message: "Invalid role" });
    }
  });
};

export const logout = (req, res) => {
  // Clear the authentication token from the cookies
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successful" });
};


export const changePassword = (req, res) => {
  const { oldpassword, newPassword } = req.body;
  const id = req.params.id;
  console.log(req.body)
  if (!oldpassword) return res.status(400).json({ message: "Enter Old password" });
  if (!newPassword) return res.status(400).json({ message: "Enter New password" });

  db.beginTransaction((err) => {
    if (err) {
      console.log("error in password change", err);
      return res.status(500).json({ message: "error in password change", Error: err });
    }

    const sql = "SELECT v_password FROM vendor WHERE v_id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.log("error in fetching data from Vendor", err);
        return db.rollback(() => {
          res.status(500).json({ message: "error in fetching data from Vendor", error: err });
        });
      } else {
        const password = results[0].v_password;
        if (password === oldpassword) {
          db.query("UPDATE vendor SET v_password = ? WHERE v_id = ?", [newPassword, id], (err, results) => {
            if (err) {
              console.log("error in saving data", err);
              return db.rollback(() => {
                res.status(500).json({ message: "Error saving data", error: err });
              });
            } else {
              db.commit((err) => {
                if (err) {
                  console.log("Error committing transaction: ", err);
                  return db.rollback(() => {
                    res.status(500).json({ message: "Error committing transaction", error: err });
                  });
                } else {
                  return res.status(200).json({ message: "Password changed successfully" });
                }
              });
            }
          });
        } else {
          return res.status(401).json({ message: "Wrong password" });
        }
      }
    });
  });
};


export const intrestedVendor = (req,res)=>{
  const {name,email,mobile} = req.body;
  const sql = "insert into interested_vendor(v_name,v_mobile,v_email) values (?,?,?);";
  db.query(sql,[name,mobile,email],(err,result)=>{
    if(err)
    {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "data saved",data:result});
  })
};
export const getIntrestedVendor = (req,res)=>{

  const sql = "select * from interested_vendor order by create_at desc";
  db.query(sql,(err,result)=>{
    if(err)
    {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "data",data:result});
  })
};

export const newVendorCount = (req,res)=>{

  const sql = "select count(*) as count from interested_vendor where nofity = ?;";
  db.query(sql,[1],(err,result)=>{
    if(err)
    {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "data",data:result[0]});
  })
};

export const ChangeNotifyStatus = (req,res)=>{
  const sql = "update interested_vendor set nofity = ?";
  db.query(sql,[0],(err,result)=>{
    if(err)
    {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "data",data:result[0]});
  })
};