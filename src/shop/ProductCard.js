import React, { useState } from "react";
import { PostContent, useNode, Loading } from "react-wp-gql";
import { Link } from "react-router-dom";
import { useCart } from "../hooks";

import { ReactComponent as Cart } from "../static/images/shopping-cart.svg";

const Preload = ({ uri }) => {
  useNode({ uri });
  return null;
};

const Start = ({ className = "", ...props }) => {
  return <div className={`o-0 ${className}`} {...props} />;
};

const Out = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate__animated animate__faster animate__slideOutLeft ${className}`}
      {...props}
    />
  );
};

const Over = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate__animated animate__faster animate__slideInLeft ${className}`}
      {...props}
    />
  );
};

export const ProductCard = ({
  databaseId,
  name,
  featuredImage,
  stockQuantity = 1,
  uri,
  content,
  price,
}) => {
  const [entered, setEntered] = useState(false);
  const [animation, setAnimation] = useState({ component: Start });
  const { node } = featuredImage || {};
  const { sourceUrl = "" } = node || {};

  const { addToCart, adding } = useCart();

  const onMouseEnter = () => {
    setEntered(true);
    setAnimation({ component: Over });
  };

  const onMouseLeave = () => {
    setAnimation({ component: Out });
  };

  const Animate = animation.component;

  const cartItem = {
    productId: databaseId,
    quantity: 1,
  };

  return (
    <div
      className="bg-center cover overflow-hidden"
      style={{ backgroundImage: `url("${sourceUrl}")` }}
      {...{ onMouseLeave, onMouseEnter }}
    >
      {entered && <Preload {...{ uri }} />}
      <div className="aspect-ratio aspect-ratio--3x4">
        <div className="aspect-ratio--object">
          <Animate className="h-100 flex items-center relative z-1">
            <div className="w-100 relative z-2 tc dark-gray pa3">
              <div className="fw4 f4 lh-title">{name}</div>
              <PostContent trim className="f7">
                {content}
              </PostContent>
              <div className="mt3 f4">{price}</div>
            </div>

            <div className="absolute absolute--fill z-1 bg-gradient-1" />

            <div className="absolute z-3 bottom-0 left-0 f7 pa3">
              {!!stockQuantity ? (
                <div
                  className="flex items-center pointer"
                  onClick={() => addToCart(cartItem)}
                >
                  <div className="mr2">
                    {adding ? (
                      <div className="f7">
                        <Loading />
                      </div>
                    ) : (
                      <Cart width={16} height={16} className="fill-dark-gray" />
                    )}
                  </div>
                  <div>Add to cart</div>
                </div>
              ) : (
                <div>OUT OF STOCK</div>
              )}
            </div>

            {uri && (
              <Link to={uri} className="absolute absolute--fill z-2 db" />
            )}
          </Animate>
        </div>
      </div>
    </div>
  );
};
