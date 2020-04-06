let Game = {
	container: {},
	region: {},
    init: function(){
		Game.container = $('#gameDiv');
		
		Socket.on('game-start-cmd', (data) => {
			console.log('game-start-cmd');
			Game.statScreen();
		});
		
		Socket.on('tpl-awaken-result', (data) => {
			Game.container.html(buildTemplate(data));
			$(document).on('click', '#statsStart', function(e){
				e.preventDefault();
				
				function callback(){
					Game.play();
				};
				
				if(User.firstRun){
					User.firstRun = 0;
					Socket.emit('user-update', User);
					
					callback();
				}else{
					callback();
				}
			});
		});
		
		User.id = parseInt(localStorage.userId);
		User.name = localStorage.userName;
		User.firstRun = parseInt(localStorage.userFirstRun);
		User.hasChar = parseInt(localStorage.userHasChar);
		User.chat = parseInt(localStorage.userChat);
		User.token = localStorage.userToken;
		
		Game.start();
    },
    start: function(){
		Socket.emit('chat-set-user', {id: User.id, name: User.name, room: User.chat, hasChar: User.hasChar, firstRun: User.firstRun});
		if(User.firstRun){
			Creation.init(function(){
				Game.statScreen();
			});
		}else{
			if(!User.hasChar){
				Creation.init(function(){
					Game.statScreen();
				});
			}else{
				Game.statScreen();
			}
		}
    },
    statScreen: () => {
		Player.init();
		Socket.emit('player-get', User.id);
		
		setTimeout(function(){
			var awakenText;
			if(Player.quests){
				if(User.firstRun){
					awakenText = "You arrive in Town one sunny morning, ready to begin your adventure.";
					Game.region = new Town();
				}else{
					Game.region = RegionFactory.get(Player.region);
					awakenText = Game.region.awakenText();
					var getStipend = false;
					if(Player.charClass == 'Noble'){
						getStipend = true;
					}else if(Player.getRankString(Player.rank) != 'Peasant'){
						getStipend = true;
					}
					
					if(getStipend){
						var base = 2048;
						var gain = Math.floor((base * Player.rank) * (Player.level / 2));
						Player.cashToday = Player.cashToday + gain;
						Player.cash = Player.cash + gain;
						
						awakenText += "<br /><br />You receive "+gain+" marks as stipend from your family's lands.";
					}
					
					var percentage = 80;
					if(Player.hasEffect("Bless")){
						percentage = 10;
					}
					if(!Player.hasEffect("Bless")){
						if(Inventory.hasItemByName("Camp Tent")){
							percentage -= 20;
						}
						
						if(Inventory.hasItemByName("Sleeping Bag")){
							percentage -= 10;
						}
						
						if(Inventory.hasItemByName("Cooking Gear")){
							percentage -= 10;
						}
					}
					//apply rust effects
				}
				
				Socket.emit('tpl-awaken', awakenText);
			}else{
				// display game over / exit
			}
		}, 1500);
    },
    play: () => {
		Game.region.build();
		Player.buildStats();
    },
    regionChange: (id) => {
		Player.region = id;
		Game.region = RegionFactory.get(Player.region);
		Game.region.build();
		Player.buildStats();
    }
};