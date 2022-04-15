(()=>{var e={603:e=>{const t=e=>{document.getElementById("errorMessage").textContent=e,document.getElementById("domoMessage").classList.remove("hidden")};e.exports={handleError:t,sendPost:async(e,o,a)=>{const n=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}),r=await n.json();document.getElementById("domoMessage").classList.add("hidden"),r.error&&t(r.error),r.redirect&&(window.location=r.redirect),a&&a(r)},hideError:()=>{document.getElementById("domoMessage").classList.add("hidden")}}}},t={};function o(a){var n=t[a];if(void 0!==n)return n.exports;var r=t[a]={exports:{}};return e[a](r,r.exports,o),r.exports}(()=>{const e=o(603),t=t=>{t.preventDefault(),e.hideError();const o=t.target.querySelector("#domoName").value,a=t.target.querySelector("#domoAge").value,n=t.target.querySelector("#domoDescription").value,r=t.target.querySelector("#_csrf").value;return o&&a&&n?(e.sendPost(t.target.action,{name:o,age:a,description:n,_csrf:r},c),!1):(e.handleError("All fields are required!"),!1)},a=e=>React.createElement("form",{id:"domoForm",onSubmit:t,name:"domoForm",action:"/maker",method:"POST",className:"domoForm"},React.createElement("label",{htmlFor:"name"},"Name: "),React.createElement("input",{id:"domoName",type:"text",name:"name",placeholder:"Domo Name"}),React.createElement("label",{htmlFor:"age"},"Age: "),React.createElement("input",{id:"domoAge",type:"number",min:"0",name:"age"}),React.createElement("label",{htmlFor:"description"},"Description: "),React.createElement("input",{id:"domoDescription",type:"text",description:"description",placeholder:"Description"}),React.createElement("input",{id:"_csrf",type:"hidden",name:"_csrf",value:e.csrf}),React.createElement("input",{className:"makeDomoSubmit",type:"submit",value:"Make Domo"})),n=e=>{if(0===e.domos.length)return React.createElement("div",{className:"domoList"},React.createElement("h3",{className:"emptyDomo"},"No Domos Yet!"));const t=e.domos.map((e=>React.createElement("div",{key:e._id,className:"domo"},React.createElement("img",{src:"/assets/img/domoface.jpeg",alt:"domo face",className:"domoFace"}),React.createElement("div",{className:"domoName"}," Name: ",e.name),React.createElement("div",{className:"domoAge"}," Age: ",e.age),React.createElement("div",{className:"domoDescription"}," Description: ",e.description),React.createElement("button",{name:"Download",onClick:r},"Download"))));return React.createElement("div",{className:"domoList"},t)},r=e=>{console.log("downloaded")},c=async()=>{const e=await fetch("/getDomos"),t=await e.json();ReactDOM.render(React.createElement(n,{domos:t.domos}),document.getElementById("domos"))},m=e=>React.createElement("p",null,"I work!!");window.onload=async()=>{const e=await fetch("/getToken"),t=await e.json(),o=document.getElementById("storeBtn"),r=document.getElementById("personalBtn");o.addEventListener("click",(e=>(e.preventDefault(),ReactDOM.render(React.createElement(m,{csrf:t.csrfToken}),document.getElementById("domos")),!1))),r.addEventListener("click",(e=>(e.preventDefault(),ReactDOM.render(React.createElement(a,{csrf:t.csrfToken}),document.getElementById("makeDomo")),ReactDOM.render(React.createElement(n,{domos:[]}),document.getElementById("domos")),c(),!1))),ReactDOM.render(React.createElement(a,{csrf:t.csrfToken}),document.getElementById("makeDomo")),ReactDOM.render(React.createElement(n,{domos:[]}),document.getElementById("domos")),c()}})()})();