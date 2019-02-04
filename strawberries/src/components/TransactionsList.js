
const dateStringFormat = (number) => number >= 10 ? number : `0${number}`;

export const getDate = date => date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : '';

export const getDateDisplay = date => date ? 
    `${dateStringFormat(date.getMonth() + 1)}-${dateStringFormat(date.getDate())} ${dateStringFormat(date.getHours())}:${dateStringFormat(date.getMinutes())}` : '';;
  

  