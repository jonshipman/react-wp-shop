import { CreatePaginationQuery } from "react-wp-gql";

const LiteralSeo = `
  title
  metaDesc
  breadcrumbs {
    url
    text
  }
`;

export const LiteralProductFields = `
  databaseId
  id
  name
  onSale
  sku
  seo {
    ${LiteralSeo}
  }
`;

export const ProductLiteralTypes = `
  price
  purchasable
  content
  uri
  galleryImages(first: 4) {
    nodes {
      id
      large: sourceUrl(size: LARGE)
      medium: sourceUrl(size: MEDIUM)
    }
  }
  productCategories {
    nodes {
      id
      databaseId
      uri
      name
    }
  }
  featuredImage {
    node {
      id
      sourceUrl(size: LARGE)
    }
  }
`;

export const ProductLiteral = `
  ${LiteralProductFields}
  ... on SimpleProduct {
    ${ProductLiteralTypes}
    stockQuantity
    regularPrice
    salePrice
  }
  ... on VariableProduct {
    ${ProductLiteralTypes}
    regularPrice
    salePrice
  }
  ... on ExternalProduct {
    ${ProductLiteralTypes}
    regularPrice
    salePrice
  }
  ... on GroupProduct {
    ${ProductLiteralTypes}
  }
`;

export const LiteralProductInline = `
  ${LiteralProductFields}
  related(first: 4, where: {stockStatus: IN_STOCK}) {
    nodes {
      ${ProductLiteral}
    }
  }
`;

export const LiteralProductCategory = `
  id
  databaseId
  uri
  name
  seo {
    ${LiteralSeo}
  }
  ${CreatePaginationQuery(
    "products",
    ProductLiteral,
    `status: "publish", stockStatus: IN_STOCK`
  )}
`;

export const FragmentCustomer = `
  fragment CustomerFragment on Customer {
    id
    shipping {
      state
      postcode
      phone
      lastName
      firstName
      email
      country
      company
      city
      address2
      address1
    }
    billing {
      state
      postcode
      phone
      lastName
      firstName
      email
      country
      company
      city
      address2
      address1
    }
  }
`;

export const FragmentOrder = `
  fragment OrderFragment on Order {
    id
    orderNumber
    orderVersion
    cartHash
    transactionId
    status
    orderKey
    billing {
      address1
      address2
      city
      company
      country
      email
      firstName
      lastName
      phone
      postcode
      state
    }
    shipping {
      state
      postcode
      phone
      lastName
      firstName
      email
      country
      company
      city
      address2
      address1
    }
    shippingAddressMapUrl
    total
    totalTax
    paymentMethod
    lineItems {
      nodes {
        product {
          ${ProductLiteral}
        }
        quantity
        total
      }
    }
  }
`;

export const FragmentCart = `
  fragment cartNode on Cart {
    totalTax
    total
    subtotalTax
    subtotal
    shippingTotal
    shippingTax
    needsShippingAddress
    isEmpty
    feeTotal
    feeTax
    displayPricesIncludeTax
    discountTotal
    discountTax
    contentsTotal
    contentsTax
    chosenShippingMethod
    availableShippingMethods {
      supportsShippingCalculator
      packageDetails
      rates {
        cost
        id
        instanceId
        label
        methodId
      }
    }
    contents {
      itemCount
      nodes {
        quantity
        total
        key
        product {
          node {
            ${ProductLiteral}
          }
        }
      }
    }
  }
`;
