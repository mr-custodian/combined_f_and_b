import { db } from "../Model/db.js";
import { upload } from "../middleware/multer.js";

export const allAgent = (req, res) => {
  const sql = "select * from Delivery_agent";
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Error in getting All delivery");
      return res
        .status(500)
        .json({ message: "error in getting delivery agent", error: err });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "request succesfull", data: results });
    }
  });
};

export const agentDetail = (req, res) => {
  const id = req.params.id;
  const sql = "select * from Delivery_agent where d_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.log("Error in getting detail of delivery");
      return res
        .status(500)
        .json({ message: "Error in getting detail of delivery", error: err });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "request succesfull", data: results });
    }
  });
};
export const deleteAgent = (req, res) => {
  const id = req.params.id;
  const sql = "delete from Delivery_agent where d_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.log("Error in deleting delivery agent");
      return res
        .status(500)
        .json({ message: "Error in deleting delivery agent", error: err });
    } else {
      return res
        .status(200)
        .json({
          success: true,
          message: "delevery agent deleted",
          data: results,
        });
    }
  });
};
export const addAgent = (req, res) => {
  upload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "pdfFile", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      console.log("Error uploading files: ", err);
      return res.status(500).json({ message: "Error uploading files" });
    } else {
      const {
        password,
        personName,
        phoneNumber,
        email,
        companyName,
        address,
        location,
      } = req.body;
      
      if (!personName)
        return res.status(400).json({ message: "personName required" });
      if (!phoneNumber)
        return res.status(400).json({ message: "phoneNumber required" });
      if (!email) return res.status(400).json({ message: "email required" });
      if (!companyName)
        return res.status(400).json({ message: "companyName required" });
      if (!address)
        return res.status(400).json({ message: "address required" });

      const imageFile = req.files["imageFile"]
        ? req.files["imageFile"][0].key
        : null;
      const pdfFile = req.files["pdfFile"] ? req.files["pdfFile"][0].key : null;
      console.log(imageFile);
      const sql =
        "INSERT INTO Delivery_agent (d_password, d_name, d_mobile, d_email, d_company_name, d_address, d_image, d_document,d_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)";
      const values = [
        password,
        personName,
        phoneNumber,
        email,
        companyName,
        address,
        imageFile,
        pdfFile,
        location,
      ];

      db.query(sql, values, (err, results) => {
        if (err) {
          console.log("Error saving data: ", err);
          return res
            .status(500)
            .json({ message: "Error saving data", error: err });
        } else {
          return res
            .status(200)
            .json({
              message: "delivery agent data added",
              success: true,
              results,
            });
        }
      });
    }
  });
};
export const editAgent = (req, res) => {
    const id = req.params.id;
    
    upload.fields([
      { name: "imageFile", maxCount: 1 },
      { name: "pdfFile", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        console.log("Error uploading files: ", err);
        return res.status(500).json({ message: "Error uploading files" });
      } else {
        const {
          password,
          personName,
          phoneNumber,
          email,
          companyName,
          address,
          location,
          pdfFileName,
          imageName
        } = req.body;
        
        // Validation checks
        if (!password) return res.status(400).json({ message: "password required" });
        if (!personName) return res.status(400).json({ message: "personName required" });
        if (!phoneNumber) return res.status(400).json({ message: "phoneNumber required" });
        if (!email) return res.status(400).json({ message: "email required" });
        if (!companyName) return res.status(400).json({ message: "companyName required" });
        if (!address) return res.status(400).json({ message: "address required" });
        if (!location) return res.status(400).json({ message: "location required" });
  
        const imageFile = req.files["imageFile"]
        ? req.files["imageFile"][0].key
        : null;
      const pdfFile = req.files["pdfFile"] ? req.files["pdfFile"][0].key : null;
        console.log(imageFile);
        
        const sql = `
          UPDATE Delivery_agent 
          SET 
            d_password = ?, 
            d_name = ?, 
            d_mobile = ?, 
            d_email = ?, 
            d_company_name = ?, 
            d_address = ?, 
            d_image = ?, 
            d_document = ?, 
            d_location = ? 
          WHERE 
            d_id = ?
        `;
        const values = [
          password,
          personName,
          phoneNumber,
          email,
          companyName,
          address,
          imageFile,
          pdfFile,
          location,
          id
        ];
  
        db.query(sql, values, (err, results) => {
          if (err) {
            console.log("Error saving data: ", err);
            return res.status(500).json({ message: "Error saving data", error: err });
          } else {
            return res.status(200).json({
              message: "Delivery agent data updated",
              success: true,
              results,
            });
          }
        });
      }
    });
  };
  