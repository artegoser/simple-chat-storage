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

    addmessage(user, message, time=this.time){
        if(message==""){
            return false;
        }
        let mess = {
            user: user,
            message: message,
            time:time
        }
		
        this.messages.push(mess);
        if(this.messages.length>this.meslength){
            this.messages.shift();
        }
        this.backup();
        return mess;
    }

    deletelastmessage(user){
        for (let i = this.messages.length-1; i >= 0; i--){
            if(this.messages[i].user == user){
                this.messages.splice(i, 1);
                this.backup();
                return true;
            }
        }
        return false;
    }
    erase(){
        this.messages = [];
        this.backup();
    }
    get time(){
        return strftime("%d.%m.%Y %H:%M:%S");
    }
    backup(){
        fs.writeFileSync(`./${this.dir}/${this.name}.json`, JSON.stringify(this.messages, null, 4));
    }

}

class SqliteChatStorage {
    constructor(name, dbpath="chat.db", length=false){
        const sqlite3 = require('sqlite3');
        this.db = new sqlite3.Database(dbpath);
        this.meslength = length;
        this.name = name;
    }
    prepare(){
        return new Promise((res, rej)=>{
            this.db.serialize(()=>{
                this.db.run(`CREATE TABLE IF NOT EXISTS ${this.name} (ID INTEGER PRIMARY KEY AUTOINCREMENT, user, message, time)`);
                this.updatemessages().then(res);
            });
        });
    }
    addmessage(user, message, time=this.time){
        return new Promise((res, rej)=>{
            this.db.serialize(()=>{
                this.db.all(`SELECT COUNT(*) as count FROM ${this.name}`, (err, row)=>{
                    if(this.meslength){
                        if(row[0].count >= this.meslength){
                            this.db.run(`DELETE FROM ${this.name} WHERE ID = (SELECT MIN(ID) FROM ${this.name})`)
                            this.messages.shift();
                        }
                    }
                    this.db.run(`INSERT INTO ${this.name} (user, message, time) VALUES ("${user}", "${message}", "${time}")`, ()=>{
                        this.updatemessages().then(res);
                    });
                });
            });
        });
    }
    updatemessages(){
        return new Promise((res, rej)=>{
            this.db.all(`SELECT * FROM ${this.name}`, (err, row)=>{
                this.messages = row;
                res();
            });
        });
    }
    deletelastmessage(user){
        return new Promise((res, rej)=>{
            this.messages.shift();
            this.db.run(`DELETE FROM ${this.name} WHERE ID = (SELECT MAX(ID) FROM ${this.name}) AND user = "${user}"`, res);
        });
    }
    deletemessage(id){
        return new Promise((res, rej)=>{
            this.db.run(`DELETE FROM ${this.name} WHERE ID = ${id}`, ()=>{
                this.updatemessages().then(res);
            });
        });
    }
    replacemessage(id, message){
        return new Promise((res, rej)=>{
            this.db.run(`UPDATE ${this.name} SET message = "${message}" WHERE ID = ${id}`, ()=>{
                this.updatemessages().then(res);
            });
        });
    }
    getBdId(id){
        return this.messages[id].ID;
    }
    erase(){
        return new Promise((res, rej)=>{
            this.messages = [];
            this.db.run(`DROP TABLE IF EXISTS ${this.name}`, res);
        });
    }
    get time(){
        return strftime("%d.%m.%Y %H:%M:%S");
    }
}

module.exports = {
    JSON:JsonChatStorage,
    sqlite:SqliteChatStorage
};