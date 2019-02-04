// This file is initially from https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/utils/validation.js,
// which is linked from http://erikras.github.io/redux-form/#/examples/synchronous-validation?_k=dd5lso

const isEmpty = value => value === undefined || value === null || value === '';
const join = rules => (value, data, props) =>
  rules
    .map(rule => rule(value, data, props))
    .filter(error => !!error)[0]; /* first error */

//https://github.com/Sembiance/email-validator/blob/master/index.js
// eslint-disable-next-line
const email_regex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
export function email(email) {
  const error = 'Invalid email address';

  if (!email || email.length > 254 || !email_regex.test(email)) return error;

  // Further checking of some things regex can't handle
  var parts = email.split('@');
  if (parts[0].length > 64) return error;

  var domainParts = parts[1].split('.');
  if (
    domainParts.some(function(part) {
      return part.length > 63;
    })
  )
    return error;
}

export function required(value) {
  if (isEmpty(value)) {
    return 'Required';
  }
}

export function phoneNumber(value) {
  const phone_regex = /^\+?(\s|[\d])*(\d|\s)+$/;

  if (!isEmpty(value) && !phone_regex.test(value)) {
    return 'Phone number can starts with +, and contains number and whitespace';
  }
}

export function selectOneAtLeast(value) {
  if (!value || Object.keys(value).filter(k => value[k]).length === 0) {
    return 'Select one option at least';
  }
}

export function minLength(min, tips = 'characters') {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return `Must be at least ${min} ${tips}`;
    }
  };
}
export function greaterThan(min) {
  return value => {
    if (!isEmpty(value) && window.parseFloat(value, 10) <= min) {
      return `Must be greater than ${min} `;
    }
  };
}
export function smallerThan(max) {
  return value => {
    if (!isEmpty(value) && window.parseFloat(value, 10) >= max) {
      return `Must be smaller than ${max} `;
    }
  };
}
export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
  };
}

export function amountNumber(value) {
  const phone_regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/; //start with 0. or 1. or 90.
  if (!isEmpty(value) && !phone_regex.test(value)) {
    return `Must be a positive number with maximum of 2 decimal places`;
  }
}

export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return 'Must be an integer';
  }
}

export function oneOf(enumeration) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      return `Must be one of: ${enumeration.join(', ')}`;
    }
  };
}

export function match(field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return 'Do not match';
      }
    }
  };
}

export function containsLetterAndNumber(value) {
  const letterAndNumber = /^.*(?=.*[a-zA-Z])(?=.*\d).*$/;
  if (!isEmpty(value) && !letterAndNumber.test(value)) {
    return `Must contains at least one letter and number`;
  }
}
export const password = join([
  minLength(8),
  maxLength(20),
  containsLetterAndNumber
]);

export function arrayValidator(rules) {
  return (data = []) => {
    const errors = [];
    const validator = createValidator(rules);
    data.forEach(value => {
      const error = validator(value);
      if (error) {
        errors.push(error);
      }
    });
    return errors;
  };
}

export function createValidator(rules) {
  return (data = {}, props) => {
    const errors = {};
    Object.keys(rules).forEach(key => {
      const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
      const error = rule(data[key], data, props);
      if (error) {
        errors[key] = { _error: error };
      }
    });
    return errors;
  };
}

export function createValidatorWithConditions(items) {
  return (data = {}, props) => {
    const errors = {};

    items
      .filter(item => item.condition(data))
      .forEach(({ condition, rules }) => {
        Object.keys(rules).forEach(key => {
          const obj = rules[key];
          const validators = obj.validators || obj;
          const isFieldArray = obj.isFieldArray || false;

          const rule = join([].concat(validators)); // concat enables both functions and arrays of functions

          const error = rule(data[key], data, props);
          if (error) {
            errors[key] = isFieldArray ? { _error: error } : error;
          }
        });
      });

    return errors;
  };
}

export function onboardValideImage(value) {
  for (let i = 0; i < value.length; i++) {
    const item = value[i];
    if (item.temp) {
      return `Must be upload ${item.temp}`;
    }
  }
}

export function arrayFieldRequired(value) {
  if (isEmpty(value) || !Array.isArray(value)) {
    return {
      _error: 'Need item'
    };
  }
}

export function arrayFieldMinLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return {
        _error: `At least ${min} item${min > 1 ? 's' : ''}`
      };
    }
  };
}

export function everyElement(rules) {
  return value => {
    if (!isEmpty(value) && Array.isArray(value)) {
      return value.map(data => {
        const errors = {};

        Object.keys(rules).forEach(key => {
          const rule = join(rules[key]);

          const error = rule(data[key]);

          errors[key] = error ? { _error: error } : {};
        });

        return errors;
      });
    }
  };
}
