const storageKey = "postHistory";

// eslint-disable-next-line no-redeclare
function PostHistory() {
    console.log('existing thread data', JSON.stringify(this.getThreadData(), null, 2));
}

PostHistory.prototype.getThreadData = function() {
    try {
        return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (err) {
        console.error('Could not parse stored post history data, resetting', err);
        this.setThreadData({});
        return {};
    }
};

PostHistory.prototype.setThreadData = function(data) {
    localStorage.setItem(storageKey, JSON.stringify(data));
};

PostHistory.prototype.getThreadStatus = function(threadId) {
    const data = this.getThreadData();
    return data[threadId] || false;
};

PostHistory.prototype.addThread = function(threadId) {
    const data = this.getThreadData();
    data[threadId] = true;
    this.setThreadData(data);
};

PostHistory.prototype.deleteThread = function(threadId) {
    const data = this.getThreadData();
    delete data[threadId];
    this.setThreadData(data);
};
