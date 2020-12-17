import { useMutation, gql } from "@apollo/client";
import { FragmentOrder } from "../fragments";

const Mutation = gql`
  mutation CheckoutMutation($input: CheckoutInput!) {
    checkout(input: $input) {
      clientMutationId
      result
      redirect
      order {
        ...OrderFragment
      }
      customer {
        id
      }
    }
  }
  ${FragmentOrder}
`;

export const useCheckout = (props) => {
  const { onCompleted } = props || {};
  const [mutate] = useMutation(Mutation, { onCompleted });

  const checkoutMutation = (checkout) => {
    const clientMutationId =
      Math.random().toString(36).substring(2) +
      new Date().getTime().toString(36);

    const input = {
      ...checkout,
      clientMutationId,
    };

    mutate({ variables: { input } });
  };

  return { checkoutMutation };
};
