const { randomBytes } = require('crypto');

const generateToken = (rawSize = 10) => {
  const size = Math.max(1, Math.ceil(rawSize / 2));

  const bytes = randomBytes(size);

  return bytes.toString('hex').slice(0, rawSize);
};

exports.generateToken = generateToken;

const defineDefaultValues = (Model, values) => {
  const keyNames = Object.keys(values);

  const hook = async (instance) => {
    for (const key of keyNames) {
      if (instance[key] !== undefined) {
        continue;
      }

      const compute = values[key];

      // eslint-disable-next-line no-await-in-loop
      instance[key] = await compute(instance);
    }
  };

  Model.beforeValidate(hook);
};

exports.defineDefaultValues = defineDefaultValues;
