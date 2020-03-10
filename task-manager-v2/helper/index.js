const stringToBase64 = data => {
  Buffer.from(data).toString('base64');
};

const base64ToString = data => {
  Buffer.from(data, 'base64').toString('ascii');
};

export default {
  stringToBase64,
  base64ToString,
};
