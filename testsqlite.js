const chat = require("./index").sqlite;//simple-chat-storage
const test = new chat("test", "chat.db", 30);
test.prepare().then(()=>{
	test.addmessage("Dr. Who", "Fez!").then(()=>{
		console.log(test.messages.length);
		test.deletelastmessage("Dr. Who").then(()=>{
			console.log(test.messages.length);
		});
	});
	
});