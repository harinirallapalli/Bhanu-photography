const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test server
app.get("/", (req, res) => {
    res.json({
        message: "📸 Bhanu Photography Backend is Running!"
    });
});

// Test database
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "✅ Database connected successfully!",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            message: "❌ Database connection failed"
        });
    }
});
// Create a new booking
app.post("/api/bookings", async (req, res) => {
    try {
        const {
            customer_name,
            email,
            phone,
            event_type,
            event_date,
            event_time,
            location,
            requirements
        } = req.body;

        const result = await pool.query(
            `INSERT INTO bookings
            (customer_name, email, phone, event_type, event_date, event_time, location, requirements)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                customer_name,
                email,
                phone,
                event_type,
                event_date,
                event_time || null,
                location,
                requirements || null
            ]
        );

        res.status(201).json({
            message: "✅ Booking created successfully!",
            booking: result.rows[0]
        });

    } catch (error) {
        console.error("Booking error:", error.message);

        res.status(500).json({
            message: "❌ Failed to create booking",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Get all bookings
app.get("/api/bookings", async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM bookings ORDER BY created_at DESC"
        );

        res.json({
            message: "✅ Bookings fetched successfully!",
            bookings: result.rows
        });

    } catch (error) {

        console.error("Fetch bookings error:", error.message);

        res.status(500).json({
            message: "❌ Failed to fetch bookings"
        });
    }
});

// Update booking status
app.patch("/api/bookings/:id/status", async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "❌ Invalid booking status"
            });
        }

        const result = await pool.query(
            `UPDATE bookings
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "❌ Booking not found"
            });
        }

        res.json({
            message: "✅ Booking status updated successfully!",
            booking: result.rows[0]
        });

    } catch (error) {

        console.error("Status update error:", error.message);

        res.status(500).json({
            message: "❌ Failed to update booking status"
        });
    }
});
