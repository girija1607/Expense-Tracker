const express = require("express");
const router = express.Router();
const prisma = require("../db");

router.post("/", async (req, res) => {
  try {
    const idempotencyKey = req.header("Idempotency-Key");

    if (!idempotencyKey) {
      return res.status(400).json({ error: "Missing Idempotency-Key" });
    }

    // Check duplicate request
    const existing = await prisma.expense.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      return res.json(existing);
    }

    const { amount, category, description, date } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (!category || !date) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const expense = await prisma.expense.create({
      data: {
        amount,
        category,
        description,
        date: new Date(date),
        idempotencyKey,
      },
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { category, sort } = req.query;

    let where = {};
    if (category) {
      where.category = category;
    }

    let orderBy = {};
    if (sort === "date_desc") {
      orderBy.date = "desc";
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy,
    });

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
