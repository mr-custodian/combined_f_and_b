
import { db } from "../Model/db.js";
import { upload } from "../middleware/multer.js";

const queryAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

export const allbuyer = async (req, res) => {
  try {
    const results = await queryAsync("select * from Buyer");
    res.status(200).json({
      success: true,
      message: "request successful",
      data: results,
    });
  } catch (err) {
    console.log("error in all buyer getting data", err);
    res.status(500).json({ message: "error in all buyer getting data", error: err });
  }
};

export const getbuyer = async (req, res) => {
  const id = req.params.id;
  try {
    const results = await queryAsync("select * from Buyer where b_id = ?", [id]);
    const categories = await queryAsync(
      "select distinct a.cat_id,a.cat_name from allCategory as a inner join buyerCategory as b on a.cat_id= b.cat_id where b.b_id = ?",
      [id]
    );
    const dropingaddress = await queryAsync(
      "select dropingAddress from BuyerDropAdd where b_id=?",
      [id]
    );
    res.status(200).json({
      message: "successful",
      data: results[0],
      category: categories,
      dropingaddress: dropingaddress,
    });
  } catch (err) {
    console.log("error in fetching data", err);
    res.status(500).json({ message: "Error in fetching detail", error: err });
  }
};

export const deletbuyer = async (req, res) => {
  const id = req.params.id;
  try {
    await queryAsync("delete from Buyer where b_id=?", [id]);
    res.status(200).json({ message: "Buyer deleted successfully" });
  } catch (err) {
    console.error("Error deleting buyer:", err);
    res.status(500).json({ message: "Error deleting buyer", error: err });
  }
};
export const AddBuyer = (req, res) => {
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
      dropingaddress,
    } = req.body;


    if (!personName) return res.status(400).json({ message: "personName required" });
    if (!phoneNumber) return res.status(400).json({ message: "phoneNumber required" });
    if (!email) return res.status(400).json({ message: "email required" });
    if (!companyName) return res.status(400).json({ message: "companyName required" });
    if (!address) return res.status(400).json({ message: "address required" });

    let cate = JSON.parse(category);
    if (cate.length == 0) {
      return res.status(400).json({ message: "category required" });
    }

    const imageFile = req.files["imageFile"]
      ? req.files["imageFile"][0].key
      : null;
    const pdfFile = req.files["pdfFile"]
      ? req.files["pdfFile"][0].key
      : null;
 
    // Start a transaction
    db.beginTransaction((err) => {
      if (err) {
        console.log("Error starting transaction: ", err);
        return res.status(500).json({ message: "Error starting transaction" });
      }

      const sql =
        "INSERT INTO Buyer ( b_name, b_mobile, b_email, b_company_name, b_address, b_image, b_document) VALUES ( ?, ?, ?, ?, ?, ?, ?)";
      const values = [
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
            res.status(500).json({ message: "Error saving data", error: err });
          });
        } else {
          const buyerId = results.insertId;

          let categories;
          try {
            categories = JSON.parse(category);
          } catch (parseError) {
            console.log("Error parsing category:", parseError);
            return db.rollback(() => {
              res.status(400).json({ message: "Invalid category format", error: parseError });
            });
          }

          if (!Array.isArray(categories) || !categories.every((catId) => Number.isInteger(parseInt(catId, 10)))) {
            return db.rollback(() => {
              res.status(400).json({ message: "Category should be an array of integers" });
            });
          }

          const categoryValues = categories.map((catId) => [buyerId, parseInt(catId, 10)]);
          const categorySql = "INSERT INTO buyerCategory (b_id, cat_id) VALUES ?";

          db.query(categorySql, [categoryValues], (err, results) => {
            if (err) {
              console.log("Error saving category data: ", err);
              return db.rollback(() => {
                res.status(500).json({ message: "Error saving category data", error: err });
              });
            } else {
              let dropingAddresses;
              try {
                dropingAddresses = JSON.parse(dropingaddress);
              } catch (parseError) {
                console.log("Error parsing dropingaddress:", parseError);
                return db.rollback(() => {
                  res.status(400).json({ message: "Invalid dropingaddress format", error: parseError });
                });
              }

              if (!Array.isArray(dropingAddresses) || !dropingAddresses.every((addr) => typeof addr === "string")) {
                return db.rollback(() => {
                  res.status(400).json({ message: "Droping address should be an array of strings" });
                });
              }

              const dropingAddressValues = dropingAddresses.map((addr) => [buyerId, addr]);
              const dropingAddressSql = "INSERT INTO BuyerDropAdd (b_id, dropingAddress) VALUES ?";

              db.query(dropingAddressSql, [dropingAddressValues], (err, results) => {
                if (err) {
                  console.log("Error saving droping address data: ", err);
                  return db.rollback(() => {
                    res.status(500).json({ message: "Error saving droping address data", error: err });
                  });
                } else {
                  // Commit the transaction
                  db.commit((err) => {
                    if (err) {
                      console.log("Error committing transaction: ", err);
                      return db.rollback(() => {
                        res.status(500).json({ message: "Error committing transaction", error: err });
                      });
                    } else {
                      return res.status(200).json({ message: "Data saved successfully" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  });
};

export const editBuyer = (req, res) => {
  const id = req.params.id;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.log("Error starting transaction: ", err);
      return res.status(500).json({ message: "Error starting transaction" });
    }

    db.query('DELETE FROM buyerCategory WHERE b_id = ?', [id], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ message: "Error deleting at cat", error: err });
        });
      }

      db.query('DELETE FROM BuyerDropAdd WHERE b_id = ?', [id], (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ message: "Error deleting at droping add", error: err });
          });
        }

        upload.fields([
          { name: "imageFile", maxCount: 1 },
          { name: "pdfFile", maxCount: 1 },
        ])(req, res, (err) => {
          if (err) {
            console.log("Error uploading files: ", err);
            return db.rollback(() => {
              res.status(500).json({ message: "Error uploading files" });
            });
          }

          const {
            password,
            personName,
            phoneNumber,
            email,
            companyName,
            address,
            category,
            dropingaddress,
            imageName,
      pdfFileName
          } = req.body;

          
          if (!personName) return res.status(400).json({ message: "personName required" });
          if (!phoneNumber) return res.status(400).json({ message: "phoneNumber required" });
          if (!email) return res.status(400).json({ message: "email required" });
          if (!companyName) return res.status(400).json({ message: "companyName required" });
          if (!address) return res.status(400).json({ message: "address required" });

          const imageFile = req.files["imageFile"]
            ? req.files["imageFile"][0].filename
            : imageName;
          const pdfFile = req.files["pdfFile"]
            ? req.files["pdfFile"][0].filename
            : pdfFileName;

          const sql =
            "UPDATE Buyer SET  b_name = ?, b_mobile = ?, b_email = ?, b_company_name = ?, b_address = ?, b_image = ?, b_document = ? WHERE b_id = ?";
          const values = [
            personName,
            phoneNumber,
            email,
            companyName,
            address,
            imageFile,
            pdfFile,
            id,
          ];

          db.query(sql, values, (err, results) => {
            if (err) {
              console.log("Error saving data: ", err);
              return db.rollback(() => {
                res.status(500).json({ message: "Error saving data", error: err });
              });
            }

            let categories;
            try {
              categories = JSON.parse(category);
            } catch (parseError) {
              console.log("Error parsing category:", parseError);
              return db.rollback(() => {
                res.status(400).json({ message: "Invalid category format", error: parseError });
              });
            }

            if (!Array.isArray(categories) || !categories.every((catId) => Number.isInteger(parseInt(catId, 10)))) {
              return db.rollback(() => {
                res.status(400).json({ message: "Category should be an array of integers" });
              });
            }

            const categoryValues = categories.map((catId) => [id, parseInt(catId, 10)]);
            const categorySql = "INSERT INTO buyerCategory (b_id, cat_id) VALUES ?";

            db.query(categorySql, [categoryValues], (err, results) => {
              if (err) {
                console.log("Error saving category data: ", err);
                return db.rollback(() => {
                  res.status(500).json({ message: "Error saving category data", error: err });
                });
              }

              let dropingAddresses;
              try {
                dropingAddresses = JSON.parse(dropingaddress);
              } catch (parseError) {
                console.log("Error parsing dropingaddress:", parseError);
                return db.rollback(() => {
                  res.status(400).json({ message: "Invalid dropingaddress format", error: parseError });
                });
              }

              if (!Array.isArray(dropingAddresses) || !dropingAddresses.every((addr) => typeof addr === "string")) {
                return db.rollback(() => {
                  res.status(400).json({ message: "Droping address should be an array of strings" });
                });
              }

              const dropingAddressValues = dropingAddresses.map((addr) => [id, addr]);
              const dropingAddressSql = "INSERT INTO BuyerDropAdd (b_id, dropingAddress) VALUES ?";

              db.query(dropingAddressSql, [dropingAddressValues], (err, results) => {
                if (err) {
                  console.log("Error saving droping address data: ", err);
                  return db.rollback(() => {
                    res.status(500).json({ message: "Error saving droping address data", error: err });
                  });
                }

                // Commit the transaction
                db.commit((err) => {
                  if (err) {
                    console.log("Error committing transaction: ", err);
                    return db.rollback(() => {
                      res.status(500).json({ message: "Error committing transaction", error: err });
                    });
                  } else {
                    return res.status(200).json({ message: "Data saved successfully" });
                  }
                });
              });
            });
          });
        });
      });
    });
  });
};
