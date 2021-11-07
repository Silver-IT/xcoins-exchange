export const getRateByCurrency = (rates, cur1, cur2) => {
    if (!rates[cur1]) return 0;
    return (rates[cur2] || 0) / rates[cur1];
};
