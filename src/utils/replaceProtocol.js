const replaceProtocol = (url) => {
  if (url.includes("https")) {
    return url;
  } else {
    return "https" + url.split("http")[1];
  }
};

export default replaceProtocol;
