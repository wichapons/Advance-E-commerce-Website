import UserOrderDetailsPageComponent from "./components/UserOrderDetailsPageComponent";
import { useSelector } from "react-redux";
import axios from "axios";
import { loadScript } from "@paypal/paypal-js";


const UserOrderDetailsPage = () => {
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

  const getUser = async () => {
    const { data } = await axios.get("/api/users/profile/" + userInfo._id);
    return data;
  };

  const getOrder = async (orderId) => {
    const { data } = await axios.get("/api/orders/user/" + orderId);
    return data;
  };


  // Function to load the PayPal JavaScript SDK and render PayPal buttons on the webpage.
  const loadPayPalScript = (cartSubtotal, cartItems,orderId, updateStateAfterOrder) => {
    // Load the PayPal JavaScript SDK using the provided client ID.
    loadScript({
      "client-id":
        (import.meta.env.VITE_PAYPAL_CREDENTIAL),
    })
      .then((paypal) => {
        // Once the SDK is loaded successfully, render the PayPal buttons with the given cart subtotal and items.
        paypal.Buttons(buttons(cartSubtotal, cartItems,orderId, updateStateAfterOrder)).render("#paypal-container-element");
      })
      .catch((err) => {
        // If there is an error while loading the SDK, log the error message to the console.
        console.error("failed to load the PayPal JS SDK script", err);
      });
  };

  // Function to define the configuration for the PayPal buttons.
  const buttons = (cartSubtotal, cartItems,orderId, updateStateAfterOrder) => {
    return {
      // Function to create the order when the user clicks the PayPal button.
        createOrder: function (data, actions) {
            return actions.order.create({
              // Define the purchase unit with the cart subtotal and breakdown of items.
                purchase_units: [
                    {
                        amount: {
                            value: cartSubtotal,
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: cartSubtotal,
                                }
                            }
                        },
                        // Map cartItems to PayPal items format (name, unit amount, quantity).
                        items: cartItems.map(product => {
                            return {
                               name: product.name,
                                unit_amount: {
                                   currency_code: "USD", 
                                   value: product.price,
                                },
                                quantity: product.quantity,
                            }
                        })
                    }
                ]
            })
        },
        // Event handler when the user cancels the payment process.
        onCancel: onCancelHandler,
        // Event handler when the user approves the payment and completes the transaction.
        onApprove: function (data, actions) {
          //actions.order.capture() is a method provided by the PayPal SDK. It is used to capture the payment and retrieve the order details.
          return actions.order.capture().then(function (orderData) {
            // Retrieve the transaction details from the captured order data.
              let transaction = orderData.purchase_units[0].payments.captures[0];
              // Check if the transaction status is "COMPLETED" and the transaction amount matches the cart subtotal.
              if (transaction.status === "COMPLETED" && Number(transaction.amount.value) === Number(cartSubtotal)) {
                // If the transaction is completed and the amount matches, update the order in the database.
                updateOrder(orderId)
                .then(data => {
                  if (data.isPaid) {
                      updateStateAfterOrder(data.paidAt);
                  }
              })
              .catch((er) => console.log(er));
          }
      })
  },
  onError: onErrorHandler,
}
}


const onCancelHandler = function () {
    console.log("cancel");
}

const updateOrder = async (orderId) => {
  const { data } = await axios.put("/api/orders/paid/" + orderId);
  return data;
}

const onErrorHandler = function (err) {
    console.log("error");
}

  return (
    <UserOrderDetailsPageComponent
      userInfo={userInfo}
      getUser={getUser}
      getOrder={getOrder}
      loadPayPalScript={loadPayPalScript}
    />
  );
};

export default UserOrderDetailsPage;
