const bookingTableBody = document.getElementById("bookingTableBody");
const refreshBtn = document.getElementById("refreshBtn");


// =========================
// LOAD BOOKINGS
// =========================

async function loadBookings() {

    bookingTableBody.innerHTML = `
        <tr>
            <td colspan="10" class="loading">
                Loading bookings...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(
            "http://localhost:5000/api/bookings"
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load bookings");
        }

        displayBookings(data.bookings);

    } catch (error) {

        console.error("Error:", error);

        bookingTableBody.innerHTML = `
            <tr>
                <td colspan="10" class="loading">
                    ❌ Failed to load bookings
                </td>
            </tr>
        `;
    }
}


// =========================
// DISPLAY BOOKINGS
// =========================

function displayBookings(bookings) {

    if (!bookings || bookings.length === 0) {

        bookingTableBody.innerHTML = `
            <tr>
                <td colspan="10" class="loading">
                    No bookings found.
                </td>
            </tr>
        `;

        return;
    }


    bookingTableBody.innerHTML = "";


    bookings.forEach((booking) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${booking.id}</td>

            <td>${booking.customer_name}</td>

            <td>${booking.email}</td>

            <td>${booking.phone}</td>

            <td>${booking.event_type}</td>

            <td>${booking.event_date}</td>

            <td>${booking.event_time || "-"}</td>

            <td>${booking.location}</td>

            <td>${booking.requirements || "-"}</td>
            <td>

                <select
                    class="status-select"
                    onchange="updateStatus(${booking.id}, this.value)"
                >
                    <option value="Pending" ${booking.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="Confirmed" ${booking.status === "Confirmed" ? "selected" : ""}>
                        Confirmed
                    </option>

                    <option value="Cancelled" ${booking.status === "Cancelled" ? "selected" : ""}>
                        Cancelled
                    </option>
                </select>

                <button
                    class="delete-btn"
                    onclick="deleteBooking(${booking.id})"
                >
                    🗑️ Delete
                </button>

            </td>
        `;

        bookingTableBody.appendChild(row);

    });
}


// =========================
// REFRESH BUTTON
// =========================

refreshBtn.addEventListener("click", loadBookings);


// =========================
// LOAD WHEN PAGE OPENS
// =========================

loadBookings();

// =========================
// UPDATE BOOKING STATUS
// =========================

async function updateStatus(id, status) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/bookings/${id}/status`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update status");
        }

        alert("✅ Booking status updated successfully!");

        loadBookings();

    } catch (error) {

        console.error("Status update error:", error);

        alert("❌ Failed to update booking status");
    }
}
