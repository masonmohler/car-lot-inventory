const express = require("express");
const router = express.Router();
const pool = require("../db"); // Import the database connection

// Get all cars
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cars");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get a single car by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM cars WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add a new car
router.post("/", async (req, res) => {
  try {
    const { vin, stock_number, price, make, model, color, year } = req.body;
    const result = await pool.query(
      "INSERT INTO cars (vin, stock_number, price, make, model, color, year) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [vin, stock_number, price, make, model, color, year]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update a car by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { vin, stock_number, price, make, model, color, year } = req.body;

    const result = await pool.query(
      "UPDATE cars SET vin = $1, stock_number = $2, price = $3, make = $4, model = $5, color = $6, year = $7 WHERE id = $8 RETURNING *",
      [vin, stock_number, price, make, model, color, year, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a car by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM cars WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
