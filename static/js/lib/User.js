var User = {
	id: 0,
	name: '',
	firstRun: 1,
	hasChar: 0,
	chat: 0,
	token: '',
	init: () => {
		Socket.on("login-success", (data) => {
			console.log(data);
			this.id = data.user.id;
			this.name = data.user.name;
			this.firstRun = data.user.firstRun;
			this.hasChar = data.user.hasChar;
			this.chat = data.user.chat;
			this.token = data.token;
			
			localStorage.setItem('userId', this.id);
			localStorage.setItem('userName', this.name);
			localStorage.setItem('userFirstRun', this.firstRun);
			localStorage.setItem('userHasChar', this.hasChar);
			localStorage.setItem('userChat', this.chat);
			localStorage.setItem('userToken', this.token);
			console.log(this);
			setCookie('uid', this.id, 365);
			
			window.location = "http://"+DC.host+":"+DC.port+"/game";
		});
		
		Socket.on("login-failed", (data) => {
			window.location = "http://"+DC.host+":"+DC.port+data.redirect;
		});
		
		Socket.on("register-success", (data) => {
			window.location = "http://"+DC.host+":"+DC.port+data.redirect;
		});
		
		Socket.on("logout-success", (data) => {
			localStorage.removeItem("userId");
			localStorage.removeItem("userName");
			localStorage.removeItem("userFirstRun");
			localStorage.removeItem("userHasChar");
			localStorage.removeItem("userChat");
			localStorage.removeItem("userToken");
		});
		
		Socket.on("user-update-incoming", (data) => {
		
		});
		
		Socket.on("user-get-success", (data) => {
			this.id = data.user.u_id;
			this.name = data.user.u_name;
			this.firstRun = data.user.u_first_run;
			this.hasChar = data.user.u_has_char;
			this.chat = data.user.u_chat;
			this.token = data.token;
		});
	},
	load: () => {
		this.id = localStorage.userId;
		this.name = localStorage.userName;
		this.firstRun = localStorage.userFirstRun;
		this.hasChar = localStorage.userHasChar;
		this.chat = localStorage.userChat;
		this.token = localStorage.userToken;
	}
};