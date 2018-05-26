'use strict';
var Record = function(text) {
    if (text) {
        var o = JSON.parse(text);
        this.timestamp = o.timestamp;
        this.message = o.message;
        this.from = o.from;
        this.fromName = o.fromName;
        this.fromPhone = o.fromPhone;
        this.toName = o.toName;
        this.toPhone = o.toPhone;

    } else {
        this.timestamp = new Date();
        this.message = "";
        this.from = "";
        this.fromName = "";
        this.fromPhone = "";
        this.toName = "";
        this.toPhone = "";

    }
};
Record.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};
var User = function(text) {
    if (text) {
        var o = JSON.parse(text);
        this.fromName = o.fromName;
        this.fromPhone = o.fromPhone;
    } else {
        this.fromName = "";
        this.fromPhone = "";
    }
};
User.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
};

var AnLianContract = function() {
    LocalContractStorage.defineMapProperty(this, "records", {
        parse: function(text) {
            var items = JSON.parse(text);
            var result = [];
            for (var i = 0; i < items.length; i++) {
                result.push(new Record(JSON.stringify(items[i])));
            }
            return result;
        },
        stringify: function(o) {
            return JSON.stringify(o);
        }
    });
    LocalContractStorage.defineMapProperty(this, "users", {
        parse: function(text) {
            return new User(text);
        },
        stringify: function(o) {
            return o.toString();
        }
    });
};

AnLianContract.prototype = {
    init: function() {},
    getUser: function() {
        return this.users.get(Blockchain.transaction.from) || false
    },
    getMyMessages: function() {
        var user = this.getUser();
        var records = this.records.get(user.fromName + user.fromPhone) || [];
        return records;
    },
    signIn: function(name, phone) {
        var user = new User();
        user.fromName = name
        user.fromPhone = phone
        this.users.set(Blockchain.transaction.from, user);
        return name;
    },
    sendMessage: function(name, phone, message) {
        var item = new Record();
        var from = Blockchain.transaction.from;
        item.from = from;
        var user = this.getUser();
        item.fromName = user.fromName;
        item.fromPhone = user.fromPhone;
        item.timestamp = Blockchain.transaction.timestamp;
        item.message = message;
        item.toName = name;
        item.toPhone = phone;

        var key = name + phone;
        var uRecords = this.records.get(key) || [];
        uRecords.push(item);
        this.records.put(key, uRecords);

        key = user.fromName + user.fromPhone;
        uRecords = this.records.get(key) || [];
        uRecords.push(item);
        this.records.put(key, uRecords);

        return uRecords;
    },
};
module.exports = AnLianContract;
// n1gcqTEVGTed1CBryH5g6UkWgApJ5KoFL4b

// 6cbc728ed84bdc846f47f0fa67c21522f446fa16a0d26723d312ee64b0103168