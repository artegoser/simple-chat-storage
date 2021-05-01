const fs = require('fs');
const strftime = require('strftime');

class JsonChatStorage {
	constructor(name, length=100, dir="./chats"){
        this.meslength = length;
        this._name = name;
        this._dir = dir;
        try{
            this.messages = this._req(`./${this._dir}/${this._name}.json`);
        } catch{
            this.messages = [];
        }
		
		if (!fs.existsSync(this._dir)) fs.mkdirSync(this._dir);
    }

    _req(path){
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
        fs.writeFileSync(`./${this._dir}/${this._name}.json`, JSON.stringify(this.messages, null, 4));
    }

}

class SqliteChatStorage {
    constructor(name, dbpath="chat.db", length=false){
        const sqlite3 = require('sqlite3');
        this._db = new sqlite3.Database(dbpath);
        this.meslength = length;
        this._name = name;
    }
    prepare(){
        return new Promise((res, rej)=>{
            this._db.serialize(()=>{
                this._db.run(`CREATE TABLE IF NOT EXISTS ${this._name} (ID INTEGER PRIMARY KEY AUTOINCREMENT, user, message, time)`);
                this._updatemessages().then(res);
            });
        });
    }
    addmessage(user, message, time=this.time){
        return new Promise((res, rej)=>{
            this._db.serialize(()=>{
                this._db.all(`SELECT COUNT(*) as count FROM ${this._name}`, (err, row)=>{
                    if(this.meslength){
                        if(row[0].count >= this.meslength){
                            this._db.run(`DELETE FROM ${this._name} WHERE ID = (SELECT MIN(ID) FROM ${this._name})`)
                            this.messages.shift();
                        }
                    }
                    this._db.run(`INSERT INTO ${this._name} (user, message, time) VALUES ("${user}", "${message}", "${time}")`, ()=>{
                        this._updatemessages().then(res);
                    });
                });
            });
        });
    }
    _updatemessages(){
        return new Promise((res, rej)=>{
            this._db.all(`SELECT * FROM ${this._name}`, (err, row)=>{
                this.messages = row;
                res();
            });
        });
    }
    deletelastmessage(user){
        return new Promise((res, rej)=>{
            this.messages.shift();
            this._db.run(`DELETE FROM ${this._name} WHERE ID = (SELECT MAX(ID) FROM ${this._name}) AND user = "${user}"`, res);
        });
    }
    deletemessage(id){
        return new Promise((res, rej)=>{
            this._db.run(`DELETE FROM ${this._name} WHERE ID = ${id}`, ()=>{
                this._updatemessages().then(res);
            });
        });
    }
    replacemessage(id, message){
        return new Promise((res, rej)=>{
            this._db.run(`UPDATE ${this._name} SET message = "${message}" WHERE ID = ${id}`, ()=>{
                this._updatemessages().then(res);
            });
        });
    }
    getBdId(id){
        return this.messages[id].ID;
    }
    erase(){
        return new Promise((res, rej)=>{
            this.messages = [];
            this._db.run(`DROP TABLE IF EXISTS ${this._name}`, res);
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