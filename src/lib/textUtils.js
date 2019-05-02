import React from 'react';

export const arrayToI18nList = (arr, conjunction = 'and') => {
  let list;
  if (!Array.isArray(arr) || (arr.length < 2)) {
    list = arr;
  } else if (arr.length === 2) {
    list = (<span>{arr[0]} {conjunction} {arr[1]}</span>);
  } else {
    // list = `${arr.slice(0, -1)}, ${conjunction} ${arr.slice(-1)}`;
    list = (
      <span>{
        arr.slice(0, -1).map((el, i) => {
          return <span>{el}, </span>
        })
      } {conjunction} {arr.slice(-1)}</span>
    );
  }

  return list;
};

export const isoDateFormat = (datePublised) => {
  let date = datePublised.split("-"); 
  return (date[2] + "-" + date[1] + "-" + date[0]);
}

