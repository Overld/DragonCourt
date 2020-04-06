require('dotenv').config();
const {mysql, pool} = require('./lib/mysql');
const db = require('./lib/db');
var express = require('express');
const fs = require('fs');
const path = require('path');
const async = require('async');
const bcrypt = require('bcrypt');
global.express = express;
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var sessionConnection = mysql.createPool({
    connectionLimit : 1,
    timeout         : 60 * 60 * 1000,
    host            : process.env['DB_HOST'],
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_DB
});

var sessionStore = new MySQLStore({
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
        tableName: 'user_sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, sessionConnection);

var url;

if(process.env.production){
  url = "http://"+process.env.HOST+":"+process.env.PORT;
}else{
  url = "http://"+process.env.IP+":"+process.env.PORT;
}

let handlebars  = require('express-handlebars');
let bodyParser = require('body-parser');

process.on('uncaughtException', (err) => {
    console.log("Uncaught Exception:", err);
    process.exit(1);
});

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var session = session({
	secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
});

var sharedsession = require("express-socket.io-session");
app.use(session);

io.use(sharedsession(session, {
    autoSave:true
}));

app.use(express.static(__dirname + '/static'));
app.engine('handlebars', handlebars({
    defaultLayout: 'game',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        iff: (a, operator, b, options) => {
            var bool = false;
            switch (operator) {
                case '==':
                    bool = a == b;
                    break;
                case '>':
                    bool = a > b;
                    break;
                case '<':
                    bool = a < b;
                    break;
                default:
                    throw "Unknown operator " + operator;
            }

            if (bool) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    }
}));
app.set('view engine', 'handlebars');

global.async = async;

global.UserController = UserController = require("./lib/user")(db);
User = {};
const routes = require("./routes");
app.use(routes);

const [raceStrings, creationAdj, creationLoc, creationDesc] = require("./lib/strings");
function generateBackstory(){
	let r = raceStrings[Math.floor(Math.random()*raceStrings.length)],
		a = creationAdj[Math.floor(Math.random()*creationAdj.length)],
		l = creationLoc[Math.floor(Math.random()*creationLoc.length)],
		d = creationDesc[Math.floor(Math.random()*creationDesc.length)];
	let story = [
		"You are a " + a + " " + r + " from " +
		l + ", who " +
		d +"."
	];
	return story;
}

const expThresholds = [0, 0, 50, 69,97,137,192,268,376,527,737,1033,1446,2024,2834,3968,5556,7778,10889,15245,21343,29881,41834,58567,81994,114792,160709,224993,314991,440987,617383,864336,1210070,1694099,2371739,3320434,4648608,6508051,9111272,12755780,17858092,25001329,35001860,49002604,68603645,96045101,134463140,188248392,263547745,368966837,516553563,723174976,1012444950,1417422906,1984392034];

io.on('connection', function(socket){
	socket.on('game-start', (data) => {
		console.log('game-start-cmd');
		io.emit('game-start-cmd', 'ok');
	});
	
	socket.on('tpl-creation', (data) => {
		fs.readFile("views/partials/creation.html", "UTF8", (err, data) => {
			if (err) { throw err };
			let json = {
				data: {
					freePts: 20,
					backstory: generateBackstory()
				},
				html: data
			};
			io.emit('tpl-creation-result', json);
		});
	});
	
	socket.on('tpl-awaken', (text) => {
		var awakenText = text;
		fs.readFile("views/partials/gameStats.html", "UTF8", (err, data) => {
			if(err) { throw err };
			let json = {
				data: {
					name: UserController.name,
					awaken: awakenText
				},
				html: data
			};
			io.emit('tpl-awaken-result', json);
		});
	});
	
	socket.on('tpl-region', (id) => {
		fs.readFile("views/partials/regions/"+id+".html", "UTF8", (err, html) => {
			if (err) { throw err };
			let json = {
				data: {},
				html: html
			};
			io.emit('tpl-region-result', json);
		});
	});
	
	socket.on('tpl-statbar', (id) => {
		fs.readFile("views/partials/statbar.html", "UTF8", (err, data) => {
			if(err) { throw err };
			let json = {
				data: {},
				html: data
			};
			io.emit('tpl-statbar-result', json);
		});
	});
	
	socket.on('tpl-character', (id) => {
		fs.readFile("views/partials/character.html", "UTF8", (err, data) => {
			if(err) throw err;
			let json = {
				data: {},
				html: data
			};
			io.emit('tpl-character-result', json);
		});
	});
	
	socket.on('tpl-shop', (data) => {
		fs.readFile("views/partials/shop.html", "UTF8", (err, html) => {
			if (err) { throw err };
			var query = 'SELECT * FROM items WHERE i_shop = "'+data.type+'" AND i_region = "'+data.region+'"';
			db.query(query).then((results) => {
				var items = [];
				for(var i = 0; i < results.length; i++){
					var item = {
						id: results[i].i_id,
						name: results[i].i_name,
						region: results[i].i_region,
						shop: results[i].i_shop,
						guts: results[i].i_guts,
						wits: results[i].i_wits,
						charm: results[i].i_charm,
						attack: results[i].i_attack,
						defend: results[i].i_defend,
						skill: results[i].i_skill,
						cost: results[i].i_cost,
						func: results[i].i_func,
						equippable: results[i].i_equipable,
						qty: 1000,
						equipped: false,
						identified: true,
						abilities: '',
						max_enchants: results[i].i_max_enchants,
						times_enchanted: 0,
						in_storage: 0,
						drop_rate: results[i].i_drop_rate
					};
					items.push(item);
				}
				
				data.items = items;
				
				let json = {
					data: data,
					html: html
				};
				io.emit('tpl-shop-result', json);
			});
		});
	});
	
	socket.on('user-login', (data) => {
		var name = data.name,
			password = data.password;
		var query = 'SELECT * FROM users WHERE u_name = "'+name+'"';
		db.query(query).then((results) => {
			if(results.length){
				bcrypt.compare(password, results[0].u_pass, function(err, result) {
					if(result) {
						var user = {
							id: results[0].u_id,
							name: results[0].u_name,
							firstRun: results[0].u_first_run,
							hasChar: results[0].u_has_char,
							chat: results[0].u_chat
						};
						
						const buffer = require('crypto').randomBytes(48);
						var token = buffer.toString('hex');
						var expires = 1000 * 60 * 60;
						
						let options = {
							maxAge: expires,
							httpOnly: true,
							signed: true
						};
						
						User = user;
						
						io.emit('login-success', {user: user, token: token});
					} else {
						io.emit('login-failed', {redirect: "/login/"});
					} 
				});
			}else{
				io.emit('login-failed', {redirect: "/register/"});
			}
		}).catch((err) => {
			console.log(err);
		});
	});
	
	socket.on('user-register', (data) => {
		bcrypt.hash(data.password, 10, function(err, hash) {
			UserController.create(data.name, data.email, hash, function(results){
				io.emit('register-success', {redirect: "/login/"});
			});
		});
	});
	
	socket.on('user-get', (id) => {
		UserController.get(id, function(result){
			io.emit('user-get-success', result);
		});
	});
	
	socket.on('user-logout', (data) => {
		io.emit('logout-success', {redirect: "/"});
	});
	
	socket.on('user-update', (data) => {
		UserController.update(data, function(result){
			io.emit('user-update-incoming', result);
		});
	});
	
	socket.on('player-create', (obj) => {
		console.log(obj);
		var rank = 0;
		var skillFighter = 0;
		var skillMagic = 0;
		var skillTrade = 0;
		switch(obj.charClass){
			default:
			case "peasant":
			
			break;
			case "noble":
				rank = 1;
			break;
			case "warrior":
				skillFighter = 1;
			break;
			case "wizard":
				skillMagic = 1;
			break;
			case "trader":
				skillTrade = 1;
			break;
		}
		var query = "INSERT INTO players (p_owner,p_region,p_class,p_background,p_guild,p_effects,p_guts,p_max_guts,p_wits,p_max_wits,p_charm,p_max_charm,p_attack,p_defend,p_skill,p_skill_fighter,p_skill_fighter_max,p_skill_magic,p_skill_magic_max,p_skill_trade,p_skill_trade_max,p_level,p_experience,p_quests,p_max_quests,p_cash,p_rank,p_storage,p_max_storage,p_fame,p_favor,p_skilled) VALUES ("+obj.id+",'town','"+obj.charClass+"','"+obj.bg+"',0,'',"+obj.guts+","+obj.guts+","+obj.wits+","+obj.wits+","+obj.charm+","+obj.charm+",1,1,4,"+skillFighter+","+skillFighter+","+skillMagic+","+skillMagic+","+skillTrade+","+skillTrade+",1,0,5,5,"+obj.cash+","+rank+",0,20,0,0,0)";
		db.query(query).then((result) => {
			var query = 'SELECT * FROM players WHERE p_owner = '+obj.id;
			db.query(query).then((results) => {
				io.emit('player-create-incoming', results);
			}, err => {
				return db.close().then(() => { throw err; })
			});
		}, err => {
			return db.close().then(() => { throw err; })
		});
	});
	
	socket.on('player-get', (id) => {
		console.log('player-get: '+id);
		var query = 'SELECT * FROM players WHERE p_owner = '+id;
		db.query(query).then((results) => {
			io.emit('player-get-incoming', results[0]);
		}, err => {
			return db.close().then( () => { throw err; } )
		});
	});
	
	socket.on('player-update', (obj) => {
		var query = "UPDATE players SET p_region='"+obj.region+"',p_class='"+obj.charClass+"',p_background='"+obj.background+"',p_guild="+obj.guild+", p_effects='"+obj.effects+"',p_guts="+obj.guts+",p_max_guts="+obj.gutsMax+",p_wits="+obj.wits+",p_max_wits="+obj.witsMax+",p_charm="+obj.charm+",p_max_charm="+obj.charmMax+",p_attack="+obj.attack+",p_defend="+obj.defend+",p_skill="+obj.skill+",p_skill_fighter="+obj.skillFighter+",p_skill_fighter_max="+obj.skillFighterMax+",p_skill_magic="+obj.skillMagic+",p_skill_magic_max="+obj.skillMagicMax+",p_skill_trade="+obj.skillTrade+",p_skill_trade_max="+obj.skillTradeMax+",p_level="+obj.level+",p_experience="+obj.experience+",p_quests="+obj.quests+",p_max_quests="+obj.questsMax+",p_cash="+obj.cash+",p_rank="+obj.rank+",p_storage="+obj.storage+",p_max_storage="+obj.storageMax+",p_fame="+obj.fame+",p_favor="+obj.favor+",p_skilled="+obj.skilled+" WHERE p_owner = "+obj.owner;
		db.query(query).then((results) => {
			var query = 'SELECT * FROM players WHERE p_owner = '+obj.owner;
			db.query(query).then((results) => {
				io.emit('player-update-incoming', results);
			}, err => {
				return db.close().then(() => { throw err; })
			});
		}, err => {
			return db.close().then(() => { throw err; })
		});
	});
	
	socket.on('chat-set-user', (data) => {
		console.log('chat-set-user', data);
		UserController.id = data.id;
		UserController.name = data.name;
		room = data.room;
		
		var now = Math.floor(new Date() / 1000);
		var then = now - 3600;
		var query = 'SELECT c.*, u.u_name FROM chat c LEFT JOIN users u ON c_sender = u.u_id WHERE c_channel = '+room+' AND c_time BETWEEN '+then+' AND '+now;
		db.query(query).then((results) => {
			io.emit('chat-bulk-incoming', results);
		}).catch((err) => {
			console.log(err);
		});
	});
	
	socket.on('chat-room-change', (data) => {
		room = rooms[data.destination];
		var now = Math.floor(new Date() / 1000);
		var then = now - 3600;
		var query = 'UPDATE users SET u_chat = '+room+' WHERE u_id = '+UserController.id;
		db.query(query).then((results) => {
			var query = 'SELECT c.*, u.u_name FROM chat c LEFT JOIN users u ON c_sender = u.u_id WHERE c_channel = '+room+' AND c_time BETWEEN '+then+' AND '+now;
			db.query(query).then((results) => {
				io.emit('chat-bulk-incoming', results);
			}).catch((err) => {
				console.log(err);
			});
		}).catch((err) => {
			console.log(err);
		});
	});
	
	socket.on('chat-message', (data) => {
		var now = Math.floor(new Date() / 1000);
		
		var query = 'INSERT INTO chat (c_sender, c_time, c_channel, c_message) VALUES ('+UserController.id+', '+now+', '+room+', "'+data.message+'")';
		db.query(query).then((results) => {
			io.emit('chat-incoming', {message : data.message, username : UserController.name});
		}).catch((err) => {
			console.log(err);
		});
	});
	
	socket.on('inv-get', (id) => {
		var query = 'SELECT pi.*, i.* FROM player_items pi LEFT JOIN items i ON pi.pi_item = i.i_id AND pi.pi_player = '+id;
		db.query(query).then((results) => {
			io.emit('inv-get-incoming', results);
		}, err => {
			return db.close().then( () => { throw err; } )
		});
	});
	
	socket.on('inv-add-item', (itmObj) => {
		var query = 'INSERT INTO player_items (pi_item, pi_player, pi_qty, pi_equipped, pi_identified, pi_abilities, pi_guts, pi_wits, pi_charm, pi_attack, pi_defend, pi_skill, pi_times_enchanted, pi_in_storage) VALUES ('+itmObj.item+', '+UserController.id+', '+itmObj.qty+', '+itmObj.equipped+', '+itmObj.identified+', "'+itmObj.abilities+'", '+itmObj.guts+', '+itmObj.wits+', '+itmObj.charm+', '+itmObj.attack+', '+itmObj.defend+', '+itmObj.skill+', '+itmObj.timesEnchanted+', '+itmObj.inStorage+')';
		db.query(query).then((results) => {
			io.emit('inv-add-item-incoming', results);
		}, err => {
			return db.close().then( () => { throw err; } )
		});
	});
	
	socket.on('shop-user-inv-get', (id) => {
		fs.readFile("views/partials/blocks/shop-inventory.html", "UTF8", (err, data) => {
			if (err) { throw err };
			
			var query = 'SELECT pi.*, i.* FROM player_items pi LEFT JOIN items i ON pi.pi_item = i.i_id AND pi.pi_player = '+id+' WHERE pi_equipped = 0';
			db.query(query).then((results) => {
				let json = {
					data: {
						items: results
					},
					html: data
				};
				io.emit('shop-user-inv-get-result', json);
			}, err => {
				return db.close().then( () => { throw err; } )
			});
		});
	});
	
	socket.on('shop-inv-get', (shop) => {
		fs.readFile("views/partials/blocks/shop-inventory.html", "UTF8", (err, html) => {
			if (err) { throw err };
			
			let json = {
				data: {
					items: shop.items
				},
				html: html
			};
			io.emit('shop-inv-get-result', json);
		});
	});
	
	socket.on('shop-buy', (obj) => {
		var uid = obj.id;
		var itmObj = obj.itm[0];
		var query = 'INSERT INTO player_items (pi_item, pi_player, pi_qty, pi_equipped, pi_identified, pi_abilities, pi_guts, pi_wits, pi_charm, pi_attack, pi_defend, pi_skill, pi_times_enchanted, pi_in_storage) VALUES ('+itmObj._id+', '+uid+', 1, 0, 1, "", '+itmObj._guts+', '+itmObj._wits+', '+itmObj._charm+', '+itmObj._attack+', '+itmObj._defend+', '+itmObj._skill+', '+itmObj._timesEnchanted+', 0)';
		db.query(query).then((results) => {
			io.emit('shop-buy-result', itmObj._name);
		}, err => {
			return db.close().then( () => { throw err; } )
		});
	});
	
	socket.on('encounter-init', (location) => {
		var query = 'SELECT RAND(*) FROM monsters WHERE m_region = "'+location+'"';
		db.query(query).then((results) => {
			io.emit('encounter-init-result', results);
		}, err => {
			return db.close().then( () => { throw err; } )
		});
	});
});

server.listen(process.env.PORT, function () {
	console.log('DragonCourt app listening on port '+process.env.PORT+'! Go to '+url)
})

