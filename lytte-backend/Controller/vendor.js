import { db } from "../Model/db.js";
import { upload } from "../middleware/multer.js";

const getVendors = (req, res) => {
  const mysql = "SELECT * FROM vendor";
  db.query(mysql, (err, results) => {
    if (err) {
      console.log("error in fetching vendors : ", err);
      return res
        .status(500)
        .json({ message: "Error fetching vendors", error: err });
    } else {
      res.status(200).json({ message: "request sucessfull", data: results });
    }
  });
};

const GetPassword = (req, res) => {
  const { email } = req.query; // Get the email from the query parameters

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const sql = "SELECT v_password FROM vendor WHERE v_email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.log("Error fetching vendor: ", err);
      return res
        .status(500)
        .json({ message: "Error fetching vendor", error: err });
    }

    if (results.length > 0) {
      res
        .status(200)
        .json({ message: "Request successful", data: results[0].v_password });
    } else {
      res
        .status(404)
        .json({ message: "No vendor found with the provided email" });
    }
  });
};

const getVenderDetail = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM vendor Where v_id = ?", [id], (err, results) => {
    if (err) {
      console.log("error in fetching the data");
      return res
        .status(500)
        .json({ message: "Error in fetching detail", error: err });
    } else {
      db.query(
        "select DISTINCT a.cat_id,a.cat_name from allCategory as a inner join vendorCategory as b on a.cat_id = b.cat_id where b.v_id = ?",
        [id],
        (error, categories) => {
          if (err) {
            console.log("error in fetching the cat data");
            return res
              .status(500)
              .json({ message: "Error in fetching detail", error: error });
          } else {
            res.status(200).json({
              message: "sucessfull",
              data: results[0],
              category: categories,
            });
          }
        }
      );
    }
  });
};
const deleteVendor = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM vendor WHERE v_id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting vendor:", err);
      res.status(500).json({ message: "Error deleting vendor", error: err });
    } else {
      res.status(200).json({ message: "Vendor deleted successfully" });
    }
  });
};
const editVendor = (req, res) => {
  const id = req.params.id;

  upload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "pdfFile", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      console.log("Error uploading files: ", err);
      return res.status(500).json({ message: "Error uploading files" });
    }

    const {
      password,
      personName,
      phoneNumber,
      email,
      companyName,
      address,
      category,
      imageName,
      pdfFileName,
    } = req.body;

    if (
      !password ||
      !personName ||
      !phoneNumber ||
      !email ||
      !companyName ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const imageFile = req.files["imageFile"]
        ? req.files["imageFile"][0].key
        : null;
      const pdfFile = req.files["pdfFile"] ? req.files["pdfFile"][0].key : null;

    const sql =
      "UPDATE vendor SET v_password = ?, v_name = ?, v_mobile = ?, v_email = ?, v_companyname = ?, v_address = ?, v_image = ?, v_document = ? WHERE v_id = ?";
    const values = [
      password,
      personName,
      phoneNumber,
      email,
      companyName,
      address,
      imageFile,
      pdfFile,
      id,
    ];

    db.beginTransaction(async (err) => {
      if (err) {
        console.log("Error starting transaction: ", err);
        return res
          .status(500)
          .json({ message: "Error starting transaction", error: err });
      }

      try {
        await new Promise((resolve, reject) => {
          db.query(sql, values, (err, results) => {
            if (err) {
              console.log("Error updating data: ", err);
              return reject(err);
            }
            resolve(results);
          });
        });

        let categories;
        try {
          categories = JSON.parse(category); // Assuming category is a JSON string of category IDs
        } catch (parseError) {
          console.log("Error parsing category:", parseError);
          throw parseError;
        }

        if (
          !Array.isArray(categories) ||
          !categories.every((catId) => Number.isInteger(parseInt(catId, 10)))
        ) {
          throw new Error("Category should be an array of integers");
        }

        await new Promise((resolve, reject) => {
          const deleteCategorySql = "DELETE FROM vendorCategory WHERE v_id = ?";
          db.query(deleteCategorySql, [id], (err, results) => {
            if (err) {
              console.log("Error deleting old category data: ", err);
              return reject(err);
            }
            resolve(results);
          });
        });

        const categoryValues = categories.map((catId) => [id, catId]);

        const categoryInsertSql = `
          INSERT INTO vendorCategory (v_id, cat_id) VALUES ?`;

        await new Promise((resolve, reject) => {
          db.query(categoryInsertSql, [categoryValues], (err, results) => {
            if (err) {
              console.log("Error saving category data: ", err);
              return reject(err);
            }
            resolve(results);
          });
        });

        db.commit((err) => {
          if (err) {
            console.log("Error committing transaction: ", err);
            return db.rollback(() => {
              res
                .status(500)
                .json({ message: "Error committing transaction", error: err });
            });
          }
          return res.status(200).json({ message: "Data saved successfully" });
        });
      } catch (err) {
        db.rollback(() => {
          console.log("Transaction rolled back due to error: ", err);
          res.status(500).json({ message: "Error saving data", error: err });
        });
      }
    });
  });
};

