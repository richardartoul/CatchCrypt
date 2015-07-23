/* Substracting the two dates will return an integer that represents the number of milliseconds that elapsed between the two different timestamps. The number of milliseconds can be divided by 1000, 60, and then 60 again to get the difference in hours */
module.exports = function(date1, date2, expirationInHours) {
  return (((date1 - date2)/1000/60/60) > expirationInHours);
};