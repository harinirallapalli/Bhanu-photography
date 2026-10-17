const API_URL="https://bhanu-photography.onrender.com/api/bookings";
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
        //get is used to load bookings
        const response =await fetch(API_URL);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load bookings");
        }

        //supports different backend responses formats
        const bookings =
            Array.isArray(data) ? data : data.bookings || [];

        displayBookings(bookings);
        updateBookingChart(bookings);

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

            <td>${formatDate(booking.event_date)}</td>

            <td>${booking.event_time || "-"}</td>

            <td>${booking.location}</td>

            <td>${booking.requirements || "-"}</td>

            <td>
                <span class="status-badge status-${booking.status.toLowerCase()}">
                    ${booking.status}
                </span>
            </td>
            <td>

                <select
                    class="status-select"
                    onchange="updateStatus(${booking.id}, this.value)"
                >
                    <option value="Pending"  
                        ${booking.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="Confirmed" 
                        ${booking.status === "Confirmed" ? "selected" : ""}>
                        Confirmed
                    </option>

                    <option value="Cancelled" 
                        ${booking.status === "Cancelled" ? "selected" : ""}>
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
if(refreshBtn){
    refreshBtn.addEventListener("click", loadBookings);
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
// =========================
// LOAD WHEN PAGE OPENS
// =========================

loadBookings();


// =========================
// FORMAT DATE
// =========================

function formatDate(date) {
    if (!date) return "-";

    const d = new Date(date);

    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}





// =========================
// DISPLAY BOOKINGS
// =========================

function displayBookings(bookings) {
 // SUMMARY COUNTS
    const total = bookings.length;
    const pending = bookings.filter(
        booking => booking.status === "Pending"
    ).length;

    const confirmed = bookings.filter(
        booking => booking.status === "Confirmed"
    ).length;

    const cancelled = bookings.filter(
        booking => booking.status === "Cancelled"
    ).length;

    document.getElementById("totalBookings").textContent = total;
    document.getElementById("pendingBookings").textContent = pending;
    document.getElementById("confirmedBookings").textContent = confirmed;
    document.getElementById("cancelledBookings").textContent = cancelled;

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

            <td>${formatDate(booking.event_date)}</td>

            <td>${booking.event_time || "-"}</td>

            <td>${booking.location}</td>

            <td>${booking.requirements || "-"}</td>

            <td class="status-cell">
                <span class="status-badge status-${booking.status.toLowerCase()}">
                    ${booking.status}
                </span>

                <select
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
                type="button"onclick="deleteBooking(${booking.id})">
                  
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
if(refreshBtn){
    refreshBtn.addEventListener("click", loadBookings);
}


// =========================
// UPDATE BOOKING STATUS
// =========================

async function updateStatus(id, status) {

    try {

        const response = await fetch(
            `https://bhanu-photography.onrender.com/api/bookings/${id}/status`,
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

// =========================
// DELETE BOOKING
// =========================

async function deleteBooking(id) {

    const confirmDelete = confirm(
        "⚠️Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `https://bhanu-photography.onrender.com/api/bookings/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        console.log("Delete response:", data);

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to delete booking"
            );
        }

        alert("✅ Booking deleted successfully!");

        await loadBookings();

    } catch (error) {

        console.error("Delete error:", error);

        alert("❌ Failed to delete booking");
    }
}
// =========================
// MAKE FUNCTIONS AVAILABLE
// TO INLINE HTML onclick
// =========================

window.updateStatus = updateStatus;
window.deleteBooking = deleteBooking;

// =========================
// SEARCH & FILTER
// =========================

const searchBooking = document.getElementById("searchBooking");
const statusFilter = document.getElementById("statusFilter");

if (searchBooking) {
    searchBooking.addEventListener("input", filterBookings);
}

if (statusFilter) {
    statusFilter.addEventListener("change", filterBookings);
}


function filterBookings() {

    const searchText = searchBooking.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;

    const rows = document.querySelectorAll(
        "#bookingTableBody tr"
    );

    rows.forEach((row) => {

        const rowText = row.textContent.toLowerCase();

        const statusSelect = row.querySelector(".status-select");

        const bookingStatus = statusSelect
            ? statusSelect.value
            : "";

        const matchesSearch =
            rowText.includes(searchText);

        const matchesStatus =
            selectedStatus === "All" ||
            bookingStatus === selectedStatus;

        if (matchesSearch && matchesStatus) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });
}

// =========================
// LOGOUT
// =========================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (confirmLogout) {
            window.location.href = "../index.html";
        }

    });
}

// =========================
// BOOKING STATISTICS CHART
// =========================

let bookingChart = null;

function updateBookingChart(bookings) {

    const canvas = document.getElementById("bookingChart");

    if (!canvas) {
        console.error("❌ bookingChart canvas not found");
        return;
    }
// Count booking statuses
    const pending = bookings.filter(
        booking => booking.status === "Pending"
    ).length;

    const confirmed = bookings.filter(
        booking => booking.status === "Confirmed"
    ).length;

    const cancelled = bookings.filter(
        booking => booking.status === "Cancelled"
    ).length;

    console.log("Chart data:", {
        pending,
        confirmed,
        cancelled
    });

    // Destroy previous chart
    if (bookingChart) {
        bookingChart.destroy();
        bookingChart = null;
    }
    const ctx = canvas.getContext("2d");
    bookingChart = new Chart(ctx, {
        type: "bar",

        data: {
            labels: [
                "Pending",
                "Confirmed",
                "Cancelled"
            ],

            datasets: [{
                label: "Bookings",
                data: [
                    pending,
                    confirmed,
                    cancelled
                ],

                backgroundColor: [
                    "#facc15",
                    "#22c55e",
                    "#ef4444"
                ],

                borderColor: [
                    "#facc15",
                    "#22c55e",
                    "#ef4444"

                ],
                borderWidth: 1,
                borderRadius: 8,
                borderSkipped: false,
                barPercentage: 0.65,

                categoryPercentage: 0.7

            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            animation: {
                duration: 1000,
                easing: "easeOutBounce"

            },    
            scales: {
                x: {
                    ticks: {
                        color: "#ffffff",
                        font: {
                            weight:"600"
                        }
                    },

                    grid: {
                        color: "rgba(255,255,255,0.08)"
                    }
                },
                

                y: {
                    beginAtZero: true,

                    ticks: {
                        color: "#ffffff",
                        stepSize: 1
                    },

                    grid: {
                        color: "rgba(255,255,255,0.08)"
                    }
                }
            },

            plugins: {
                legend: {
                    display:true,
                    labels: {
                        color: "#ffffff"
                    }
                },
            
                tooltip:{
                    enabled:true,
                }
            },
        }
    });

    console.log("✅ Booking chart created");
}

