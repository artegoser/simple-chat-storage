# simple-chat-storage
Chat storage for node

## API 1.1.0 (There is both a JSON storage and a sqlite storage)
  
addmessage(user, message, time="default") - add message to chat  
deletelastmessage(user) - delete last user message  
erase() - erase the storage

## API 1.1.0 (sqlite)

prepare() - prepares the storage and return a promise  
deletemessages(id) - deletes the message by id  
updatemessages() - updates data from the storage (but the library itself updates storage when adding or deleting messages)  

### Example
```javascript
const chat = require("simple-chat-storage").sqlite;
const test = new chat("test", "chat.db", 30);
test.prepare().then(()=>{
    test.addmessage("Dr. Who", "Fez!").then(()=>{
        console.log(test.messages.length);
        test.deletelastmessage("Dr. Who").then(()=>{
            console.log(test.messages.length);
        });
    });   
});
```

## API 1.1.0 (JSON)

constructor(name, length=100, dir="./chats") - constructor of chat class  

### Example
```javascript
let chat = require("simple-chat-storage").JSON;
let test = new chat("test");
test.addmessage("artegoser", "Hello World!");
```