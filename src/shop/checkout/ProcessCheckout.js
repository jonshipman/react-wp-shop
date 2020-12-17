import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useCart } from "../cart";
import { useCheckout } from "./useCheckout";

/**
 * React component that processes the checkout.
 *
 * @param {object} checkout Checkout state.
 * @param {function} setProcess Changes the process state.
 * @param {function} setMessage Changes the message state.
 * @param {object} errors Ref.
 * @param {function} setOpenExternalPayment Changes openExternalPayment state.
 * @return {null}
 */
export const ProcessCheckout = ({
  checkout,
  setProcess,
  setMessage,
  errors,
  setOpenExternalPayment,
}) => {
  const history = useHistory();
  const { setOrder, emptyCart } = useCart();

  /**
   * Handle for payments through WooCommerce.
   *
   * @param {object} data Data results from Apollo Client Mutation.
   * @return {void}
   */
  const onCompleted = (data) => {
    if (data.errors || data.checkout.result === null) {
      console.error(data.errors);
      setMessage("Square is the only payment process that's implemented.");
    }

    if (data.checkout.redirect) {
      const url = new URL(data.checkout.redirect);
      setOrder(data.checkout.order);
      emptyCart();
      history.push(`${url.pathname}${url.search}`);
    }

    console.log(data.checkout);
  };

  const { checkoutMutation } = useCheckout({ onCompleted });
  const startProcessing =
    Object.values(errors.current).filter((o) => !!o).length === 0;

  /**
   * Effect that checks payment method and errors to determine if mutation executes.
   */
  useEffect(() => {
    // Process false to ensure component is rendered but once.
    setProcess(false);

    // When errors are true, we count the length and if there are none, startProcessing is true.
    let _startProcessing = startProcessing;

    // If there are errors, scroll to top and display the message.
    if (!_startProcessing) {
      setMessage("Please resolve the errors below.");
      (window || {}).scrollTo(0, 0);
    }

    // If squareup is configured, open external payment and stop processing.
    if (_startProcessing && checkout.paymentMethod === "square_credit_card") {
      _startProcessing = false;
      setOpenExternalPayment(true);
    }

    // If checks passed, start the mutation.
    if (_startProcessing) {
      checkoutMutation(checkout);
    }
  }, [
    setProcess,
    checkout,
    checkoutMutation,
    setOpenExternalPayment,
    setMessage,
    startProcessing,
  ]);

  return null;
};
