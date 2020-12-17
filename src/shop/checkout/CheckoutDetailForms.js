import { gql, useQuery } from "@apollo/client";
import React, { useCallback } from "react";
import { LeadFormGroup, Valid } from "react-wp-form";

const LocationOptions = gql`
  query LocationOptions {
    countries {
      value: abbr
      label: name
    }
  }
`;

/**
 * Creates the details form - for both the billing and the shipping.
 *
 * @param {string} label The label above the form.
 * @param {object} errors Error ref to populate form errors.
 * @param {object} fields Field ref to add field ids.
 * @param {object} form Form state.
 * @param {function} setForm Update form state.
 * @param {string} prefix Id prefix.
 * @return {jsx}
 */
export const DetailsForm = ({
  label,
  errors,
  fields,
  form,
  setForm,
  prefix,
}) => {
  const { data } = useQuery(LocationOptions, { errorPolicy: "all" });
  const countries = data ? data.countries || [] : [];

  /**
   * Populate all the fields automatically from the children inside the form.
   */
  const onInit = useCallback(
    ({ id }) => {
      fields.current.push(id);
    },
    [fields]
  );

  /**
   * Update the form and propagation ref on field change.
   */
  const onChange = useCallback(
    (value, field) => {
      setForm((existing) => {
        const _n = { ...existing, [field]: value };
        return _n;
      });
    },
    [setForm]
  );

  /**
   * Callback performed during a field check.
   * Adds the valid condition to the errors ref.
   */
  const onCheck = useCallback(
    ({ id, valid }) => {
      errors.current = { ...errors.current, [id]: !valid };
    },
    [errors]
  );

  /**
   * Props for all FormGroups.
   */
  const GroupProps = { form, onChange, onCheck, onInit };

  return (
    <div>
      <div className="fw7 mb2">{label}</div>

      <div className="nl3 nr3">
        <LeadFormGroup
          label="First Name"
          id={`${prefix}firstName`}
          valid={Valid.NotEmptyString}
          error="You must include a first name."
          className="fl-l w-50-l ph3"
          {...GroupProps}
        />
        <LeadFormGroup
          label="Last Name"
          id={`${prefix}lastName`}
          valid={Valid.NotEmptyString}
          error="You must include a last name."
          className="fl-l w-50-l ph3"
          {...GroupProps}
        />
      </div>
      <LeadFormGroup
        label="Company"
        id={`${prefix}company`}
        className="cb"
        help={<div className="f7">(Optional)</div>}
        {...GroupProps}
      />
      <LeadFormGroup
        label="Country"
        id={`${prefix}country`}
        placeholder="Select One"
        type="select"
        options={countries}
        valid={Valid.NotEmptyString}
        error="You must include a country."
        {...GroupProps}
      />

      <LeadFormGroup
        label="Address"
        id={`${prefix}address1`}
        valid={Valid.NotEmptyString}
        error="You must include an address."
        {...GroupProps}
      />

      <LeadFormGroup
        placeholder="Appartment, suite, etc."
        id={`${prefix}address2`}
        help={<div className="f7">(Optional)</div>}
        {...GroupProps}
      />
      <div className="nl3 nr3">
        <LeadFormGroup
          label="City"
          id={`${prefix}city`}
          valid={Valid.NotEmptyString}
          error="You must include a city."
          className="fl-l w-third-l ph3"
          {...GroupProps}
        />
        <LeadFormGroup
          label="State"
          id={`${prefix}state`}
          valid={Valid.NotEmptyString}
          error="You must include a city."
          className="fl-l w-third-l ph3"
          {...GroupProps}
        />
        <LeadFormGroup
          label="Zip"
          id={`${prefix}postcode`}
          valid={Valid.NotEmptyString}
          error="You must include a zip code."
          className="fl-l w-third-l ph3"
          {...GroupProps}
        />
      </div>
      <div className="nl3 nr3">
        <LeadFormGroup
          label="Phone"
          type="tel"
          id={`${prefix}phone`}
          valid={Valid.Phone}
          error="You must include a phone."
          className="fl-l w-50-l ph3"
          {...GroupProps}
        />
        <LeadFormGroup
          label="Email"
          type="email"
          id={`${prefix}email`}
          valid={Valid.Email}
          error="You must include an email."
          className="fl-l w-50-l ph3"
          {...GroupProps}
        />
      </div>
    </div>
  );
};
