class User {
	constructor(db){
		this.DB = db;
	}
	
	create(name, email, hash, callback){
		var query = 'INSERT INTO users SET u_email = "'+email+'", u_name = "'+name+'", u_pass = "'+hash+'", u_chat = 0';
		this.DB.query(query).then((results) => {
			this.id = results.insertId;
			this.name = name;
			callback(this);
		}).catch((err) => {
			console.log(err);
		});
	}
	
	get(id, callback){
		var query = 'SELECT * FROM users WHERE u_id = '.id;
		this.DB.query(query).then((results) => {
			this.id = results[0].u_id;
			this.name = results[0].u_name;
			this.hasChar = results[0].u_has_char;
			this.firstRun = results[0].u_first_run;
			this.chat = results[0].u_chat;
			
			callback(this);
		}).catch((err) => {
			console.log(err);
		});
	}
	
	update(data, callback){
		var query = 'UPDATE users SET u_name = "'+data.name+'", u_has_char = "'+data.hasChar+'", u_first_run = "'+data.firstRun+'" WHERE u_id = '+data.id;
		this.DB.query(query).then((results) => {
			callback(JSON.parse(JSON.stringify(results)));
		}).catch((err) => {
			console.log(err);
		});
	}
}

module.exports = (db) => {
    return new User(db);
}