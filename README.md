# simple-chat-storage
### Chat storage for node  
[![NPM](https://nodei.co/npm/simple-chat-storage.png)](https://nodei.co/npm/simple-chat-storage/)  

![npm](https://img.shields.io/npm/v/simple-chat-storage)
![npm](https://img.shields.io/npm/dt/simple-chat-storage)
[![Coverage Status](https://coveralls.io/repos/github/artegoser/simple-chat-storage/badge.svg?branch=main)](https://coveralls.io/github/artegoser/simple-chat-storage?branch=main)
![NPM](https://img.shields.io/npm/l/simple-chat-storage)


|📚[Documentation](https://artegoser.github.io/simple-chat-storage/documentation/index.html)|📕[Bugs](https://github.com/artegoser/simple-chat-storage/issues)|
|-|-|

## Installation
`npm i simple-chat-storage`  
or  
`yarn add simple-chat-storage`

## Most usefull features (There is both a JSON storage and a sqlite storage)
  
**addmessage(user, message, time(optional))** - adds message to chat  
**erase()** - erases the storage  
**deletemessage(index)** - deletes the message by index(storage.messages[index])  

## Most usefull features (sqlite)

new SqliteChatStorage(name, dbpath, length)
|Name  |Type	     |Default|Description                     |
|------|-------------|-------|--------------------------------|
|name  |string       |		 |name of table in sqlite database|
|dbpath|string       |chat.db|path to sqlite database         |
|length|integer/false|false  |number of stored messages       |

**prepare()** - Preparing and initializing the table and returnings a promise  
**deletemessage(id)** - deletes the message by id  
**replacemessage(id, message)** - replaces the message by id  
**delete(where)** - SQL deleter  
**select(what, where(optional))**.then((row)=>{}).catch((err)=>{}) - SQL selector  
**getBdId(index)** - returns id of message from index (storage.messages[index].id)

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

## Most usefull features (JSON)
`Faster than sqlite, but does not have SQL functions`

new JsonChatStorage(name, length, dir)

|Name  |Type         |Default |Description                           |
|------|-------------|--------|--------------------------------------|
|name  |string       |    	  |name of JSON storage                  |
|length|integer/false|false   |	number of stored messages            |
|dir   |string       |./chats |	folder for storing all json storages |

**deletelastmessage(user)** - Deletes a last message of user  

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
All files |   93.33 |    82.35 |   93.33 |   94.05 | 
 index.js |   93.33 |    82.35 |   93.33 |   94.05 | 75-76,242-244