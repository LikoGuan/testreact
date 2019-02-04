import React from 'react';
import classNames from 'classnames';

export const renderInput = ({
  input,
  label,
  placeholder,
  type,
  id,
  readOnly = false,
  meta,
  step,
  className = '',
  hideLabel = false,
  children,
  autoComplete = 'on'
}) => {
  const { touched, error } = meta;

  return (
    <div
      className={classNames(`form-group ${className}`, {
        'has-warning': error && touched
      })}
    >
      {!hideLabel && (
        <label className="control-label" htmlFor={id || input.name}>
          {label}
        </label>
      )}

      <input
        {...input}
        step={step}
        type={type}
        className="form-control"
        id={id || input.name}
        placeholder={placeholder || label}
        readOnly={readOnly}
        autoComplete={autoComplete}
      />

      {children}

      {error &&
        touched && <span className="help-block onboard-err">{error}</span>}
    </div>
  );
};

export const renderSelect = ({
  input,
  label,
  options,
  defaultText = '',
  disableDefault = true,
  id,
  className = '',
  meta: { touched, error, active },
  hideLabel = false,
  tipsLabel,
  showTips
}) => (
  <div
    className={classNames(`form-group ${className}`, {
      'has-warning': error && touched && !active
    })}
  >
    {!hideLabel && (
      <label className="control-label" htmlFor={id || input.name}>
        {label}
      </label>
    )}

    {tipsLabel && (
      <div className="control-label-description" onClick={showTips}>
        {tipsLabel}
      </div>
    )}

    <div className="lat-select">
      <select {...input} className="form-control" id={id || input.name}>
        <option key="default" value="" disabled={disableDefault}>
          {defaultText}
        </option>

        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.text}
          </option>
        ))}
      </select>
    </div>
    {error &&
      touched &&
      !active && <span className="help-block onboard-err">{error}</span>}
  </div>
);
export const renderCheckbox = ({
  input,
  label,
  className = '',
  id,
  meta: { touched, error, active }
}) => (
  <div
    className={classNames(`form-group ${className}`, {
      'has-warning': error && touched && !active
    })}
  >
    <label className="" htmlFor={id || input.name}>
      <input
        {...input}
        checked={input.value}
        id={id || input.name}
        type="checkbox"
      />
      <span>&nbsp;{label}</span>
    </label>

    {error &&
      touched &&
      !active && <span className="help-block onboard-err">{error}</span>}
  </div>
);

export const renderRadio = ({
  input,
  label,
  radioValue,
  id,
  className = '',
  meta: { touched, error, active },
  showError = true
}) => {
  const checked = input.value === radioValue;
  delete input.value;

  return (
    <div
      className={classNames(`form-group ${className}`, {
        'has-warning': error && touched && !active
      })}
    >
      <label className="" htmlFor={id}>
        <input
          {...input}
          checked={checked}
          value={radioValue}
          id={id}
          type="radio"
        />
        <span>&nbsp;{label}</span>
      </label>

      {showError &&
        error &&
        touched &&
        !active && <span className="help-block onboard-err">{error}</span>}
    </div>
  );
};
