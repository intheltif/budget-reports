import { sanitizeBudget, mergeBudgets } from "./repoUtils";

describe("sanitizeBudget", () => {
  const budget = {
    payees: [{ id: "foo" }],
    categories: [{ id: "cat", activity: 1000, balance: 2000, budgeted: 3000 }],
    transactions: [{ amount: 1000 }],
    months: [
      { month: "2018-05-01", categories: [{ id: "cat", balance: 5000 }] }
    ]
  };

  it("sanitizes data", () => {
    const result = sanitizeBudget(budget, "2018-05");

    expect(result.payees).toEqual({ foo: { id: "foo" } });
    expect(result.categories).toEqual([
      { id: "cat", activity: 1, balance: 5, budgeted: 3 }
    ]);
    expect(result.transactions).toEqual([{ amount: 1 }]);
  });
});

describe("mergeBudgets", () => {
  const budget = {
    accounts: [{ id: "a1", name: "paypal" }],
    categories: [{ id: "c1", name: "caat1" }, { id: "c2", name: "cat2" }],
    category_groups: [{ id: "foo", name: "bar" }],
    currency_format: { foo: "bar" },
    date_format: "blah",
    months: [
      {
        month: "2018-06-01",
        to_be_budgeted: 10000,
        age_of_money: 30,
        categories: [{ id: "c1", balance: 10000 }, { id: "c2", balance: 20000 }]
      },
      {
        month: "2018-05-01",
        to_be_budgeted: 10000,
        age_of_money: 30,
        categories: [{ id: "c1", balance: 10000 }, { id: "c2", balance: 20000 }]
      }
    ],
    payee_locations: [],
    payees: [],
    scheduled_subtransactions: [],
    scheduled_transactions: [],
    subtransactions: [],
    transactions: []
  };
  const deltas = {
    accounts: [{ id: "a1", name: "paypal 2" }, { id: "a2", name: "foo" }],
    categories: [{ id: "c1", name: "cat1" }, { id: "c3", name: "cat3" }],
    category_groups: [{ id: "foo", name: "foo" }],
    currency_format: { foo: "baz" },
    date_format: "blah2",
    months: [
      {
        month: "2018-06-01",
        to_be_budgeted: 15000,
        age_of_money: 30,
        categories: [{ id: "c1", balance: 30000 }]
      }
    ],
    payee_locations: [],
    payees: [],
    scheduled_subtransactions: [],
    scheduled_transactions: [],
    subtransactions: [],
    transactions: []
  };

  it("updates data", () => {
    const result = mergeBudgets(budget, deltas);

    expect(result.accounts).toEqual([
      { id: "a1", name: "paypal 2" },
      { id: "a2", name: "foo" }
    ]);
    expect(result.categories).toEqual([
      { id: "c1", name: "cat1" },
      { id: "c2", name: "cat2" },
      { id: "c3", name: "cat3" }
    ]);
    expect(result.category_groups).toEqual([{ id: "foo", name: "foo" }]);
    expect(result.currency_format).toEqual({ foo: "baz" });
    expect(result.date_format).toEqual("blah2");
    expect(result.months).toEqual([
      {
        month: "2018-06-01",
        to_be_budgeted: 15000,
        age_of_money: 30,
        categories: [{ id: "c1", balance: 30000 }, { id: "c2", balance: 20000 }]
      },
      {
        month: "2018-05-01",
        to_be_budgeted: 10000,
        age_of_money: 30,
        categories: [{ id: "c1", balance: 10000 }, { id: "c2", balance: 20000 }]
      }
    ]);
  });
});
