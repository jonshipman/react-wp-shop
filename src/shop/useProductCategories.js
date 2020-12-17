import { useQuery, gql } from "@apollo/client";
import { useMemo } from "react";
import { LiteralProductCategory } from "./fragments";

const QueryProductMenu = gql`
  query ProductMenu($first: Int, $last: Int, $before: String, $after: String) {
    productCategories(first: 99, where: { hideEmpty: true }) @connection(key: "product-menu") {
      edges {
        node {
          ${LiteralProductCategory}
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const useProductCategories = () => {
  const { data = {}, loading, error } = useQuery(QueryProductMenu);

  const productCategories = useMemo(
    () =>
      data?.productCategories?.edges?.length > 0
        ? data.productCategories.edges
            .filter(
              (n, index) =>
                data.productCategories.edges
                  .map((n) => n.node.id)
                  .indexOf(n.node.id) === index
            )
            .map((n) => n.node)
        : [],
    [data]
  );

  return {
    productCategories,
    error,
    loading,
  };
};
