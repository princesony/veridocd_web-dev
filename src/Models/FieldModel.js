export default class Field {
    constructor(label, widget) {
        this.label = label;
        this.widget = widget;
    }

    editLabel(newLabel) {
        this.label = newLabel;
    }

    editWidget(newType) {
        this.widget = newType;
    }
}