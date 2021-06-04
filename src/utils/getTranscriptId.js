const getTranscriptId = () => {
  const n = window.location.href.lastIndexOf("/");
  return window.location.href.slice(n + 1);
};

export default getTranscriptId;
