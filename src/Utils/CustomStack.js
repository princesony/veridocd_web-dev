class CustomStack {
    constructor(size) {
        this.size = size;
        this.items = [];
    }

    top() {
        return this.items[this.items.length - 1];
    }

    push(item) {
        if (this.items.size <= this.size) {
            this.items.push(item);
        } else {
            this.items.shift();
            this.items.push(item);
        }
    }

    pop(item) {
        if (this.items.length !== 0) {
            this.items.pop(item);
            return this.top;
        } else {
            alert('Underflow');
        }
    }

}

export default CustomStack;