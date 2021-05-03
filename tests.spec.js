function randch(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join('');
}

describe("JSON",()=>{
    let chat = require("./index").JSON;
    let test = new chat("test");
    for(let i = 0; i<5; i++){
        describe(`JSON message test ${i}`, ()=>{
            let message = randch(15);
            let user = randch(5);
            
            it(`should add a user "${user}" to message`, ()=>{
                test.addmessage(user, message);
                if(test.messages[test.messages.length-1].user !== user){
                    if(!test.messages[test.messages.length-1].user) throw new Error("there is no user")
                    throw new Error(`wrong user added "${user}" "${test.messages[test.messages.length-1].user}"`);
                }
            });

            it(`should add a message "${message}"`, ()=>{
                test.addmessage(user, message);
                if(test.messages[test.messages.length-1].message !== message){
                    if(!test.messages[test.messages.length-1].message) throw new Error("there is no message")
                    throw new Error(`wrong message added "${message}" "${test.messages[test.messages.length-1].message}"`);
                }
            });
        });
    }
});

describe("sqlite",()=>{
    let chat = require("./index").sqlite;
    let test = new chat("test");
    for(let i = 0; i<5; i++){
        describe(`sqlite message test ${i}`, ()=>{
            let message = randch(15);
            let user = randch(5);
            it(`should add a user "${user}" to message`, ()=>{
                it(`should add loh`)
                return test.prepare().then(()=>{
                    return test.addmessage(user, message).then(()=>{
                        if(test.messages[test.messages.length-1].user !== user){
                            if(!test.messages[test.messages.length-1].user) throw new Error("there is no user")
                            throw new Error(`wrong user added "${user}" "${test.messages[test.messages.length-1].user}"`);
                        }
                    });
                });
            });

            it(`should add a message "${message}"`, ()=>{
                return test.prepare().then(()=>{
                    return test.addmessage(user, message).then(()=>{
                        if(test.messages[test.messages.length-1].message !== message){
                            if(!test.messages[test.messages.length-1].message) throw new Error("there is no message")
                            throw new Error(`wrong message added "${message}"`);
                        }
                    });
                });
            });
        });
    }
});