# simple-chat-storage
### Chat storage for node  
[![NPM](https://nodei.co/npm/simple-chat-storage.png)](https://nodei.co/npm/simple-chat-storage/)  

![npm](https://img.shields.io/npm/v/simple-chat-storage)
![npm](https://img.shields.io/npm/dt/simple-chat-storage)
[![Coverage Status](https://coveralls.io/repos/github/artegoser/simple-chat-storage/badge.svg?branch=main)](https://coveralls.io/github/artegoser/simple-chat-storage?branch=main)
![NPM](https://img.shields.io/npm/l/simple-chat-storage)


# Full Documentation - [Documentation](https://artegoser.github.io/simple-chat-storage/documentation)

## API (There is both a JSON storage and a sqlite storage)
  
addmessage(user, message, time=this.time) - adds message to chat  
erase() - erases the storage
deletemessage(id) - deletes the message by id  

## API (sqlite)

constructor(name, dbpath="chat.db", length=false) - name(name of the chat table),  dbath(path to the database), length(false if infinite)

prepare() - prepares the storage and return a promise  
deletemessage(id) - deletes the message by id  
replacemessage(id, message) - replaces the message by id  
getBdId(index) - returns id of message from index (constructor.messages[index].id)
select(what, where(optional)).then((row)=>{}).catch((err)=>{}) - SQL selector
delete(where) - SQL deleter

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
deletelastmessage(user) - deletes last user message  

### Example
```javascript
let chat = require("simple-chat-storage").JSON;
let test = new chat("test");
test.addmessage("Dr. Who", "Fez!");
console.log(test.messages);
```

## Coverage
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   92.86 |    81.25 |    92.5 |   93.67 |
 index.js |   92.86 |    81.25 |    92.5 |   93.67 | 75-76,230-232