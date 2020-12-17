import { useQuery, gql } from "@apollo/client";
import { useEffect, useMemo } from "react";
import { LiteralProductCategory } from "./fragments";

const QueryShopPage = gql`
  query ShopPage($afterCats: String, $first: Int, $last: Int, $before: String, $after: String) {
    shopPage: productCategories(first: 3, after: $afterCats, where: { hideEmpty: true }) @connection(key: "shop-page", filter: ["after"]) {
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

export const useShopPage = () => {
  const { fetchMore, data, error, loading } = useQuery(QueryShopPage, {
    errorPolicy: "all",
  });

  const edges = useMemo(
    () =>
      data?.shopPage?.edges?.length > 0
        ? data.shopPage.edges.filter(
            (n, index) =>
              data.shopPage.edges.map((n) => n.node.id).indexOf(n.node.id) ===
              index
          )
        : [],
    [data]
  );
  const pageInfo = data ? data.shopPage.pageInfo : {};
  const { hasNextPage, endCursor } = pageInfo || {};

  useEffect(() => {
    if (hasNextPage && !!endCursor) {
      fetchMore({ variables: { afterCats: endCursor } });
    }
  }, [endCursor, fetchMore, hasNextPage]);

  return {
    edges,
    endCursor,
    hasNextPage,
    error,
    loading,
  };
};
