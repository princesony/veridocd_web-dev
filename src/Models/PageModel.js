import Field from "./FieldModel";

export default class Page {
    constructor(name, initialState) {
        this.name = name;
        if (initialState.fields !== null) {
            this.setPageState(initialState);
        } else {
            this.fields = [];
        }
    }

    addField(label, widget) {
        let field = new Field(label, widget);
        this.fields.push(field);
        this.updateFieldIds();
        return this.getPageState();
    }

    updateFieldIds() {
        this.fields.forEach((field, index) => (field.id = index));
    }

    getPageState() {
        return {
            name: this.name,
            fields: this.fields.map((field) => ({
                label: field.label ?? "label",
                widget: field.widget ?? "widget"
            })),
        }
    }

    setPageState(state) {
        this.name = state.name;
        this.fields = [];
        state.fields.forEach((value, index) => {
            let field = new Field(value.label, value.widget);
            field.id = index;
            this.fields.push(field);
        });
    }

    deleteField(id) {
        this.fields.filter((page) => (page.id !== id));
        this.updateFieldIds();
        return this.getPageState();
    }
}