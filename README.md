# simple-chat-storage
### Chat storage for node  
[![NPM](https://nodei.co/npm/simple-chat-storage.png)](https://nodei.co/npm/simple-chat-storage/)  

![npm](https://img.shields.io/npm/v/simple-chat-storage)
![NPM](https://img.shields.io/npm/l/simple-chat-storage)
![Libraries.io SourceRank](https://img.shields.io/librariesio/sourcerank/npm/simple-chat-storage)

## API 1.1.1 (There is both a JSON storage and a sqlite storage)
  
addmessage(user, message, time="default") - add message to chat  
deletelastmessage(user) - delete last user message  
erase() - erase the storage

## API 1.1.1 (sqlite)

constructor(name, dbpath="chat.db", length=false) - name(name of the chat table),  dbath(path to the database), length(false if infinite)

prepare() - prepares the storage and return a promise  
deletemessage(id) - deletes the message by id  
replacemessage(id, message) - replaces the message by id  
getBdId(id) - returns the real message ID  

### Example
```javascript
const chat = require("simple-chat-storage").sqlite;
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
```

## API 1.1.1 (JSON)

constructor(name, length=100, dir="./chats") - constructor of chat class  

### Example
```javascript
let chat = require("simple-chat-storage").JSON;
let test = new chat("test");
test.addmessage("Dr. Who", "Fez!");
console.log(test.messages);
```