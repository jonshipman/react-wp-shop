import React, { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, gql, useLazyQuery } from "@apollo/client";
import { FragmentCart, FragmentOrder, FragmentCustomer } from "../fragments";
import { useLocation } from "react-router-dom";
import { useToast } from "../../toast";

const QueryCart = gql`
  query Cart {
    cart {
      ...cartNode
    }
    customer {
      ...CustomerFragment
    }
  }
  ${FragmentCart}
  ${FragmentCustomer}
`;

const QueryCartRefresh = gql`
  query CartRefresh {
    cart(recalculateTotals: true) {
      ...cartNode
    }
  }
  ${FragmentCart}
`;

const QueryCartWithOrder = gql`
  query CartAndOrder($orderId: ID) {
    cart {
      ...cartNode
    }
    order(id: $orderId, idType: DATABASE_ID) {
      ...OrderFragment
    }
  }
  ${FragmentCart}
  ${FragmentOrder}
`;

const MutationAddToCart = gql`
  mutation AddToCart(
    $productId: Int!
    $quantity: Int!
    $clientMutationId: String!
  ) {
    addToCart(
      input: {
        clientMutationId: $clientMutationId
        productId: $productId
        quantity: $quantity
      }
    ) {
      cart {
        ...cartNode
      }
    }
  }
  ${FragmentCart}
`;

const MutationRemoveFromCart = gql`
  mutation RemoveFromCart($keys: [ID], $clientMutationId: String!) {
    removeItemsFromCart(
      input: { clientMutationId: $clientMutationId, keys: $keys }
    ) {
      cart {
        ...cartNode
      }
    }
  }
  ${FragmentCart}
`;

const MutationEmptyCart = gql`
  mutation EmptyCart($clientMutationId: String!) {
    emptyCart(input: { clientMutationId: $clientMutationId }) {
      cart {
        ...cartNode
      }
    }
  }
  ${FragmentCart}
`;

const CartContext = createContext();
const useCartContext = () => useContext(CartContext);

const useCartInitialQuery = (cart, setCart, order, setOrder, setCustomer) => {
  const props = { fetchPolicy: "network-only", skip: cart !== undefined };
  const { pathname } = useLocation();
  let query = QueryCart;

  if (/\/checkout\/order-received\/\d\d/.test(pathname)) {
    const parts = pathname.split("/");
    const orderId = parts[parts.length - 1];

    props.skip = order !== undefined && cart !== undefined;
    props.variables = { orderId };
    query = QueryCartWithOrder;
  }

  const { data, loading, error } = useQuery(query, props);

  useEffect(() => {
    if (data) {
      setCart(data.cart);

      if (data.order) {
        setOrder(data.order);
      }

      if (data.customer) {
        setCustomer(data.customer);
      }
    }
  }, [data, setOrder, setCart, setCustomer]);

  return { loading, error };
};

export const CartProvider = ({ children, logged }) => {
  const [customer, setCustomer] = useState();
  const [cart, setCart] = useState();
  const [order, setOrder] = useState();

  window.SETCART = setCart;

  useEffect(() => {
    let timeout;
    if (logged === true || logged === false) {
      timeout = setTimeout(() => setCart(undefined), 500);
    }

    return () => clearTimeout(timeout);
  }, [logged]);

  const { loading } = useCartInitialQuery(
    cart,
    setCart,
    order,
    setOrder,
    setCustomer,
    customer
  );

  return (
    <CartContext.Provider
      value={{ cart, setCart, order, setOrder, loading, customer, setCustomer }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (props = {}) => {
  const { onAddedToCard = () => {} } = props;
  const {
    cart,
    setCart,
    order,
    setOrder,
    customer,
    setCustomer,
    loading: loadingCart,
  } = useCartContext();

  const { setToast } = useToast();

  const [refreshCart, { loading: refreshing }] = useLazyQuery(
    QueryCartRefresh,
    {
      errorPolicy: "all",
      fetchPolicy: "network-only",
      onCompleted: function (data) {
        setCart(data.cart);
      },
    }
  );

  const [mutateAdd, { loading: adding, error }] = useMutation(
    MutationAddToCart,
    {
      onCompleted: function (...args) {
        const [data] = args || [];
        const cart = data ? data.addToCart?.cart || {} : {};

        setCart(cart);

        onAddedToCard(...args);
      },
    }
  );

  const [mutateRemove, { loading: removing }] = useMutation(
    MutationRemoveFromCart,
    {
      errorPolicy: "all",
      onCompleted: function ({ removeItemsFromCart }) {
        const { cart = {} } = removeItemsFromCart || {};

        setCart(cart);
      },
    }
  );

  const [mutateEmpty, { loading: emptying }] = useMutation(MutationEmptyCart, {
    errorPolicy: "all",
    onCompleted: function ({ emptyCart }) {
      const { cart = {} } = emptyCart || {};

      setCart(cart);
    },
  });

  const addToCart = (input) => {
    const clientMutationId =
      Math.random().toString(36).substring(2) +
      new Date().getTime().toString(36);

    mutateAdd({ variables: { clientMutationId, ...input } }).catch((error) => {
      if (error.graphQLErrors) {
        const messages = [];
        error.graphQLErrors.forEach((i) => messages.push(i.message));

        setToast(messages.join("<br/>"));
      }
    });
  };

  const removeFromCart = (key) => {
    const clientMutationId =
      Math.random().toString(36).substring(2) +
      new Date().getTime().toString(36);

    mutateRemove({ variables: { clientMutationId, keys: [key] } });
  };

  const emptyCart = () => {
    const clientMutationId =
      Math.random().toString(36).substring(2) +
      new Date().getTime().toString(36);

    mutateEmpty({ variables: { clientMutationId } });
  };

  return {
    adding,
    addToCart,
    cart,
    customer,
    emptyCart,
    emptying,
    error,
    loading: adding,
    loadingCart,
    order,
    refreshCart,
    refreshing,
    removeFromCart,
    removing,
    setCart,
    setCustomer,
    setOrder,
  };
};
