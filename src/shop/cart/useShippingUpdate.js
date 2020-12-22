import { gql, useMutation } from "@apollo/client";
import { useCallback } from "react";
import { useCart } from "./useCart";
import { FragmentCustomer } from "../fragments";

const UpdateShippingMutation = gql`
  mutation UpdateShippingMutation($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      customer {
        ...CustomerFragment
      }
    }
  }
  ${FragmentCustomer}
`;

export const useShippingUpdate = (onCompleted) => {
  const { refreshCart, setCustomer, refreshing, customer } = useCart();

  const [mutate, { loading }] = useMutation(UpdateShippingMutation, {
    errorPolicy: "all",
    onCompleted: function (data) {
      refreshCart();
      setCustomer(data.updateCustomer.customer);

      if (onCompleted) {
        onCompleted(data);
      }
    },
  });

  const updateShipping = useCallback(
    (shipping = {}) => {
      const clientMutationId =
        Math.random().toString(36).substring(2) +
        new Date().getTime().toString(36);

      const input = { shipping, clientMutationId };

      mutate({ variables: { input } });
    },
    [mutate]
  );

  return {
    updatingShipping: loading,
    updateShipping,
    refreshing,
    customer,
  };
};
