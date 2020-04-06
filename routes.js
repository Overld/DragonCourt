const router = express.Router();

router.get("/", (req, res) => {
	res.render('site-home', {
		layout: 'site',
		pageTitle: 'Home',
	});
});

router.get('/login/', (req, res) => {
	res.render('user-login', {
		layout: 'site',
		pageTitle: 'Home',
	});
});

router.get('/register/', (req, res) => {
	res.render('user-register', {
		layout: 'site',
		pageTitle: 'Home',
	});
});

router.get('/game/', (req, res) => {
	res.render('game-main', {
		pageTitle: 'Main',
	});
});

module.exports = router;