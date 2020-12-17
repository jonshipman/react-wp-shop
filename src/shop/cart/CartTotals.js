import React from "react";
import { Link } from "react-router-dom";
import { Row, Rule } from "../../components";
import { useCart } from "./useCart";

const Display = ({ showTax, price, tax, label, last, bold }) => {
  let amountClassName = "tr";
  if (bold) {
    amountClassName += " fw7";
  }

  return (
    <React.Fragment>
      <tr>
        <th>{label}:</th>
        <td className={amountClassName}>{price}</td>
      </tr>
      {showTax && (
        <tr>
          <th>Tax:</th>
          <td className={amountClassName}>{tax}</td>
        </tr>
      )}
      {!last && (
        <tr>
          <td colSpan={2}>
            <Rule className="ml-auto mv2" />
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

const MoreTotals = ({ cart }) => {
  const {
    total,
    totalTax,
    subtotal,
    subtotalTax,
    shippingTotal,
    shippingTax,
    displayPricesIncludeTax,
  } = cart || {};
  const showTax = !displayPricesIncludeTax;
  return (
    <Row>
      <table className="ml-auto">
        <tbody>
          <Display
            label="Subtotal"
            price={subtotal}
            tax={subtotalTax}
            {...{ showTax }}
          />
          <Display
            label="Shipping"
            price={shippingTotal}
            tax={shippingTax}
            {...{ showTax }}
          />
          <Display
            label="Total"
            price={total}
            tax={totalTax}
            last
            bold
            {...{ showTax }}
          />
        </tbody>
      </table>
    </Row>
  );
};

export const CartTotals = ({ mini }) => {
  const { cart } = useCart();
  const { total } = cart || {};

  if (!cart || cart.isEmpty) return null;

  if (!mini) {
    return <MoreTotals {...{ cart }} />;
  }

  return (
    <Row>
      <div className="flex items-center f7">
        <div className="">
          <Link to="/cart" className="primary no-underline">
            View Cart
          </Link>
        </div>
        <div className="ml-auto tr">{total}</div>
      </div>
    </Row>
  );
};
