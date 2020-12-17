import React from "react";
import { Link } from "react-router-dom";
import { Row } from "../../components";
import { useCart } from "./useCart";

export const CartItem = ({ item, mini }) => {
  const { product, quantity, total, key } = item || {};
  const { featuredImage, name, price, uri } = product?.node || {};
  const { sourceUrl } = featuredImage?.node || {};
  const { removeFromCart, removing } = useCart();

  const onClick = () => {
    if (!removing) {
      removeFromCart(key);
    }
  };

  return (
    <Row className="flex items-center relative z-1">
      <div
        className="absolute z-1 top-0 right-0 pa2 hover-primary pointer"
        {...{ onClick }}
      >
        {removing ? "..." : "×"}
      </div>
      {sourceUrl ? (
        <div className="w3 flex-none mr2">
          <div className="aspect-ratio aspect-ratio--1x1">
            <div
              className="aspect-ratio--object bg-center cover"
              style={{ backgroundImage: `url("${sourceUrl}")` }}
            />
          </div>
        </div>
      ) : (
        <div className="h3" />
      )}
      <div className="f6 flex-auto ph2">
        <Link to={uri} className="color-inherit no-underline hover-primary">
          {name}
        </Link>
      </div>
      <div className="ml-auto tr">
        <div className="f6">{total}</div>
        {(!mini || quantity > 1) && (
          <div style={{ fontSize: "0.6rem" }}>
            {quantity} @ {price}
          </div>
        )}
      </div>
    </Row>
  );
};
