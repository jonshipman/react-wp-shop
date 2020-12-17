import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useCart } from "../cart";
import { SquarePayment } from "../gateway";
import { useCheckout } from "./useCheckout";

export const ExternalPaymentMethod = ({
  checkout,
  setOpenExternalPayment,
  setMessage,
}) => {
  const history = useHistory();
  const { setOrder, emptyCart } = useCart();

  const { checkoutMutation } = useCheckout({
    onCompleted: (data) => {
      if (data.errors) {
        setMessage(JSON.stringify(data.errors));
        setOpenExternalPayment(false);
        (window || {}).scrollTo(0, 0);
        return;
      }

      if (!data.checkout.result) {
        setMessage("There was an error processing your payment.");
        setOpenExternalPayment(false);
        (window || {}).scrollTo(0, 0);
        return;
      }

      if (data.checkout.redirect) {
        const url = new URL(data.checkout.redirect);
        setOrder(data.checkout.order);
        emptyCart();
        history.push(`${url.pathname}${url.search}`);
      }
    },
  });

  const onPaymentSuccess = ({ metaData, transactionId }) => {
    checkoutMutation({
      ...checkout,
      transactionId,
      metaData,
    });
  };

  const method = checkout.paymentMethod;

  // Scrolls window to the center.
  useEffect(() => {
    (window || {}).scrollTo(0, (window || {}).screen.height / 2);
  }, []);

  return (
    <div className="absolute absolute--fill z-3 bg-black-50 flex items-center">
      <div className="bg-white pa3 center">
        <div
          className="pv3 f4 bg-near-white tc mb2 pointer"
          onClick={() => setOpenExternalPayment(false)}
        >
          <div>Cancel</div>
        </div>
        <div>
          {!!method && method === "square_credit_card" && (
            <SquarePayment {...{ checkout, onPaymentSuccess }} />
          )}
        </div>
      </div>
    </div>
  );
};
