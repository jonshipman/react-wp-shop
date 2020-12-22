import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PageWidth, PostContent, useNode, Title } from "react-wp-gql";
import { FormGroup, Button } from "react-wp-form";
import { DetailsForm } from "./CheckoutDetailForms";
import { CartDisplay, useCart, useShippingUpdate } from "../cart";
import { PaymentMethod } from "./PaymentMethod";
import { Redirect } from "react-router-dom";
import { ProcessCheckout } from "./ProcessCheckout";
import { ShippingMethod } from "./ShippingMethod";
import { ExternalPaymentMethod } from "./ExternalPaymentMethod";

export const CheckoutPage = () => {
  const { node } = useNode();

  const [checkoutState, setCheckout] = useState({
    customerNote: "",
    isPaid: false,
    shipToDifferentAddress: false,
  });

  const [form, setForm] = useState({
    billing_country: "US",
    shipping_country: "US",
  });
  const errors = useRef({});
  const fields = useRef([]);

  // Merges checkoutState and form into CheckoutInput.
  const checkout = useMemo(() => {
    const billing = {};
    const shipping = {};

    Object.entries(form).forEach(([key, value]) => {
      if (key.indexOf("billing_") === 0) {
        billing[key.replace("billing_", "")] = value;
      }

      if (key.indexOf("shipping") === 0) {
        shipping[key.replace("shipping_", "")] = value;
      }
    });

    return {
      ...checkoutState,
      billing,
      shipping,
    };
  }, [checkoutState, form]);

  const [openExternalPayment, setOpenExternalPayment] = useState(false);
  const [checking, setChecking] = useState(false);
  const [process, setProcess] = useState(false);
  const [message, setMessage] = useState();
  const { cart, customer } = useCart();
  const cartItems = cart?.contents?.nodes || [];
  const { updateShipping } = useShippingUpdate();

  // Updates the shipping/billing if there's already session data available.
  useEffect(() => {
    const __form = {};

    if (!!customer?.shipping) {
      Object.entries(customer.shipping).forEach(([key, value]) => {
        if (value && !key.includes("typename")) {
          __form[`shipping_${key}`] = value;
        }
      });
    }

    if (!!customer?.billing) {
      Object.entries(customer.billing).forEach(([key, value]) => {
        if (value && !key.includes("typename")) {
          __form[`billing_${key}`] = value;
        }
      });
    }

    if (Object.keys(__form).length > 0) {
      setForm((e) => ({ ...e, ...__form }));
    }
  }, [customer]);

  /**
   * Copies "billing_" fields to "shipping_" fields, otherwise clears the "shipping_ fields.
   *
   * @param {object} e Event.
   * @return {void}
   */
  const copyShipping = (e) => {
    const checked = !e.target.checked;

    if (checked) {
      setCheckout((existing) => ({
        ...existing,
        shipToDifferentAddress: true,
      }));

      const _form = {};
      fields.current.forEach((_f) => {
        if (_f.indexOf("shipping_") === 0) {
          _form[_f] = "";
        }
      });
      setForm((e) => ({ ...e, ..._form }));
    } else {
      setCheckout((existing) => ({
        ...existing,
        shipToDifferentAddress: false,
      }));

      const _form = {};
      fields.current.forEach((_f) => {
        if (_f.indexOf("billing_") === 0) {
          _form[_f.replace("billing_", "shipping_")] = form[_f];
        }
      });
      setForm((e) => ({ ...e, ..._form }));

      if (_form.shipping_postcode) {
        updateShipping({ postcode: _form.shipping_postcode });
      }
    }
  };

  /**
   * Goes from checking to processing.
   */
  useEffect(() => {
    if (checking) {
      setChecking(false);
      setProcess(true);
    }
  }, [checking]);

  /**
   * We start the checking process which will loop over the details form and create errors.
   *
   * @return {void}
   */
  const StartProcess = () => {
    setMessage("");

    const _form = {};
    fields.current.forEach((_ff) => {
      if (!form[_ff] || form[_ff] === undefined) {
        _form[_ff] = "";
      }
    });
    setForm((e) => ({ ...e, ..._form }));

    setChecking(true);
  };

  /**
   * Adds the shipping method to the checkout state.
   *
   * @return {void}
   */
  const setShippingMethod = useCallback(
    (method) =>
      setCheckout((existing) => ({
        ...existing,
        shippingMethod: method,
      })),
    [setCheckout]
  );

  /**
   * Properties for the cart display.
   * Adds items, meta JSX, and button JSX.
   */
  const CartDisplayProps = {
    cartItems,
    meta: <PaymentMethod {...{ checkout, setCheckout }} />,
    button: (
      <Button onClick={StartProcess} loading={checking || process}>
        Purchase
      </Button>
    ),
  };

  /**
   * If there are no cart items, take the user to the cart.
   */
  if (cartItems.length === 0) {
    return <Redirect to="/cart" />;
  }

  return (
    <div className="form--leadform">
      <Title>{node.title}</Title>
      <PageWidth className="mv4">
        {message && (
          <div className="error-message red fw7 f6 mb3">{message}</div>
        )}
        <div className="flex-l nl4 nr4 f6">
          <div className="ph4 w-50-l">
            <DetailsForm
              prefix="billing_"
              label="Billing details"
              {...{ fields, form, setForm, errors }}
            />
            {cart?.needsShippingAddress && (
              <div className="mv3 cb">
                <label htmlFor="copy-shipping">
                  <input
                    type="checkbox"
                    id="copy-shipping"
                    onChange={copyShipping}
                  />{" "}
                  Copy to shipping
                </label>
              </div>
            )}
          </div>
          <div className="ph4 w-50-l">
            {cart?.needsShippingAddress && (
              <DetailsForm
                prefix="shipping_"
                label="Shipping details"
                copyFromBilling
                {...{ fields, form, setForm, errors }}
              />
            )}
          </div>
        </div>

        <div className="mv4">
          <FormGroup
            label="Notes"
            value={checkoutState.customerNote}
            type="textarea"
            onChange={(value) =>
              setCheckout((existing) => ({ ...existing, customerNote: value }))
            }
          />
        </div>

        <ShippingMethod setMethod={setShippingMethod} />

        <div>
          <CartDisplay {...CartDisplayProps} />
        </div>

        {node.content && <PostContent>{node.content}</PostContent>}
      </PageWidth>
      {process && (
        <ProcessCheckout
          {...{
            checkout,
            setProcess,
            setMessage,
            errors,
            setOpenExternalPayment,
          }}
        />
      )}
      {openExternalPayment && (
        <ExternalPaymentMethod
          {...{ checkout, setOpenExternalPayment, setMessage }}
        />
      )}
    </div>
  );
};
