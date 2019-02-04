import React from 'react';
import {
  Input,
  Select,
  FormItem,
  Label,
  Prefix,
  Error,
  SansText
} from 'primitive-collections';

export const renderInput = ({
  input,
  label,
  placeholder,
  prefix,
  type,
  id,
  disabled,
  meta: { touched, error, warning, dirty, active },
  prefixClassName,
  className
}) => (
  <FormItem className={className}>
    <Label htmlFor={id}>
      <SansText>{label}</SansText>
    </Label>
    <div style={{ position: 'relative' }}>
      {prefix && (
        <Prefix className={prefixClassName}>
          <SansText>{prefix}</SansText>
        </Prefix>
      )}
      <Input
        {...input}
        type={type}
        id={id}
        placeholder={placeholder || label}
        {...(type === 'number' ? { step: 0.01 } : {})}
        disabled={disabled}
      />
    </div>
    {error && touched && !active && <Error>{error}</Error>}
  </FormItem>
);

export const renderSelect = ({
  input,
  label,
  options,
  id,
  meta: { touched, error, warning, dirty, active }
}) => {
  return (
    <FormItem>
      <Label htmlFor={id}>
        <SansText>{label}</SansText>
      </Label>
      <Select>
        <select {...input} id={id}>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.text}
            </option>
          ))}
        </select>
      </Select>

      {error && touched && !active && <Error>{error}</Error>}
    </FormItem>
  );
};

export class RenderSimplifySelect extends React.Component {
  render() {
    const { input, options, id, selectedAccountCode } = this.props;

    return (
      <div className="main-wallet-container">
        <select
          id={id}
          className="main-wallet-select"
          {...input}
          value={selectedAccountCode}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.text}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
