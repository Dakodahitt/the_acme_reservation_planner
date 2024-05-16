const express = require("express");
const app = express();
const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  createReservation,
  destroyReservation,
} = require("./db");

app.use(express.json());

app.get("/api/customers", async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/reservations", async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/customers/:customer_id/reservations", async (req, res, next) => {
  try {
    const { customer_id } = req.params;
    const { restaurant_id, date, party_count } = req.body;
    const reservation = await createReservation({
      customer_id,
      restaurant_id,
      date,
      party_count,
    });
    res.status(201).send(reservation);
  } catch (ex) {
    next(ex);
  }
});

app.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      const { customer_id, id } = req.params;
      await destroyReservation({ id, customer_id });
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  }
);

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message || err });
});

const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("created tables");

  const [customer1, customer2] = await Promise.all([
    createCustomer({ name: "John Doe" }),
    createCustomer({ name: "Jane Smith" }),
  ]);
  console.log(await fetchCustomers());

  const [restaurant1, restaurant2] = await Promise.all([
    createRestaurant({ name: "Restaurant A" }),
    createRestaurant({ name: "Restaurant B" }),
  ]);
  console.log(await fetchRestaurants());

  const reservation = await createReservation({
    customer_id: customer1.id,
    restaurant_id: restaurant1.id,
    date: "2024-06-01",
    party_count: 4,
  });
  console.log(await fetchReservations());

  await destroyReservation({
    id: reservation.id,
    customer_id: reservation.customer_id,
  });
  console.log(await fetchReservations());

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.log("some curl commands to test");
    console.log(`curl localhost:${port}/api/customers`);
    console.log(`curl localhost:${port}/api/restaurants`);
    console.log(`curl localhost:${port}/api/reservations`);
    console.log(
      `curl -X POST localhost:${port}/api/customers/${customer1.id}/reservations -d '{"restaurant_id":"${restaurant2.id}", "date": "2024-06-15", "party_count": 3}' -H "Content-Type:application/json"`
    );
    console.log(
      `curl -X DELETE localhost:${port}/api/customers/${customer1.id}/reservations/${reservation.id}`
    );
  });
};

init();
