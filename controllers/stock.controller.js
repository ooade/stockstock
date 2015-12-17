var Stock = require('../models/stock');

exports.addStock = function (req, res) {
	Stock.findOne({ 'name': req.body.name.toUpperCase() }, function (err, stock) {
		if (err) throw err;
		if (stock) {
			res.json("exist");
		}
		else {
			var newStock = new Stock();
			newStock.name = req.body.name;
			newStock.save(function (err) {
				if (err) {
					throw err;
				}
				res.json("inserted");
			});

		}
	});
};

exports.retrieveStock = function (req, res) {
	Stock.find({}, function (err, stock) {
		if (err) { throw err; }
		if (stock) {
			res.json(stock);
		}
	})
};

exports.deleteStock = function (req, res) {
	Stock.findOne({ 'name': req.params.code }, function (err, stock) {
		if (err) { throw err; }
		stock.remove(function (err) {
			if (err) { throw err; }
			res.end();
		});
	})
};