// This file is initially from https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/utils/validation.js,
// which is linked from http://erikras.github.io/redux-form/#/examples/synchronous-validation?_k=dd5lso

const isEmpty = value => value === undefined || value === null || value === '';
const join = rules => (value, data, props) =>
  rules.map(rule => rule(value, data, props)).filter(error => !!error)[0 /* first error */];

export function email(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  const email_regex = /^(\w|.)+@\w+\..+?$/i;
  if (!isEmpty(value) && !email_regex.test(value)) {
    return 'Invalid email address';
  }
}

export function required(value) {
  if (isEmpty(value)) {
    return 'Required';
  }
}

export function selectOneAtLeast(value) {
  if (!value || Object.keys(value).filter(k => value[k]).length === 0) {
    return 'Select one option at least';
  }
}

export function minLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return `Must be at least ${min} characters`;
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
export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
  };
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
export const password = join([minLength(8), maxLength(20), containsLetterAndNumber]);

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
        errors[key] = error;
      }
    });
    return errors;
  };
}
