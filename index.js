const fs = require('fs');
const strftime = require('strftime');

class JsonChatStorage {
    /**
     * Chat storage. Storage method (JSON)
     * @constructor
     * @param {string} name name of JSON storage 
     * @param {integer|false} length number of stored messages
     * @param {string} dir folder for storing all json storages
     */
	constructor(name, length=false, dir="./chats"){
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
    /**
     * Adds a message to JSON storage
     * @param {string} user user who sent the message
     * @param {string} message the message the user sent
     * @param {string|none} time time when the message was sent if none then time = current time
     * @returns added message
     */
    addmessage(user, message, time=this.time){
        if(!message || !user){
            return false;
        }
        let mess = {
            user: user,
            message: message,
            time:time
        }
		
        this.messages.push(mess);
        if(this.messages.length>this.meslength && this.meslength){
            this.messages.shift();
        }
        this.backup();
        return mess;
    }
    /**
     * Deletes a last message of user
     * @param {string} user the user from whom you want to delete the last message
     */
    deletelastmessage(user){
        for (let i = this.messages.length-1; i >= 0; i--){
            if(this.messages[i].user == user){
                this.messages.splice(i, 1);
                this.backup();
            }
        }
    }
    /**
     * Deletes a message by index(constructor.messages[index])
     * @param {integer} index 
     */
    deletemessage(index){
        this.messages.splice(index, 1)
    }
    /**
     * erases a JSON storage
     */
    erase(){
        this.messages = [];
        this.backup();
    }
    /**
     * Get current time in format YYYY-MM-DD HH:MM:SS
     */
     get time(){
        return strftime("%Y-%m-%d %H:%M:%S");
    }
    /**
     * backups a JSON storage
     */
    backup(){
        fs.writeFileSync(`./${this._dir}/${this._name}.json`, JSON.stringify(this.messages, null, 4));
    }

}

class SqliteChatStorage {
    /**
     * Chat storage. Storage method (sqlite)
     * @constructor
     * @param {string} name name of table in sqlite database
     * @param {string} dbpath path to sqlite database
     * @param {integer|false} length number of stored messages
     */
    constructor(name, dbpath="chat.db", length=false){
        const sqlite3 = require('sqlite3');
        this._db = new sqlite3.Database(dbpath);
        this.meslength = length;
        this._name = name;
        this._prepared = false;
    }
    /**
     * Preparing and initializing the table
     * @returns promise
     */
    prepare(){
        return new Promise((res, rej)=>{
            if(!this._prepared){
                this._db.serialize(()=>{
                    this._db.run(`CREATE TABLE IF NOT EXISTS ${this._name} (ID INTEGER PRIMARY KEY AUTOINCREMENT, user, message, time)`);
                    this._prepared = true;
                    this._updatemessages().then(res);
                });
            } else{
                res();
            }
        });
    }
    /**
     * Adds a message to sqlite table
     * @param {string} user user who sent the message
     * @param {string} message the message the user sent
     * @param {string|none} time time when the message was sent if none then time = current time
     * @returns promise
     */
    addmessage(user, message, time=this.time){
        return new Promise((res, rej)=>{
            this._db.serialize(()=>{
                this._db.all(`SELECT COUNT(*) as count FROM ${this._name}`, (err, row)=>{
                    if(this.meslength){
                        if(row[0].count >= this.meslength){
                            this._db.run(`DELETE FROM ${this._name} WHERE ID = (SELECT MIN(ID) FROM ${this._name})`)
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
            this._db.all(`SELECT * FROM ${this._name} ORDER BY time`, (err, row)=>{
                this._messages = row;
                res();
            });
        });
    }
    /**
     * Select a message(s) by sql-query
     * @param {string} what sql column
     * @param {string|none} where sql condition
     * @returns promise(err|row)
     */
    select(what, where){
        if (where){
            return new Promise((res, rej)=>{
                this._db.all(`SELECT ${what} FROM ${this._name} WHERE ${where}`, (err, row)=>{
                    if(err) rej(err);
                    else res(row);
                });
            });
        }

        return new Promise((res, rej)=>{
            this._db.all(`SELECT ${what} FROM ${this._name}`, (err, row)=>{
                if(err) rej(err);
                else res(row);
            });
        });
    }
    /**
     * Deletes a message(s) by condition
     * @param {string} where sql condition
     * @returns promise
     */
    delete(where){
        return new Promise((res, rej)=>{
            this._db.run(`DELETE FROM ${this._name} WHERE ${where}`, (err)=>{
                if(err) rej(err);
                this._updatemessages().then(res);
            });
        });
    }
    /**
     * Runs the SQL query with the specified parameters.
     * @param {string} query SQLite query
     * @returns promise(err|row)
     */
    sqlite_all(query){
        return new Promise((res, rej)=>{
            this._db.all(query, (err, row)=>{
                if(err) rej(err);
                else res(row);
            });
        });
    }
    /**
     * Deletes a message by id
     * @param {integer} id message id (constructor.messages[*].id)
     * @returns promise
     */
    deletemessage(id){
        return new Promise((res, rej)=>{
            this._db.run(`DELETE FROM ${this._name} WHERE ID = ${id}`, ()=>{
                this._updatemessages().then(res);
            });
        });
    }
    /**
     * Replace a message by id
     * @param {integer} id message id (constructor.messages[*].id)
     * @param {string} message message to replace
     * @returns promise
     */
    replacemessage(id, message){
        return new Promise((res, rej)=>{
            this._db.run(`UPDATE ${this._name} SET message = "${message}" WHERE ID = ${id}`, ()=>{
                this._updatemessages().then(res);
            });
        });
    }
    /**
     * @param {integer} index 
     * @returns id of message from index (constructor.messages[index].id)
     */
    getBdId(index){
        return this._messages[index].ID;
    }
    /**
     * Erases the sqlite table
     * @returns promise
     */
    erase(){
        return new Promise((res, rej)=>{
            this._messages = [];
            this._db.run(`DROP TABLE IF EXISTS ${this._name}`, res);
        });
    }
    /**
     * Get all messages in sqlite table
     */
    get messages(){
        return this._messages
    }
    set messages(v){
        throw new Error("in sqlite chat storage you can't change the messages variable, you can only read it")
    }
    /**
     * Get name of sqlite table
     */
     get name(){
        return this._name
    }
    set name(v){
        throw new Error("in sqlite chat storage you can't change the name variable, you can only read it")
    }
    /**
     * Get current time in format YYYY-MM-DD HH:MM:SS
     */
    get time(){
        return strftime("%Y-%m-%d %H:%M:%S");
    }
}

module.exports = {
    JSON:JsonChatStorage,
    sqlite:SqliteChatStorage
};