const AddVendor = (req, res) => {
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
        category,
      } = req.body;
      if (!password)
        return res.status(400).json({ message: "password required" });
      if (!personName)
        return res.status(400).json({ message: "personName required" });
      if (!phoneNumber)
        return res.status(400).json({ message: "phoneNumber required" });
      if (!email) return res.status(400).json({ message: "email required" });
      if (!companyName)
        return res.status(400).json({ message: "companyName required" });
      if (!address)
        return res.status(400).json({ message: "address required" });

      let cate = JSON.parse(category);
      if (cate.length == 0) {
        return res.status(400).json({ message: "category required" });
      }

      const imageFile = req.files["imageFile"]
        ? req.files["imageFile"][0].key
        : null;
      const pdfFile = req.files["pdfFile"] ? req.files["pdfFile"][0].key : null;

      // console.log("Image file key:", imageFile);
      // console.log("PDF file key:", pdfFile);
      // Start a transaction
      db.beginTransaction((err) => {
        if (err) {
          console.log("Error starting transaction: ", err);
          return res
            .status(500)
            .json({ message: "Error starting transaction" });
        }

        const sql =
          "INSERT INTO vendor (v_password, v_name, v_mobile, v_email, v_companyname, v_address, v_image, v_document) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
          password,
          personName,
          phoneNumber,
          email,
          companyName,
          address,
          imageFile,
          pdfFile,
        ];

        db.query(sql, values, (err, results) => {
          if (err) {
            console.log("Error saving data: ", err);
            return db.rollback(() => {
              res
                .status(500)
                .json({ message: "Error saving data", error: err });
            });
          } else {
            const vendorId = results.insertId;

            let categories;
            try {
              categories = JSON.parse(category); // Assuming category is a JSON string of category IDs
            } catch (parseError) {
              console.log("Error parsing category:", parseError);
              return db.rollback(() => {
                res
                  .status(400)
                  .json({
                    message: "Invalid category format",
                    error: parseError,
                  });
              });
            }

            if (
              !Array.isArray(categories) ||
              !categories.every((catId) =>
                Number.isInteger(parseInt(catId, 10))
              )
            ) {
              return db.rollback(() => {
                res
                  .status(400)
                  .json({ message: "Category should be an array of integers" });
              });
            }

            const categoryValues = categories.map((catId) => [
              vendorId,
              parseInt(catId, 10),
            ]);

            const categorySql =
              "INSERT INTO vendorCategory (v_id, cat_id) VALUES ?";

            db.query(categorySql, [categoryValues], (err, results) => {
              if (err) {
                console.log("Error saving category data: ", err);
                return db.rollback(() => {
                  res
                    .status(500)
                    .json({
                      message: "Error saving category data",
                      error: err,
                    });
                });
              } else {
                // Commit the transaction
                db.commit((err) => {
                  if (err) {
                    console.log("Error committing transaction: ", err);
                    return db.rollback(() => {
                      res
                        .status(500)
                        .json({
                          message: "Error committing transaction",
                          error: err,
                        });
                    });
                  } else {
                    return res
                      .status(200)
                      .json({ message: "Data saved successfully" });
                  }
                });
              }
            });
          }
        });
      });
    }
  });
};

const VendorDetailChanged = (req, res) => {
  const id = req.params.id;
  const { v_name, v_companyname, v_address, v_mobile, v_email } = req.body;

  // Create an object with the fields to update
  const fieldsToUpdate = {};
  if (v_name) fieldsToUpdate.v_name = v_name;
  if (v_companyname) fieldsToUpdate.v_companyname = v_companyname;
  if (v_address) fieldsToUpdate.v_address = v_address;
  if (v_mobile) fieldsToUpdate.v_mobile = v_mobile;
  if (v_email) fieldsToUpdate.v_email = v_email;

  // If no fields to update, return an error
  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  // Build the SQL query dynamically
  const setClause = Object.keys(fieldsToUpdate)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(fieldsToUpdate);

  const sql = `UPDATE vendor SET ${setClause} WHERE v_id = ?`;
  values.push(id);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.log("Error updating vendor:", err);
      return res
        .status(500)
        .json({ message: "Error updating vendor", error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ message: "Vendor updated successfully" });
  });
};

export {
  getVendors,
  getVenderDetail,
  deleteVendor,
  editVendor,
  AddVendor,
  VendorDetailChanged,
  GetPassword,
};
