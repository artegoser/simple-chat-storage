const fs = require('fs');
const strftime = require('strftime');

class JsonChatStorage {
	constructor(name, length=100, dir="./chats"){
        this.meslength = length;
        this.name = name;
		this.dir = dir;
        try{
            this.messages = this.req(`./${this.dir}/${this.name}.json`);
        } catch{
            this.messages = [];
        }
		
		if (!fs.existsSync(this.dir)) fs.mkdirSync(this.dir);
    }

    req(path){
		return JSON.parse(fs.readFileSync(path, 'utf-8'));
	}

    addmessage(user, message, autobackup=true, time="default"){
        if(message==""){
            return false;
        }
        let mess = {
            user: user,
            message: message
        }
		if(time==="default") mess.time = strftime("%d.%m.%Y %H:%M:%S");
		else mess.time = time;
		
        this.messages.push(mess);
        if(this.messages.length>this.meslength){
            this.messages.shift();
        }
        if(autobackup) this.backup();
        return mess;
    }

    deletelastmessage(user, autobackup=true){
        for (let i = this.messages.length-1; i >= 0; i--){
            if(this.messages[i].user == user){
                this.messages.splice(i, 1);
                if(autobackup) this.backup();
                return true;
            }
        }
        return false;
    }

    backup(){
        fs.writeFileSync(`./${this.dir}/${this.name}.json`, JSON.stringify(this.messages, null, 4));
    }

}

class SqliteChatStorage {
    constructor(name, dbpath="chat.db", length=100){
        const sqlite3 = require('sqlite3').verbose();
        this.db = new sqlite3.Database(dbpath);
        this.meslength = length;
        this.name = name;
        
    }
    create(){
        this.db.run(`CREATE TABLE ${this.name} (user, message, time)`);
    }
}

module.exports = {
    JSON:JsonChatStorage,
    sqlite:SqliteChatStorage
};