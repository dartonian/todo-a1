var express = require('express'),
    router = express.Router(),
    config = require('../config'),
    log = require('../log')(module),
    ListModel = require('../mongoose').ListModel;

router.get('/', function(req, res) {
    return ListModel.find(function (err, lists) {
        if (!err) {
            return res.send(lists);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

router.post('/', function(req, res) {

    var list = new ListModel({
        title: req.body.title,
        items: req.body.items
    });

    list.save(function (err) {
        if (!err) {
            log.info("list created");

            return res.send({ status: 'OK', list:list });
        } else {
            console.log(err);
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
});

router.put('/:id', function (req, res){

    return ListModel.findById(req.params.id, function (err, list) {
        if(!list) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        list.title = req.body.title;
        list.items = req.body.items;

        return list.save(function (err) {
            if (!err) {
                log.info("list updated");
                return res.send({ status: 'OK', list:list });
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
});

router.delete('/:id', function (req, res){
    return ListModel.findById(req.params.id, function (err, list) {
        if(!list) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return list.remove(function (err) {
            if (!err) {
                log.info("list removed");
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });
});

module.exports = router;