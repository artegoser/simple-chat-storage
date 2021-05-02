let chat = require("./index").JSON;//simple-chat-storage
let test = new chat("test");
test.addmessage("Dr. Who", "Fez!");
console.log(test.messages);