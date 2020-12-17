import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { gql, useMutation } from "@apollo/client";
import { Row } from "../../components";
import { useCart } from "../cart";
import { FragmentCart } from "../fragments";

const UpdateShippingMutation = gql`
  mutation UpdateShippingMutation($input: UpdateShippingMethodInput!) {
    updateShippingMethod(input: $input) {
      cart {
        ...cartNode
      }
      clientMutationId
    }
  }
  ${FragmentCart}
`;

export const ShippingMethod = ({ setMethod }) => {
  const { cart, setCart } = useCart();
  const _shippingMethods = useRef(cart.availableShippingMethods);

  const shippingMethods = useMemo(() => {
    const rates = {};
    if (_shippingMethods.current?.length > 0) {
      _shippingMethods.current.forEach((method) => {
        method.rates.forEach((rate) => {
          rates[rate.methodId] = rate;
        });
      });
    }

    return Object.values(rates);
  }, [_shippingMethods]);

  const [updateShippingMutate] = useMutation(UpdateShippingMutation, {
    onCompleted: (data) => {
      _shippingMethods.current =
        data.updateShippingMethod.cart.availableShippingMethods;
      setCart(data.updateShippingMethod.cart);
    },
  });

  const mutationWrapper = useCallback(
    (shippingMethods) => {
      const clientMutationId =
        Math.random().toString(36).substring(2) +
        new Date().getTime().toString(36);

      const input = { clientMutationId, shippingMethods };
      updateShippingMutate({ variables: { input } });
    },
    [updateShippingMutate]
  );

  useEffect(() => {
    if (shippingMethods.length === 1) {
      const method = shippingMethods[0].methodId;
      setMethod(method);
      mutationWrapper(method);
    }
  }, [setMethod, shippingMethods, mutationWrapper]);

  if (shippingMethods.length === 0) {
    return <div>Please setup shipping methods in WP-Admin</div>;
  }

  if (shippingMethods.length === 1) {
    return null;
  }

  return (
    <div className="mv3">
      <div className="fw7 f4">Shipping Method</div>

      <div className="bg-off-white">
        {shippingMethods.map((node) => (
          <Row key={node.id}>
            <label
              htmlFor={`shipping-method-${node.id}`}
              className="pointer db w-100"
            >
              <input
                id={`shipping-method-${node.id}`}
                type="radio"
                name="shippingMethod"
                value={node.methodId}
                onChange={(e) => {
                  const method = e.target.value;
                  setMethod(method);
                  mutationWrapper(method);
                }}
              />{" "}
              {`${node.title}: ${node.description}`}
            </label>
          </Row>
        ))}
      </div>
    </div>
  );
};
