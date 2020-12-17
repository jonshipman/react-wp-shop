import React from "react";
import { CartItem } from "./CartItem";
import { CartTotals } from "./CartTotals";

export const CartDisplay = ({ cartItems, button, meta }) => {
  if (cartItems?.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="bg-off-white">
        {cartItems.map((item) => {
          return <CartItem key={item.key} {...{ item }} />;
        })}
        <CartTotals />
      </div>
      {meta && <div className="mv3">{meta}</div>}
      {button && <div className="tr mt3">{button}</div>}
    </div>
  );
};
