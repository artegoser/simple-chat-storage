const chat = require("./index").sqlite;//simple-chat-storage
const test = new chat("test", "chat.db", 30);
test.prepare().then(()=>{
	test.addmessage("Dr. Who", "Fez!").then(()=>{
		console.log(test.messages[0]);
		test.replacemessage(test.getBdId(0), "Hooray, I can edit messages.")
		.then(()=>{
			console.log(test.messages[0]);
		});
	});
});