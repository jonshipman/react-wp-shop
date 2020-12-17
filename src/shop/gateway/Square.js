import React, { useContext, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  SquarePaymentForm,
  ApplePayButton,
  CreditCardCVVInput,
  CreditCardExpirationDateInput,
  CreditCardNumberInput,
  CreditCardPostalCodeInput,
  Context,
  GooglePayButton,
  MasterpassButton,
} from "react-square-payment-form";
import "react-square-payment-form/lib/default.css";
import { useCart } from "../cart";
import { Button } from "react-wp-gql";

const SettingsQuery = gql`
  query SquareSettings {
    square {
      enabled
      enableSandbox
      production
      productionApplicationId
      productionLocationId
      sandbox
      sandboxApplicationId
      sandboxLocationId
    }
  }
`;

const CustomSquareButton = ({ loading, setLoading, children }) => {
  const context = useContext(Context);

  return (
    <div className="tc f3">
      <Button
        {...{ loading }}
        onClick={(evt) => {
          evt.preventDefault();
          setLoading(true);
          context.onCreateNonce();
        }}
      >
        {children}
      </Button>
    </div>
  );
};

export const SquarePayment = ({ checkout, onPaymentSuccess }) => {
  const { cart } = useCart();
  const { total } = cart || {};
  const [loading, setLoading] = useState();

  const [errorMessages, setErrorMessages] = useState([]);
  const { data } = useQuery(SettingsQuery, { errorPolicy: "all" });

  const sandbox = data ? data.square.enableSandbox || false : false;
  const APPLICATION_ID = sandbox
    ? data?.square?.sandboxApplicationId
    : data?.square?.productionApplicationId;
  const LOCATION_ID = sandbox
    ? data?.square?.sandboxLocationId
    : data?.square?.productionLocationId;

  function cardNonceResponseReceived(errors, nonce, buyerVerificationToken) {
    if (errors) {
      setLoading(false);
      setErrorMessages(errors.map((error) => error.message));
      return;
    }

    setErrorMessages([]);

    if (onPaymentSuccess) {
      const metaData = [
        { key: "wc-square-credit-card-payment-nonce", value: nonce },
        {
          key: "wc-square-credit-card-buyer-verification-token",
          value: JSON.stringify(buyerVerificationToken),
        },
      ];

      const transactionId = nonce;

      onPaymentSuccess({ metaData, transactionId });
    }
  }

  function createPaymentRequest() {
    const lineItems = (cart?.contents?.nodes || []).map((node) => {
      return {
        label: node.product.node.name,
        amount: node.quantity,
        pending: false,
      };
    });

    return {
      requestShippingAddress: true,
      requestBillingInfo: true,
      currencyCode: "USD",
      countryCode: "US",
      total: {
        label: "MERCHANT NAME",
        amount: cart.contents.itemCount,
        pending: false,
      },
      lineItems,
    };
  }

  function createVerificationDetails() {
    return {
      amount: cart.total,
      currencyCode: "USD",
      intent: "CHARGE",
      billingContact: {
        familyName: checkout.billing.lastName,
        givenName: checkout.billing.firstName,
        email: checkout.billing.email,
        country: "US",
        city: checkout.billing.city,
        addressLines: [
          checkout.billing.address1,
          checkout.billing.address2 || "",
        ],
        postalCode: checkout.billing.postcode,
        phone: checkout.billing.phone,
      },
    };
  }

  function postalCode() {
    return checkout?.billing?.postcode;
  }

  const loadingView = <div className="sq-wallet-loading"></div>;
  const unavailableApple = (
    <div className="sq-wallet-unavailable">
      Apple pay unavailable. Open safari on desktop or mobile to use.
    </div>
  );
  const unavailableGoogle = (
    <div className="sq-wallet-unavailable">Google pay unavailable.</div>
  );
  const unavailableMasterpass = (
    <div className="sq-wallet-unavailable">Masterpass unavailable.</div>
  );

  if (!APPLICATION_ID || !LOCATION_ID) {
    return null;
  }

  return (
    <SquarePaymentForm
      applicationId={APPLICATION_ID}
      locationId={LOCATION_ID}
      {...{
        cardNonceResponseReceived,
        createPaymentRequest,
        createVerificationDetails,
        postalCode,
        sandbox,
      }}
    >
      <ApplePayButton
        loadingView={loadingView}
        unavailableView={unavailableApple}
      />
      <GooglePayButton
        loadingView={loadingView}
        unavailableView={unavailableGoogle}
      />
      <MasterpassButton
        loadingView={loadingView}
        unavailableView={unavailableMasterpass}
      />

      <div className="sq-divider">
        <span className="sq-divider-label">Or</span>
        <hr className="sq-divider-hr" />
      </div>

      <fieldset className="sq-fieldset">
        <CreditCardNumberInput />

        <div className="sq-form-third">
          <CreditCardExpirationDateInput />
        </div>

        <div className="sq-form-third">
          <CreditCardPostalCodeInput />
        </div>

        <div className="sq-form-third">
          <CreditCardCVVInput />
        </div>
      </fieldset>

      <CustomSquareButton {...{ loading, setLoading }}>
        Pay {total}
      </CustomSquareButton>

      <div className="sq-error-message">
        {errorMessages.map((errorMessage) => (
          <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
        ))}
      </div>
    </SquarePaymentForm>
  );
};
