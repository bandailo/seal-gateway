
class orderMemDB {
    constructor() {
        this.db = new Map();
    }

    insert(id, obj) {
        this.db.set(id , obj);
    }

    update(id, obj) {
        this.db.set(id , obj);
    }

    find(id) {
        return this.db.has(id);
    }

    get(id) {
        return this.db.get(id);
    }

    size() {
        return this.db.size;
    }

}

module.exports = orderMemDB;
