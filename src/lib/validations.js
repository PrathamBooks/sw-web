import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import isNumeric from 'validator/lib/isNumeric';
import trim from 'validator/lib/trim';
import isLength from 'validator/lib/isLength';

export const isEmailValid = (email, t ) => { 
  let error_message = []
  if (!isEmail(email))
    error_message.push(t("Validation.email"))
  return error_message  
};

export const isLengthValid =(value, min, max, t) => {
  let error_message = []

  if(min && max) {
    if(!isLength(trim(value), { min: min, max: max}))
      error_message.push(`${t("Validation.length-between", {min: min, max: max })}`)
  }
  else if(min) {
    if(!isLength(trim(value), { min: min, max: null}))
      error_message.push(t("Validation.length-greater-than", min))
  }
  else {
    if(!isLength(trim(value), { min: null, max: max}))
      error_message.push(t("Validation.length-less-than", max))
  }

  return error_message
};

export const isPresent = (value, t) => { 
  let error_message = []
  if(isEmpty(trim(value)))
  error_message.push(t("Validation.required"))
  return error_message
};

export const isEqual = (field_name, value, field_name1, value1, t) => { 
  let error_message = []
  if(value !== value1)
  error_message.push(`${t("Validation.is-equal", {field_name: field_name, field_name1: field_name1 })}`)
  return error_message
};

export const isNumber = (value, t) => { 
  let error_message = []
  if(!isNumeric(trim(value)))
  error_message.push(t("Validation.is-numeric"))
  return error_message
};

export const isGreaterThan = (value, min, t) => { 
  let error_message = []
  if(parseInt(value, 10) <= min )
    error_message.push(t("Validation.is-greater-than", min))
  return error_message
};

export const createErrorMessage = (errors) => {
  let error_message = ''
  if (Array.isArray(errors))
    error_message = (errors.length > 0 ? errors.join(", ") : null)
  else
  {
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if (Array.isArray(errors[key]))
          error_message = `${error_message} ${key} ${errors[key].join(", ")} `
        else 
          error_message = `${error_message} ${key} ${errors[key]}`
      }
    }
  }
  return error_message
};