const helper = require("./helper.js");

//Event called after the upload button is clicked in the asset creator
const handleAsset = async (e) => {
  e.preventDefault();
  helper.hideError();

  //generate a form data obj of all our inputs
  const uploadData = new FormData(e.target);

  // (2.) Grab the data from our form
  //checks if we have all the fields filled before making an asset
  const name = uploadData.get("name");
  const age = uploadData.get("age");
  const description = uploadData.get("description");
  const _csrf = uploadData.get("_csrf");

  //check if the inputs have been filled out
  if (!name) {
    helper.handleError("Missing name!");
    return false;
  } else if (!age) {
    helper.handleError("Missing age!");
    return false;
  } else if (!description) {
    helper.handleError("Missing description!");
    return false;
  }

  //runs /upload and returns the file data json object
  const fileData = await fetch("/upload", {
    method: "POST",
    body: uploadData,
    headers: {
      "csrf-token": _csrf,
    },
  });

  //console.log(fileData);

  //check if we have filedata json

  const result = await fileData.json();

  if (!result) {
    helper.handleError("File did not upload!");
    return false;
  }

  document.getElementById("assetMessage").classList.add("hidden");

  if (result.error) {
    helper.handleError(result.error);
  }

  if (result.redirect) {
    window.location = result.redirect;
  }

  loadAssetsFromServer(result);

  //console.log(fileData);

  return fileData;

  //return false;
};

//Upper nav bar react obj that handles uploading data to the DB
const AssetForm = (props) => {
  return (
    <form
      id="assetForm"
      onSubmit={handleAsset} // (1.) When the user hits submit, we handle the logic from our form in here
      name="assetForm"
      action="/upload"
      method="POST"
      className="assetForm"
      encType="multipart/form-data"
    >
      <label htmlFor="name">Name: </label>
      <input id="assetName" type="text" name="name" placeholder="Asset Name" />
      <label htmlFor="age">Price: </label>
      <input id="assetAge" type="number" min="0" name="age" />
      <label htmlFor="description">Description: </label>
      <input
        id="assetDescription"
        type="text"
        name="description"
        placeholder="Description"
      />
      <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />

      <input id="file" type="file" name="sampleFile" />

      <input className="makeAssetSubmit" type="submit" value="Make Asset" />
    </form>
  );
};

//React list of objects
const AssetList = (props) => {
  if (props.assets.length === 0) {
    return (
      <div className="assetList">
        <h3 className="emptyAsset">No Assets Yet!</h3>
      </div>
    );
  }

  //iterate through and create the asset nodes
  const assetNodes = props.assets.map((asset) => {
    //First section is the default asset logic
    //Second section is the retrieve form
    return (
      <div key={asset._id} className="asset">
        <img
          src="/assets/img/assetface.jpeg"
          alt="asset face"
          className="assetFace"
        />
        <div className="assetName"> Name: {asset.name}</div>
        <div className="assetAge"> Price: ${asset.age}</div>
        <div className="assetDescription">
          {" "}
          Description: {asset.description}
        </div>
        <button name="Download" onClick={downloadAsset}>
          Download
        </button>

        <form id="retrieveForm" action="/retrieve" method="get">
          <label htmlFor="fileName">Retrieve File By ID: </label>
          <input name="_id" type="text" />
          <input type="submit" value="Retrieve!" />
        </form>
      </div>
    );
  });

  return <div className="assetList">{assetNodes}</div>;
};

const downloadAsset = (e) => {
  console.log("downloaded");
};

//Creates the react element that displays all the assets
const loadAssetsFromServer = async () => {
  const response = await fetch("/getAssets");
  const data = await response.json();
  ReactDOM.render(
    <AssetList assets={data.assets} />,
    document.getElementById("assets")
  );
};

const loadAllAssetsFromServer = async () => {
  const response = await fetch("/getAllAssets");
  const data = await response.json();
  ReactDOM.render(
    <AssetList assets={data.assets} />,
    document.getElementById("assets")
  );
};

//Place holder for advertising other people's products
const StoreWindow = (props) => {
  console.log("Loaded store window");
  return (
    <img
      id="adPic"
      src="/assets/img/advertisement.png"
      alt="asset advertisement"
      href="https://vanphan.itch.io/peace-of-mind"
    ></img>
  );
};

const init = async () => {
  const response = await fetch("/getToken");
  const data = await response.json();

  const storeBtn = document.getElementById("storeBtn");
  const personalBtn = document.getElementById("personalBtn");

  //The store page button which should generate all items in the shop
  storeBtn.addEventListener("click", (e) => {
    e.preventDefault();

    //generates all the assets
    ReactDOM.render(
      <StoreWindow csrf={data.csrfToken} />,
      document.getElementById("ads")
    );

    //Our asset lists
    ReactDOM.render(
      <AssetList assets={[]} />,
      document.getElementById("assets")
    );

    loadAllAssetsFromServer();

    return false;
  });

  //Adds event to regenerate all the personal assets to the main page
  personalBtn.addEventListener("click", (e) => {
    e.preventDefault();

    //Asset Form is the nav bar for uploading
    ReactDOM.render(
      <AssetForm csrf={data.csrfToken} />,
      document.getElementById("makeAsset")
    );

    //AssetList is the list of all the assets
    ReactDOM.render(
      <AssetList assets={[]} />,
      document.getElementById("assets")
    );

    //populates the Asset list
    loadAssetsFromServer();

    return false;
  });

  //We just run default logic to render out all the Assets
  ReactDOM.render(
    <AssetForm csrf={data.csrfToken} />,
    document.getElementById("makeAsset")
  );

  //This is where the error occurs-------------------------------------------------->
  ReactDOM.render(<AssetList assets={[]} />, document.getElementById("assets"));

  loadAssetsFromServer();
  //-------------------------------------------------------------------------------->
};

window.onload = init;
