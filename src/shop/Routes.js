import React from "react";
import { Switch, Route } from "react-router-dom";
import { Node } from "react-wp-gql";
import { CartPage } from "./cart";
import { CheckoutPage } from "./checkout";
import { ReceiptPage } from "./receipt";
import { ShopPage } from "./ShopPage";

export const ShopRoutes = () => {
  return (
    <Switch>
      <Route exact path="/shop">
        <ShopPage />
      </Route>

      <Route exact path="/cart">
        <CartPage />
      </Route>

      <Route exact path="/checkout">
        <CheckoutPage />
      </Route>

      <Route path="/checkout/order-received/:id">
        <ReceiptPage />
      </Route>

      <Route exact path="/product-category/:name">
        <Node isArchive columns={3} perPage={9} />;
      </Route>
    </Switch>
  );
};
