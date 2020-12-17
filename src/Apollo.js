import {
  ApolloLink,
  InMemoryCache,
  ApolloClient,
  HttpLink,
  from,
} from "@apollo/client";
import { gqlUrl } from "./config";
import { relayStylePagination } from "@apollo/client/utilities";

const links = [];
const MiddleWare = new ApolloLink((operation, forward) => {
  const session = localStorage.getItem("woo-session");
  if (session) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        "woocommerce-session": `Session ${session}`,
      },
      ...headers,
    }));
  }

  return forward(operation);
});

const AfterWare = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
    const {
      response: { headers },
    } = context;
    const session = headers.get("woocommerce-session");
    if (session) {
      if (localStorage.getItem("woo-session") !== session) {
        localStorage.setItem("woo-session", headers.get("woocommerce-session"));
      }
    }

    return response;
  });
});

links.push(MiddleWare);
links.push(AfterWare);

const authAfterware = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    // If we get an error, log the error.
    if (response?.errors?.length > 0) {
      console.error(response.errors);
    }

    return response;
  });
});

const customFetch = (uri, options) => {
  const body = JSON.parse(options.body);

  if (body?.variables?.input?.metaData?.length > 0) {
    body.variables.input.metaData.forEach((item) => {
      body[item.key] = item.value;
    });

    const _options = { ...options, body: JSON.stringify(body) };
    return fetch(uri, _options);
  }

  return fetch(uri, options);
};

const link = new HttpLink({
  uri: gqlUrl,
  fetch: customFetch,
});

const cache = {
  typePolicies: {
    Query: {
      fields: {
        productCategories: relayStylePagination(),
      },
    },
  },
};

export const client = new ApolloClient({
  link: from([authAfterware, ...links, link]),
  cache: new InMemoryCache(cache),
});
