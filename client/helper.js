const handleError = (message) => {
  document.getElementById("errorMessage").textContent = message;
  document.getElementById("assetMessage").classList.remove("hidden");
};

// Send a post request (router) and our handler parses the results after we post
const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  document.getElementById("assetMessage").classList.add("hidden");

  if (result.error) {
    handleError(result.error);
  }

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (handler) {
    handler(result);
  }
};

const hideError = () => {
  document.getElementById("assetMessage").classList.add("hidden");
};

module.exports = {
  handleError,
  sendPost,
  hideError,
};
