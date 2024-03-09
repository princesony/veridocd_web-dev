import Page from "./PageModel";

export default class Form {
  constructor(name, initialState) {
    const prev = JSON.parse(sessionStorage.getItem("form"));
    if (prev !== null) {
      this.setFormState({
        name: prev.name,
        data: prev.pages ?? [],
      });
    } else if (initialState.pages !== null) {
      this.setFormState(initialState);
    } else {
      this.name = name;
      this.pages = [];
    }
  }

  updatePageIds() {
    this.pages.forEach((page, index) => (page.id = index));
  }

  getPage(id) {
    return this.pages.find((page) => page.id === id);
  }

  addPage() {
    let page = new Page("new page", { name: "new page", fields: [] });
    this.pages.push(page);
    this.updatePageIds();
    return this.getState();
  }

  deletePage(id) {
    this.pages = this.pages.filter((value) => {
      return value.id !== id;
    });
    this.updatePageIds();
    return this.getState();
  }

  getState() {
    // console.log({
    //   name: this.name,
    //   pages: this.pages.map((page) => ({
    //     name: page.name ?? "new page",
    //     fields: page.fields ?? [],
    //     id: page.id,
    //   })),
    // });
    return {
      name: this.name,
      pages: this.pages.map((page) => ({
        name: page.name ?? "new page",
        fields: page.fields ?? [],
        id: page.id,
      })),
    };
  }

  setFormState(state) {
    this.name = state.name;
    this.pages = state.data ?? [];
  }
}
