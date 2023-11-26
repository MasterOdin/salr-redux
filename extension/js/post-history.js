function PostHistory(callback) {
    this.database = window.openDatabase("salr_post_history_db", "1.0", "SALR Post History", 1024 * 1024);
    this.callback = callback || false;

    if (!this.database) {
        console.log("Error opening database");
    }

    this.initDatabase();
}

PostHistory.prototype.initDatabase = function() {
    this.database.transaction(function(query) {
        query.executeSql('CREATE TABLE threads(id INTEGER PRIMARY KEY AUTOINCREMENT, thread_id VARCHAR(25) UNIQUE)',
            []);
    });
};

PostHistory.prototype.addThread = function(thread_id) {
    this.database.transaction(function(query) {
        query.executeSql('INSERT INTO threads(thread_id) VALUES(?)', [thread_id]);
    });
};

PostHistory.prototype.getThreadStatus = function(thread_id) {
    var that = this;

    this.database.transaction(function(query) {
        query.executeSql("SELECT * FROM threads WHERE thread_id = ?", [thread_id],
            function(transaction, result) {
                if (result.rows.length > 0) {
                    that.callback(true, thread_id);
                } else {
                    that.callback(false, thread_id);
                }
            });
    });
};

PostHistory.prototype.deleteThread = function(thread_id) {
    this.database.transaction(function(query) {
        query.executeSql('DELETE FROM threads WHERE thread_id=?', [thread_id]);
    });
}
