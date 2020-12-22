import React, { useEffect } from "react";
import { Button } from "react-wp-form";
import { useCart } from "../cart";
import { PageWidth, Seo, Title } from "react-wp-gql";

export const ReceiptPage = () => {
  const { setCart, order } = useCart();
  useEffect(() => {
    setCart(undefined);
  }, [setCart]);

  if (!order?.orderNumber) {
    return null;
  }

  return (
    <div>
      <Seo title="Receipt" />
      <Title>Order Complete</Title>
      <PageWidth className="mv4">
        <div className="tc">
          Thank you for your order. Please check your email for your order
          confirmation.
        </div>
        <div className="mt3">
          <div className="f3 fw7">Details</div>
          <div className="mv3">
            <span className="fw7">Order Number:</span>
            <span> {order?.orderNumber}</span>
          </div>
          <div className="mv3">
            <span className="fw7">Items</span>
          </div>
          <table className="f6 w-100 collapse">
            <thead>
              <tr>
                <th className="tl pa3">Name</th>
                <th className="pa3">Quantity</th>
                <th className="tr pa3">Total</th>
              </tr>
            </thead>
            <tbody>
              {order?.lineItems?.nodes.map(
                ({ product: { name, id }, quantity, total }) => (
                  <tr key={id} className="striped--near-white">
                    <th className="tl pa3">{name}</th>
                    <td className="tc pa3">{quantity}</td>
                    <td className="tr pa3">${total}</td>
                  </tr>
                )
              )}
              <tr className="striped--near-white">
                <td colSpan="3" />
              </tr>
              <tr className="striped--near-white">
                <th colSpan="2" className="tl pa3">
                  Total
                </th>
                <td className="tr pa3">{order?.total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="tc mt3">
          <Button onClick={() => (window || {}).print()}>Print</Button>
        </div>
      </PageWidth>
    </div>
  );
};
