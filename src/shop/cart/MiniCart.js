import React from "react";
import { CartItem } from "./CartItem";
import { CartTotals } from "./CartTotals";

export const MiniCart = (props) => {
  let { items } = props || {};
  items = items || [];

  return (
    <div className="bg-off-white">
      {items.map((item) => {
        return <CartItem mini key={item.key} {...{ item }} />;
      })}
      <CartTotals mini />
    </div>
  );
};
