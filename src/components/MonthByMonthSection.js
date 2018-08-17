import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getMonthsToNow, getTransactionMonth } from "../budgetUtils";
import { groupBy, sumByProp } from "../dataUtils";
import { lightPrimaryColor, lighterPrimaryColor } from "../styleVariables";
import CollapsibleSection from "./CollapsibleSection";
import ChartNumbers from "./ChartNumbers";
import MonthlyChart from "./MonthlyChart";

const MonthByMonthSection = ({
  transactions,
  firstMonth,
  highlightFunction,
  selectedMonth,
  title,
  onSelectMonth
}) => {
  const months = getMonthsToNow(firstMonth);
  let total = 0;
  let selectedMonthTotal = 0;

  const transactionsByMonth = groupBy(getTransactionMonth)(transactions);
  const data = months.map(month => {
    const grouped = groupBy(highlightFunction || (() => false))(
      transactionsByMonth[month] || []
    );
    const amount = sumByProp("amount")(grouped.false || []);
    const highlighted = sumByProp("amount")(grouped.true || []);
    total += highlightFunction ? highlighted : amount;
    if (month === selectedMonth) {
      selectedMonthTotal = highlightFunction ? highlighted : amount;
    }

    return { month, amount: -amount, highlighted: -highlighted };
  });

  const chartNumbers = selectedMonth
    ? [
        { amount: total / months.length, label: "average" },
        {
          amount: selectedMonthTotal,
          label: moment(selectedMonth).format("MMM YYYY")
        }
      ]
    : [
        { amount: total / months.length, label: "average" },
        {
          amount: total,
          label: "total"
        }
      ];
  const series = [
    {
      color: highlightFunction ? lightPrimaryColor : lighterPrimaryColor,
      valueFunction: d => d.amount
    }
  ];

  if (highlightFunction) {
    series.push({
      color: lighterPrimaryColor,
      valueFunction: d => d.highlighted
    });
  }

  return (
    <CollapsibleSection title={title}>
      <ChartNumbers numbers={chartNumbers} />
      <MonthlyChart
        data={data}
        average={total / months.length}
        series={series}
        selectedMonth={selectedMonth}
        onSelectMonth={onSelectMonth}
      />
    </CollapsibleSection>
  );
};

MonthByMonthSection.propTypes = {
  firstMonth: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  highlightFunction: PropTypes.func,
  selectedMonth: PropTypes.string,
  title: PropTypes.string
};

MonthByMonthSection.defaultProps = { title: "Month by Month" };

export default MonthByMonthSection;
