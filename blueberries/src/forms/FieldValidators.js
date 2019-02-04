/**
 * Created by gavinmilbank on 14/07/17.
 */
import numeral from 'numeral'
import _ from 'lodash'

export const required = value => _.isUndefined(value) ? 'Required' : undefined ;
export const email = value =>  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined ;
export const noProfanity = value =>  value && /(fuck|shit)/i.test(value) ? 'Please do not commit profanities to the database' : undefined ;
export const number = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined ;
export const numeralFormat = format => value => {
  let roundTrippedNumber = numeral(numeral(value).format(format)).value();
  return isNaN(roundTrippedNumber) ? 'Must be a  number of format '+format : undefined ;
}
export const minLength = min => value => value && value.length < min ? `Must be ${min} characters or more` : undefined ;
export const maxLength = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined ;
export const minValue = min => value =>  value && value < min ? `Must be at least ${min}` : undefined ;
export const maxValue = max => value =>  value && value > max ? `Must be less than ${max}` : undefined ;
export const minPercent = min => value =>  value && value < min ? `Must be at least ${min} %` : undefined ;
export const maxPercent = max => value =>  {
  let maxPct = max*100 ;
  return value && value > max ? `Must be less than ${maxPct} %` : undefined ;
}


