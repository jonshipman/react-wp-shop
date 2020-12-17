import { useQuery, gql } from "@apollo/client";

const Query = gql`
  query Methods {
    paymentGateways {
      nodes {
        title
        id
        icon
        description
      }
    }
    shippingMethods {
      nodes {
        title
        id
        description
        databaseId
      }
    }
  }
`;

export const useMethods = () => {
  const { data, loading, error } = useQuery(Query, { errorPolicy: "all" });

  const paymentGateways = data ? data.paymentGateways?.nodes || [] : [];
  const shippingMethods = data ? data.shippingMethods?.nodes || [] : [];

  return {
    shippingMethods,
    paymentGateways,
    error,
    loading,
  };
};
