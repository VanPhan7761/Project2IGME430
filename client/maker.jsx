const helper = require('./helper.js');

const handleDomo = (e) => {
    e.preventDefault(); 
    helper.hideError();

    // (2.) Grab the data from our form
    const name = e.target.querySelector('#domoName').value; 
    const age = e.target.querySelector("#domoAge").value; 
    const description = e.target.querySelector("#domoDescription").value; 

    const _csrf = e.target.querySelector("#_csrf").value;

    if(!name || !age || !description) {
        helper.handleError('All fields are required!'); 
        return false;
    }

    // (3.) Send the json obj to our helper
    helper.sendPost(e.target.action, {name, age, description, _csrf}, loadDomosFromServer);

    return false;
}

//Generates the form itself
const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo} // (1.) When the user hits submit, we handle the logic from our form in here
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
            // encType="multipart/form-data"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <label htmlFor="description">Description: </label>
            <input id="domoDescription" type="text" description="description" placeholder="Description" />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
}

const DomoList = (props) =>{
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

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
                

                {/* <form ref='retrieveForm' 
                    id='retrieveForm' 
                    action='/retrieve' 
                    method='get'>
                    <label for='fileName'>Retrieve File By ID: </label>
                    <input name='_id' type='text' />
                    <input type='submit' value='Retrieve!' />
                </form> */}
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

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
}

//loads all assets for the user to buy
const StoreWindow = (props) => {
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
        //the rendered page
        ReactDOM.render(<StoreWindow csrf={data.csrfToken} />,
            document.getElementById('domos'));
        return false; 
    });

    personalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        //render out the domo list again
        ReactDOM.render(
            <DomoForm csrf={data.csrfToken} />,
            document.getElementById('makeDomo')
        );
    
        ReactDOM.render(
            <DomoList domos={[]} />,
            document.getElementById('domos')
        );
        
        loadDomosFromServer();

        return false; 
    });


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
