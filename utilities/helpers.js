async function promiseResolver(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    return [null, err];
  }
}

module.exports = { promiseResolver };
