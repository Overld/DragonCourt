var Encounter = {
	creature: [],
	init: (location) => {
		Socket.emit("encounter-init", location);
		Socket.on("encounter-init-result", (data) => {
			Encounter.creature = '';
		});
	}
};