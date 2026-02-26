import formatStylish from './stylish.js';

const formatters = {
  stylish: formatStylish,
};

export default (name = 'stylish') => formatters[name];
