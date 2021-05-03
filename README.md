# simple-chat-storage
### Chat storage for node  
[![NPM](https://nodei.co/npm/simple-chat-storage.png)](https://nodei.co/npm/simple-chat-storage/)  

![npm](https://img.shields.io/npm/v/simple-chat-storage)
![npm](https://img.shields.io/npm/dt/simple-chat-storage)
[![Coverage Status](https://coveralls.io/repos/github/artegoser/simple-chat-storage/badge.svg?branch=main)](https://coveralls.io/github/artegoser/simple-chat-storage?branch=main)
![NPM](https://img.shields.io/npm/l/simple-chat-storage)


## API (There is both a JSON storage and a sqlite storage)
  
addmessage(user, message, time=this.time) - add message to chat  
deletelastmessage(user) - delete last user message  
erase() - erase the storage

## API (sqlite)

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

## API (JSON)

constructor(name, length=false, dir="./chats") - name(name of the chat table), length(false if infinite)  

### Example
```javascript
let chat = require("simple-chat-storage").JSON;
let test = new chat("test");
test.addmessage("Dr. Who", "Fez!");
console.log(test.messages);
```

## Coverage
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|---------------------------
 index.js |   58.57 |    63.64 |   58.06 |   60.29 | 12,24,34,41-52,89-91,110-135