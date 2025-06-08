import { db } from "../Model/db.js";
import { upload } from "../middleware/multer.js";

export const getCategories = (req, res) => {
  db.query("select * from allCategory", (err, results) => {
    if (err) {
      console.log("error in gettting get categories", err);
      return res
        .status(500)
        .json({ message: "error in gettting get categories", error: err });
    } else {
      return res
        .status(200)
        .json({ message: "request sucessfull", data: results });
    }
  });
};

export const getCategryDetail = (req, res) => {
  const id = req.params.id;
  db.query(
    "select * from allCategory where cat_id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.log("error in gettting get category", err);
        return res
          .status(500)
          .json({ message: "error in gettting get category", error: err });
      } else {
        return res
          .status(200)
          .json({ message: "request sucessfull", data: results });
      }
    }
  );
};

export const deletCate = (req, res) => {
  const id = req.params.id;
  db.query("delete from allCategory where cat_id = ?", [id], (err, results) => {
    if (err) {
      console.log("error in deleting category", err);
      return res
        .status(500)
        .json({ message: "error in deleting category", error: err });
    } else {
      return res
        .status(200)
        .json({ message: "deleted sucessfully", data: results });
    }
  });
};

export const addCate = (req, res) => {
  upload.fields([{ name: "imageFile", maxCount: 1 }])(req, res, (err) => {
    if (err) {
      console.log("Error uploading files: ", err);
      return res.status(500).json({ message: "Error uploading files" });
    } else {
      const { categoryName, categoryDescription, parent } = req.body;
      if (!categoryName)
        return res.status(400).json({ message: "categoryName required" });
      if (!categoryDescription)
        return res
          .status(400)
          .json({ message: "categoryDescription required" });

      const imageFile = req.files["imageFile"]
        ? req.files["imageFile"][0].key
        : null;
      // console.log(req);
      const sql =
        "INSERT INTO allCategory (cat_name, cat_description,cat_image,parent) VALUES (?, ?, ?,?)";
      const values = [categoryName, categoryDescription, imageFile, parent];

      db.query(sql, values, (err, results) => {
        if (err) {
          console.log("Error saving data: ", err);
          return res
            .status(500)
            .json({ message: "Error saving data", error: err });
        } else {
          return res.status(200).json({ message: "category added", results });
        }
      });
    }
  });
};

export const editCate = (req, res) => {
  const id = req.params.id;
  upload.fields([{ name: "imageFile", maxCount: 1 }])(req, res, (err) => {
    if (err) {
      console.log("Error uploading files: ", err);
      return res.status(500).json({ message: "Error uploading files" });
    } else {
      const { categoryName, categoryDescription, imageName } = req.body;
      if (!categoryName)
        return res.status(400).json({ message: "categoryName required" });
      if (!categoryDescription)
        return res
          .status(400)
          .json({ message: "categoryDescription required" });

      const imageFile = req.files["imageFile"]
        ? req.files["imageFile"][0].key
        : imageName;

      const sql =
        "update allCategory set cat_name = ?, cat_description=? , cat_image=? where cat_id = ?";
      const values = [categoryName, categoryDescription, imageFile, id];

      db.query(sql, values, (err, results) => {
        if (err) {
          console.log("Error editing data: ", err);
          return res
            .status(500)
            .json({ message: "Error editing data", error: err });
        } else {
          return res.status(200).json({ message: "category saved", results });
        }
      });
    }
  });
};

export const getSubcategory = (req, res) => {
  const id = req.params.id;
  db.query(
    "select * from allCategory where parent = ?",
    [id],
    (err, results) => {
      if (err) {
        console.log("error in gettting subcategory", err);
        return res
          .status(500)
          .json({ message: "error in gettting subcategory", error: err });
      } else {
        return res
          .status(200)
          .json({ message: "request sucessfull", data: results });
      }
    }
  );
};

export const hierarchical = (req, res) => {
  const id = req.params.id;
  db.query(
    `WITH RECURSIVE CategoryPath AS (
      SELECT cat_id, cat_name, parent 
      FROM allCategory 
      WHERE cat_id = ? 
      UNION ALL 
      SELECT c.cat_id, c.cat_name, c.parent 
      FROM allCategory c 
      JOIN CategoryPath cp ON c.cat_id = cp.parent
    ) 
    SELECT cat_id, cat_name, parent 
    FROM CategoryPath order by parent;`,
    [id],
    (err, results) => {
      if (err) {
        console.log("error in getting hierarchical data", err);
        return res
          .status(500)
          .json({ message: "error in getting hierarchical data", error: err });
      } else {
        return res
          .status(200)
          .json({ message: "request successful", data: results });
      }
    }
  );
};

export const categoryBidden = (req, res) => {
  const query = `
    SELECT 
        ac.cat_name,
        ac.cat_description,
        ac.cat_image,
        ac.parent,
        IFNULL((SELECT SUM(r.req_quantity) 
                FROM requirement r 
                WHERE r.list_cat_id = ac.cat_id), 0) AS curr_requirement,
        IFNULL((SELECT COUNT(r.req_id) 
                FROM requirement r 
                WHERE r.list_cat_id = ac.cat_id), 0) AS No_listing,
        IFNULL((SELECT SUM(s.s_qty) 
                FROM supply s 
                WHERE s.list_cat_id = ac.cat_id), 0) AS bidden_requirement,
        IFNULL((SELECT COUNT(DISTINCT s.s_id) 
                FROM supply s 
                WHERE s.list_cat_id = ac.cat_id), 0) AS no_bidding,
        ac.cat_id
    FROM 
        allCategory ac;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error in getting categories", err);
      return res
        .status(500)
        .json({ message: "Error in getting categories", error: err });
    } else {
      return res
        .status(200)
        .json({ message: "Request successful", data: results });
    }
  });
};

export const parentCategories = (req, res) => {
  db.query(
    "select * from allCategory where parent = ?",
    [-1],
    (err, results) => {
      if (err) {
        console.log("error in gettting get categories", err);
        return res
          .status(500)
          .json({ message: "error in gettting get categories", error: err });
      } else {
        return res
          .status(200)
          .json({ message: "request sucessfull", data: results });
      }
    }
  );
};

export const leafCategory = (req, res) => {
  const query = `
    SELECT * FROM allCategory 
    WHERE cat_id NOT IN (
      SELECT parent 
      FROM allCategory WHERE parent != -1
    );
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving deepest leaf categories", err);
      return res
        .status(500)
        .json({
          message: "Error retrieving deepest leaf categories",
          error: err,
        });
    } else {
      return res
        .status(200)
        .json({
          message: "Deepest leaf categories retrieved successfully",
          data: results,
        });
    }
  });
};
