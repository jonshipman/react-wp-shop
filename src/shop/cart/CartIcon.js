import React from "react";
import { Link } from "react-router-dom";
import { MiniCart } from "./MiniCart";
import { useCart } from "./useCart";
import { ReactComponent as Cart } from "../../static/images/shopping-cart.svg";

const CartSize = 20;

export const CartIcon = ({ className }) => {
  const { cart } = useCart();

  const { contents } = cart || {};
  const { itemCount = 0, nodes } = contents || {};

  const cartItems = nodes || [];

  return (
    <div {...{ className }}>
      <div className="relative z-1 hide-child-l dib">
        <div className="flex items-center">
          <Link to="/cart">
            <Cart
              width={CartSize}
              height={CartSize}
              className="fill-secondary relative"
              style={{ top: "3px" }}
            />
          </Link>
          {itemCount > 0 && (
            <div
              className="bg-secondary ba b--white shadow-4 white br-100 w1 h1 flex items-center tc f7"
              style={{ fontSize: "0.7rem" }}
            >
              <div className="w-100">{itemCount}</div>
            </div>
          )}
          {cartItems.length > 0 && (
            <div className="dn db-l child absolute z-1 right-0 top-100 w5 shadow-4 b--navy bt bw2">
              <MiniCart items={cartItems} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
