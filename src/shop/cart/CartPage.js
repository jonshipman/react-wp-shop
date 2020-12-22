import React, { useEffect, useRef } from "react";
import { Node, PageWidth } from "react-wp-gql";
import { Button } from "react-wp-gql";
import { useCart } from "./useCart";
import { CartDisplay } from "./CartDisplay";
import { useShippingUpdate } from "./useShippingUpdate";

const CartEmpty = () => {
  return (
    <div className="tc">
      <div className="mb4">Your cart is empty.</div>
      <Button to="/shop">Shop</Button>
    </div>
  );
};

const CartPageCartDisplay = ({ className = "", ...props }) => {
  const shippingZip = useRef({});
  const {
    updateShipping,
    updatingShipping,
    refreshing,
    customer,
  } = useShippingUpdate();

  const loading = updatingShipping || refreshing;

  useEffect(() => {
    if (!shippingZip?.current?.value && !!customer?.shipping?.postcode) {
      shippingZip.current.value = customer.shipping.postcode;
    }
  }, [shippingZip, customer]);

  return (
    <PageWidth {...{ className }}>
      <CartDisplay {...props} />
      <div className="tr mt3">
        <div className="form--group">
          <div className="flex items-start justify-end">
            <label htmlFor="shipping-zip">Shipping Zip</label>
            <div className="flex-none ph3">
              <input
                id="shipping-zip"
                ref={shippingZip}
                type="text"
                className="form--input"
                style={{ width: "5rem" }}
              />
            </div>
            <Button
              {...{ loading }}
              onClick={() =>
                updateShipping({ postcode: shippingZip.current.value })
              }
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </PageWidth>
  );
};

export const CartPage = () => {
  const { cart } = useCart();
  const cartItems = cart?.contents?.nodes || [];

  const CartContent = !cart || cart.isEmpty ? CartEmpty : CartPageCartDisplay;

  return (
    <Node
      wrap={CartContent}
      {...{ cartItems }}
      button={<Button to="/checkout">Checkout</Button>}
    />
  );
};
