import { Row, Col, Form } from "react-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer}from "recharts";
import { useState } from "react";

const AdminAnalyticsPageComponent = () => {
  const [firstDateToCompare, setFirstDateToCompare] = useState(
    new Date().toISOString().substring(0, 10)
  );
  let previousDay = new Date();
  previousDay.setDate(previousDay.getDate() - 1);
  const [secondDateToCompare, setSecondDateToCompare] = useState(
    new Date(previousDay).toISOString().substring(0, 10)
  );

  const firstDateHandler = (e) => {
    setFirstDateToCompare(e.target.value);
  };

  const secondDateHandler = (e) => {
    setSecondDateToCompare(e.target.value);
  };

  const data = [
    {
      name: "12:00 AM",
      2022: 4000,
      2021: 4100,
    },
    {
      name: "1:00 AM",
      2022: 4200,
      2021: 4300,
    },
    {
      name: "2:00 AM",
      2022: 4400,
      2021: 4500,
    },
    {
      name: "3:00 AM",
      2022: 4600,
      2021: 4600,
    },
    {
      name: "4:00 AM",
      2022: 4800,
      2021: 5000,
    },
    {
      name: "5:00 AM",
      2022: 5000,
      2021: 5200,
    },
    {
      name: "6:00 AM",
      2022: 5200,
      2021: 5400,
    },
    {
      name: "7:00 AM",
      2022: 5600,
      2021: 6000,
    },
    {
      name: "8:00 AM",
      2022: 6000,
      2021: 6300,
    },
    {
      name: "9:00 AM",
      2022: 6400,
      2021: 7000,
    },
    {
      name: "10:00 AM",
      2022: 6800,
      2021: 7200,
    },
    {
      name: "11:00 AM",
      2022: 7000,
      2021: 7800,
    },
    {
      name: "12:00 PM",
      2022: 7200,
      2021: 8200,
    },
    {
      name: "1:00 PM",
      2022: 7500,
      2021: 8400,
    },
    {
      name: "2:00 PM",
      2022: 7700,
      2021: 9000,
    },
    {
      name: "3:00 PM",
      2022: 8000,
      2021: 9500,
    },
    {
      name: "4:00 PM",
      2022: 8400,
      2021: 10000,
    },
    {
      name: "5:00 PM",
      2022: 9000,
      2021: 12000,
    },
    {
      name: "6:00 PM",
      2022: 10500,
      2021: 17000,
    },
    {
      name: "7:00 PM",
      2022: 16000,
      2021: 20000,
    },
    {
      name: "8:00 PM",
      2022: 17000,
      2021: 21000,
    },
    {
      name: "9:00 PM",
      2022: 17400,
      2021: 22000,
    },
    {
      name: "10:00 PM",
      2021: 23000,
      2022: 19500,
    },
    {
      name: "11:00 PM",
      2021: 23500,
      2022: 21000,
    },
  ];
  return (
    <Row className="m-5">
      <Col md={2}>
        <AdminLinksComponent />
      </Col>
      <Col md={10}>
        <h1>Black Friday Cumulative Revenue {firstDateToCompare} VS {secondDateToCompare}</h1>
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
            data={data}
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
            <Line
              type="monotone"
              dataKey="2021"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              strokeWidth={4}
            />
            <Line
              type="monotone"
              dataKey="2022"
              stroke="#82ca9d"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </Col>
    </Row>
  );
};

export default AdminAnalyticsPageComponent;
