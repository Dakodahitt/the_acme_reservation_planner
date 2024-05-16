const express = require("express");
const app = express();
const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation,
} = require("./db");

app.use(express.json());

app.get("/api/customers", async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (error) {
    next(error);
  }
});

app.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (error) {
    next(error);
  }
});

app.get("/api/reservations", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { restaurant_id, date, party_count } = req.body;
    // Implement creating reservation
  } catch (error) {
    next(error);
  }
});

app.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      const { id, customer_id } = req.params;
    } catch (error) {
      next(error);
    }
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

const init = async () => {
  try {
    console.log("Connecting to the database...");
    await client.connect();
    console.log("Connected to the database");
    console.log("Creating tables...");
    await createTables();
    console.log("Tables created");
  } catch (error) {
    console.error("Error during initialization:", error.message);
  }
};

init();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
