function randch(length) {
    randchi++;
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join('')+randchi;
}
let randchi = 0;
describe("JSON",()=>{
    let chat = require("./index").JSON;
    let test = new chat("test", 15);
    describe(`JSON add message`, ()=>{
        it(`should return false when !message`, ()=>{
            if(test.addmessage("artegoser")) throw new Error("not returning false")
        });
        it(`should return false when !user`, ()=>{
            if(test.addmessage()) throw new Error("not returning false")
        });
        for(let i = 0; i<8; i++){
            describe(`test ${i}`, ()=>{
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
    describe(`JSON delete message`, ()=>{
        let user = "Harry";
        it(`should delete lastmessage ${user}`,()=>{
            test.addmessage("Harry", "Hello!");
            test.addmessage("notHarry", "Hello!");
            test.deletelastmessage("Harry")
            for(let i = 0; i<test.messages.length; i++){
                if(test.messages[i].user === "Harry") throw new Error(`Last message ${user} not deleted`);
            }
        });

        for(let i = 0; i<5; i++){
            it(`should delete message ${i}`,()=>{
                let init_message = test.messages[i];
                test.deletemessage(i);
                if(test.messages[i]===init_message){
                    throw new Error(`message is not deleted ${test.messages[i].message}, ${i}`);
                }
            });
        }
    });
});

describe("sqlite",()=>{
    let chat = require("./index").sqlite;
    let test = new chat("test", "chat.db", 15);
    describe(`sqlite add message`, ()=>{
        for(let i = 0; i<8; i++){
            describe(`test ${i}`, ()=>{
                let message = randch(15);
                let user = randch(5);
                it(`should add a user "${user}" to message`, ()=>{
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
    describe(`sqlite delete message`, ()=>{
        for(let i = 0; i<5; i++){
            it(`should delete message ${i}`,()=>{
                return test.prepare().then(()=>{
                    let init_message = test.messages[i];
                    return test.deletemessage(test.getBdId(i)).then(()=>{
                        if(test.messages[i]===init_message){
                            throw new Error(`message is not deleted ${test.messages[i].message}, ${i}`);
                        }
                    });
                });
            });
        }
    });
    it("should throw error when messages has been changed", ()=>{
        let error = false;
        try{
            test.messages = 0;
        } catch{
            error = true;
        }
        if(!error){
            throw new Error("no error occurred")
        }
    });
    describe(`sqlite select message`, ()=>{
        it("should select all messages", ()=>{
            return test.prepare().then(()=>{
                return test.select("*").then((val)=>{
                    if(val.length!==test.messages.length){
                        throw new Error("not all messages selected")
                    }
                });
            });
        });
        it("should throw error", ()=>{
            return test.prepare().then(()=>{
                let error = false;
                return test.select("err").catch((err)=>{
                    error = true;
                }).then(()=>{
                    if(!error) throw new Error("no error occurred");
                })
            });
        });
        it("should select all messages where id>3", ()=>{
            return test.prepare().then(()=>{
                return test.select("*", "id>3").then((val)=>{
                    for(let i=0; i<val.length; i++){
                        if(val[i].id <= 3){
                            throw new Error("incorrect selection")
                        }
                    }
                });
            });
        });
    });
    it("should replace message to HEllo lol", ()=>{
        return test.prepare().then(()=>{
            return test.addmessage("Cool", "not lol").then(()=>{
                return test.replacemessage(test.getBdId(0), "HEllo lol").then(()=>{
                    if(test.messages[0].message !== "HEllo lol") throw new Error(`message is not replaced ${test.messages[2].message}, HEllo lol`);
                });
            });
        });
    });
});