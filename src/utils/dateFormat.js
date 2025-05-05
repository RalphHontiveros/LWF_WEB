const DateFormat = (date) => {
  return new Date(date).toLocaleString('en-PH', {
    hour12: true,     
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default DateFormat;