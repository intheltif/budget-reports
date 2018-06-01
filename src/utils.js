import camelCase from "lodash/camelCase";
import mapValues from "lodash/mapValues";
import mapKeys from "lodash/mapKeys";
import isObject from "lodash/isObject";
import isArray from "lodash/isArray";
import { utils } from "ynab";

export const simpleMemoize = func => {
  let lastArgs = null;
  let lastResult = null;
  return (...args) => {
    if (
      lastArgs !== null &&
      lastArgs.length === args.length &&
      args.every((value, index) => value === lastArgs[index])
    ) {
      return lastResult;
    }
    lastArgs = args;
    lastResult = func(...args);
    return lastResult;
  };
};

export const mapKeysDeep = (obj, cb) => {
  if (isArray(obj)) {
    return obj.map(innerObj => mapKeysDeep(innerObj, cb));
  } else if (isObject(obj)) {
    return mapValues(mapKeys(obj, cb), val => mapKeysDeep(val, cb));
  } else {
    return obj;
  }
};

export const camelCaseKeys = obj =>
  mapKeysDeep(obj, (val, key) => camelCase(key));

export const formatCurrency = utils.convertMilliUnitsToCurrencyAmount;

export const getStorage = key => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

export const setStorage = (key, obj) => {
  localStorage.setItem(key, JSON.stringify(obj));
};

export const upsertBy = (arr, key, obj, updater = (prev, curr) => curr) => {
  let exists = false;
  const newArr = arr.map(item => {
    if (item[key] === obj[key]) {
      exists = true;
      return updater(item, obj);
    }
    return item;
  });
  return exists ? newArr : newArr.concat(obj);
};

export const getBudgetLink = ({ budgetId }) => `/budgets/${budgetId}`;

export const getGroupLink = ({ budgetId, categoryGroupId }) =>
  `/budgets/${budgetId}/category-groups/${categoryGroupId}`;

export const getCategoryLink = ({ budgetId, categoryId }) =>
  `/budgets/${budgetId}/categories/${categoryId}`;
