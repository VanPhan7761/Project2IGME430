const helper = require('./helper.js');

//Event called after the upload button is clicked in the domo form
const handleDomo = async (e) => {
    e.preventDefault(); 
    helper.hideError();

    const uploadData = new FormData(e.target);

    //console.log(uploadData.get("name"));

    // (2.) Grab the data from our form
    // const name = e.target.querySelector('#domoName').value; 
    // const age = e.target.querySelector("#domoAge").value; 
    // const description = e.target.querySelector("#domoDescription").value; 
    // const _csrf = e.target.querySelector("#_csrf").value;


    //checks if we have all the fields filled before making a domo 

    const name = uploadData.get("name");
    const age = uploadData.get("age");
    const description = uploadData.get("description");
    const _csrf = uploadData.get("_csrf");

    console.log(_csrf);

    //check if the inputs have been filled out
    if(!name) {
        helper.handleError('Missing name!'); 
        return false;
    }
    else if(!age){
        helper.handleError('Missing age!'); 
        return false;
    }
    else if(!description){
        helper.handleError('Missing description!'); 
        return false;
    }


    //runs /upload and returns the file data json object
    const fileData = await fetch('/upload', {
        method: 'POST',
        body: uploadData,
        headers: {
            'csrf-token': _csrf,
        },
    });

    console.log(fileData);


    //check if we have filedata json
    if(!fileData){
        helper.handleError('File did not upload!'); 
        return false;
    }

    // (3.) Send the json obj to our helper
    //helper.sendPost(e.target.action, {name, age, description, fileData, _csrf}, loadDomosFromServer);

    return false;
}

//Upper nav bar react obj that handles uploading data to the DB
const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo} // (1.) When the user hits submit, we handle the logic from our form in here
            name="domoForm"
            action="/upload"
            method="POST"
            className="domoForm"
            encType="multipart/form-data"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <label htmlFor="description">Description: </label>
            <input id="domoDescription" type="text" name="description" placeholder="Description" />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />


            <input type="file" name="sampleFile" />


            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
}

//React list of objects
const DomoList = (props) =>{
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }


    //iterate through and create the asset nodes 
    const domoNodes = props.domos.map(domo => {
        //First section is the default domo logic
        //Second section is the retrieve form
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <div className="domoName"> Name: {domo.name}</div>
                <div className="domoAge"> Age: {domo.age}</div>
                <div className="domoDescription"> Description: {domo.description}</div>
                <button name="Download" onClick={downloadAsset}>Download</button>
                

                 <form 
                    id='retrieveForm' 
                    action='/retrieve' 
                    method='get'>
                    <label for='fileName'>Retrieve File By ID: </label>
                    <input name='_id' type='text' />
                    <input type='submit' value='Retrieve!' />
                </form> 
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
}

const downloadAsset = (e) => {
    console.log("downloaded");
}

//Creates the react element that displays all the domos
const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
}

const loadAllDomosFromServer = async () => {
    const response = await fetch('/getAllDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
}

//loads all assets for the user to buy
const StoreWindow = (props) => {
    console.log("I work!!")
    return (
        <p>I work!!</p>
    );
};

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const storeBtn = document.getElementById('storeBtn');
    const personalBtn = document.getElementById('personalBtn');

    
    storeBtn.addEventListener('click', (e) => {
        e.preventDefault();

        //generates all the domos
        ReactDOM.render(<StoreWindow csrf={data.csrfToken} />,
            document.getElementById('domos')
        );


        //Our domo lists
        ReactDOM.render(
            <DomoList domos={[]} />,
            document.getElementById('domos')
        );

        loadAllDomosFromServer();

        
        return false; 
    });

    //Adds event to regenerate all the personal assets to the main page
    personalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        
        //Domo Form is the nav bar for uploading
        ReactDOM.render(
            <DomoForm csrf={data.csrfToken} />,
            document.getElementById('makeDomo')
        );
    

        //DomoList is the list of all the domos
        ReactDOM.render(
            <DomoList domos={[]} />,
            document.getElementById('domos')
        );
        
        //populates the Domo list 
        loadDomosFromServer();

        return false; 
    });


    //We just run default logic to render out all the Domos
    ReactDOM.render(
        <DomoForm csrf={data.csrfToken} />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} />,
        document.getElementById('domos')
    );

    loadDomosFromServer();
}

window.onload = init;
