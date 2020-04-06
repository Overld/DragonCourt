var {mysql, pool} = require('./mysql');

var Database = function(){};

Database.prototype.query = (sql) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, (error, results) => {
            if (error){
                return reject(error);
            }else{
                resolve(results);
            }
        });
    });
};

Database.prototype.close = () => {
	return new Promise((resolve, reject) => {
		pool.end(err => {
			if(err)
				return reject(err);
			resolve();
		});
	});
};

module.exports = new Database();