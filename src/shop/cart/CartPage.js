import React from "react";
import { Node, PageWidth } from "react-wp-gql";
import { Button } from "../../components";
import { useCart } from "./useCart";
import { CartDisplay } from "./CartDisplay";

const CartEmpty = () => {
  return (
    <div className="tc">
      <div className="mb4">Your cart is empty.</div>
      <Button to="/shop">Shop</Button>
    </div>
  );
};

const CartPageCartDisplay = ({ className = "", ...props }) => {
  return (
    <PageWidth {...{ className }}>
      <CartDisplay {...props} />
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
