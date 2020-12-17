import React, { useCallback, useEffect } from "react";
import { Row } from "../../components";
import { useMethods } from "./useMethods";
import { Loading } from "react-wp-gql";

export const PaymentMethod = ({ checkout, setCheckout }) => {
  const { paymentGateways, loading } = useMethods();

  const setMethod = useCallback(
    (paymentMethod) => {
      setCheckout((existing) => ({
        ...existing,
        paymentMethod,
      }));
    },
    [setCheckout]
  );

  useEffect(() => {
    if (paymentGateways.length === 1) {
      setMethod(paymentGateways[0].id);
    }
  }, [setMethod, paymentGateways]);

  if (paymentGateways.length === 0 && !loading) {
    return <div>Please setup payment gateway in WP-Admin</div>;
  }

  if (paymentGateways.length === 1) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mv3">
      <div className="fw7 f4">Payment Method</div>
      {paymentGateways.length > 1 && (
        <div className="bg-off-white">
          {paymentGateways.map((node) => (
            <Row key={node.id}>
              <label
                htmlFor={`payment-gateway-${node.id}`}
                className="pointer db w-100"
              >
                <input
                  id={`payment-gateway-${node.id}`}
                  type="radio"
                  name="paymentGateway"
                  value={node.id}
                  checked={checkout.paymentGateway === node.id}
                  onChange={(e) => setMethod(e.target.value)}
                />{" "}
                {node.description}
              </label>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
};
