import Handlebars from "handlebars";

const rawTemplate = document.getElementById("chat-template").innerHTML;
const entryNode = document.body; 
const compiledTemplate = Handlebars.compile(rawTemplate)();

entryNode.innerHTML = compiledTemplate;