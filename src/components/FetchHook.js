export const useFetch = (url) => {
  const _get = async (endpoint) => {
    let url1 = url;
    Object.keys(endpoint).map(
      (item, i) => (url1 += `${i !== 0 ? "&" : ""}${item}=${endpoint[item]}`)
    );
    const fetchData = await fetch(url1);
    const jsonData = fetchData.json();
    return jsonData;
  };

  async function _post(payload = []) {
    const fetchData = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        appTag: "amazon_sales_channel",
        Authorization: `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjI5MGRiYjIzOGUyOWExYjIzMzYwY2E5Iiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNjk2NTY4MDE3LCJpc3MiOiJodHRwczpcL1wvYXBwcy5jZWRjb21tZXJjZS5jb20iLCJ0b2tlbl9pZCI6IjYzM2U1ZjUxYWRkZGFlMjIyNjczN2E5MiJ9.m5LW1XQ_w6E8Y_ZAWV-SqoqLUpgyeQXe3R7aGKhCfkxA0h0i2oESFxS3NXvsqU2zBWO9iPa5vobjXypZCEo7ZbjieaowfryVym-Yc2Kc-SkfHJfr7a2QrXxfKql0nBX0SvgEfVdWKxmVb3AK7MyT60gVUCCh82H7ExXntXA46oTvIQkK2rMTC1pCAFxFcWPTUEvz2yfuyLf62533dDfbdWwnYBxOYXrTUBN9E6aOsbl8MDfglV7bRIiKCXF1hTRjyOzUzqp_Tns4kg3oT2zXKpv7mLFcPpEPnYveRP4TGi_N5gRjfyA4o7xAxTHIxmhlRrY7ZEFUx-BcW6aZz7tYNw`,
        "Ced-Source-Id": 500,
        "Ced-Source-Name": "shopify",
        "Ced-Target-Id": 530,
        "Ced-Target-Name": "amazon",
      },
      body: JSON.stringify(payload),
    });
    const jsonData = await fetchData.json();
    // console.log(fetchData)
    console.log(jsonData)
    if (!jsonData.success) {
      let success = jsonData.success
      let message = jsonData.message || "Invalid Token"
      return {success,message};
    }
    return jsonData;
  }
  const _put = async (endpoint, payload) => {};
  const _delete = async (endpoint) => {};
  return [_post];
};
