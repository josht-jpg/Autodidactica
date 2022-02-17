const validLocations = [
  "https://www.autodidactica.io",
  "http://localhost:3000", //Development
];

const validateHeadersAgainstCSRF = (headers) => {
  //const origin = headers.origin;
  const referer = headers.referer;
  console.log(typeof referer);

  if (/*!origin &&*/ !referer) {
    return false;
  }

  if (
    /*!validLocations.includes(origin) ||  !validLocations.includes(referer) */
    !referer.startsWith("https://autodidacticaapp.herokuapp.com")
  ) {
    return false;
  }
  return true;
};

export default validateHeadersAgainstCSRF;
