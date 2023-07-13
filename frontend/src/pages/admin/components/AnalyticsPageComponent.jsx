import { Row, Col, Form } from "react-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";

const AdminAnalyticsPageComponent = ({
  fetchOrdersForFirstDate,
  fetchOrdersForSecondDate,
  socketIOClient,
}) => {
  let previousDay = new Date();
  previousDay.setDate(previousDay.getDate() - 1);

  const [firstDateToCompare, setFirstDateToCompare] = useState(
    new Date().toISOString().substring(0, 10)
  );

  const [secondDateToCompare, setSecondDateToCompare] = useState(
    new Date(previousDay).toISOString().substring(0, 10)
  );

  const [dataForFirstSet, setDataForFirstSet] = useState([]);
  const [dataForSecondSet, setDataForSecondSet] = useState([]);

  const firstDateHandler = (e) => {
    setFirstDateToCompare(e.target.value);
  };

  const secondDateHandler = (e) => {
    setSecondDateToCompare(e.target.value);
  };

  useEffect(() => {
    // Create an abort controller instance
    const abctrl = new AbortController();

    // Fetch orders data for the first date to compare
    fetchOrdersForFirstDate(abctrl, firstDateToCompare)
      .then((data) => {
        let orderSum = 0;
        // Process the fetched orders data
        const orders = data.map((order) => {
          //sum up orders
          orderSum += order.orderTotal.cartSubtotal;
          // Format the date
          let date = new Date(order.createdAt).toLocaleString("en-US", {
            hour: "numeric",
            hour12: true,
            timeZone: "UTC",
          });
          // Return an object with the formatted date and order sum for the first date
          return { name: date, [firstDateToCompare]: orderSum };
        });
        setDataForFirstSet(orders);
      })
      .catch((er) =>
        console.log(
          er.response.data.message ? er.response.data.message : er.response.data
        )
      );

    // Fetch orders data for the second date to compare
    fetchOrdersForSecondDate(abctrl, secondDateToCompare)
      .then((data) => {
        let orderSum = 0;
        // Process the fetched orders data
        const orders = data.map((order) => {
          orderSum += order.orderTotal.cartSubtotal;
          // Format the date
          let date = new Date(order.createdAt).toLocaleString("en-US", {
            hour: "numeric",
            hour12: true,
            timeZone: "UTC",
          });
          // Return an object with the formatted date and order sum for the second date
          return { name: date, [secondDateToCompare]: orderSum };
        });
        setDataForSecondSet(orders);
      })
      .catch((er) =>
        console.log(
          er.response.data.message ? er.response.data.message : er.response.data
        )
      );

    // Clean up function to abort the fetch if the component unmounts or the dependency values change
    return () => abctrl.abort();
  }, [firstDateToCompare, secondDateToCompare]);

  useEffect(() => {
    // Create a socket instance
    const socket = socketIOClient("https://topazio-shop-backend.onrender.com");
    
    // Get today's date
    let today = new Date().toDateString();

    // Define the event handler for "newOrder" event
    const handler = (newOrder) => {
      // Get the order date
      let orderDate = new Date(newOrder.createdAt).toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
        timeZone: "UTC",
      });

      // Check if the new order is from today
      if (new Date(newOrder.createdAt).toDateString() === today) {
        // Check if today matches the first date to compare
        if (today === new Date(firstDateToCompare).toDateString()) {
          // Update the data for the first date
          setDataForFirstSet((prev) => {
            if (prev.length === 0) {
              // If the data is empty, create a new entry
              return [
                {
                  name: orderDate,
                  [firstDateToCompare]: newOrder.orderTotal.cartSubtotal,
                },
              ];
            }
            let length = prev.length;
            if (prev[length - 1].name === orderDate) {
              // If the order date matches the last entry, update the existing entry
              prev[length - 1][firstDateToCompare] +=
                newOrder.orderTotal.cartSubtotal;
              return [...prev];
            } else {
              // If the order date is different, create a new entry
              let lastElem = {
                name: orderDate,
                [firstDateToCompare]:
                  prev[length - 1][firstDateToCompare] +
                  newOrder.orderTotal.cartSubtotal,
              };
              return [...prev, lastElem];
            }
          });
        } else if (today === new Date(secondDateToCompare).toDateString()) {
          // Check if today matches the second date to compare
          // Update the data for the second date
          setDataForSecondSet((prev) => {
            if (prev.length === 0) {
              // If the data is empty, create a new entry
              return [
                {
                  name: orderDate,
                  [secondDateToCompare]: newOrder.orderTotal.cartSubtotal,
                },
              ];
            }
            let length = prev.length;
            if (prev[length - 1].name === orderDate) {
              // If the order date matches the last entry, update the existing entry
              prev[length - 1][secondDateToCompare] +=
                newOrder.orderTotal.cartSubtotal;
              return [...prev];
            } else {
              // If the order date is different, create a new entry
              let lastElem = {
                name: orderDate,
                [secondDateToCompare]:
                  prev[length - 1][secondDateToCompare] +
                  newOrder.orderTotal.cartSubtotal,
              };
              return [...prev, lastElem];
            }
          });
        }
      }
    };

    // Listen for "newOrder" event
    socket.on("newOrder", handler);

    // Disconnect socket when user leave the page
    return () => socket.off("newOrder", handler);
  }, [
    setDataForFirstSet,
    setDataForSecondSet,
    firstDateToCompare,
    secondDateToCompare,
  ]);

  return (
    <Row className="m-5">
      <Col md={2}>
        <AdminLinksComponent />
      </Col>
      <Col md={10}>
        <h1>
          Revenue on {firstDateToCompare} VS{" "}
          {secondDateToCompare}
        </h1>
        <Form.Group controlId="firstDateToCompare">
          <Form.Label>Select First Date To Compare</Form.Label>
          <Form.Control
            onChange={firstDateHandler}
            type="date"
            name="firstDateToCompare"
            placeholder="First Date To Compare"
            defaultValue={firstDateToCompare}
          />
        </Form.Group>
        <br />
        <Form.Group controlId="secondDateToCompare">
          <Form.Label>Select Second Date To Compare</Form.Label>
          <Form.Control
            onChange={secondDateHandler}
            type="date"
            name="secondDateToCompare"
            placeholder="Second Date To Compare"
            defaultValue={secondDateToCompare}
          />
        </Form.Group>
        <ResponsiveContainer width="100%" height={500}>
          <LineChart
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              label={{
                value: "TIME",
                offset: 50,
                position: "insideBottomRight",
              }}
              allowDuplicatedCategory={false}
            />
            <YAxis
              label={{ value: "REVENUE $", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            {dataForFirstSet.length > dataForSecondSet.length ? (
              <>
                <Line
                  data={dataForFirstSet}
                  type="monotone"
                  dataKey={firstDateToCompare}
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={4}
                />
                <Line
                  data={dataForSecondSet}
                  type="monotone"
                  dataKey={secondDateToCompare}
                  stroke="#82ca9d"
                  strokeWidth={4}
                />
              </>
            ) : (
              <>
                <Line
                  data={dataForSecondSet}
                  type="monotone"
                  dataKey={secondDateToCompare}
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={4}
                />
                <Line
                  data={dataForFirstSet}
                  type="monotone"
                  dataKey={firstDateToCompare}
                  stroke="#82ca9d"
                  strokeWidth={4}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </Col>
    </Row>
  );
};

export default AdminAnalyticsPageComponent;
