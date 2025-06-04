import AnalyticsPageComponent from "./components/AnalyticsPageComponent";
import axios from "axios";
import { io } from "socket.io-client";

const fetchOrdersForFirstDate = async (abctrl, firstDateToCompare) => {
  // Fetch orders data for the first date to compare
  try{
    const response = await axios.get("/api/orders/analysis/" + firstDateToCompare, {
      signal: abctrl.signal,
    });
    return response.data;
  }catch(err){
    console.log('get api Order Analysis error',err);
    return;
  } 
}

const fetchOrdersForSecondDate = async (abctrl, secondDateToCompare) => {
  // Fetch orders data for the second date to compare
  const response = await axios.get("/api/orders/analysis/" + secondDateToCompare, {
    signal: abctrl.signal,
  });
  return response.data;
};


const AdminAnalyticsPage = () => {
  return (
    <AnalyticsPageComponent fetchOrdersForFirstDate={fetchOrdersForFirstDate} fetchOrdersForSecondDate={fetchOrdersForSecondDate} socketIOClient={io} />
  )
};

export default AdminAnalyticsPage;

