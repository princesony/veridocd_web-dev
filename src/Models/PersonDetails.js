export class PersonDetails {
    constructor() {
        this.label = "";
        this.name = "";
        this.phone = "";
        this.city = "";
        this.po = "";
        this.state = "";
        this.pin = "";
    };

    toJson() {
        return {
            label: this.label,
            name: this.name,
            phone: this.phone,
            city: this.city,
            po: this.po,
            state: this.state,
            pin: this.pin
        }
    }

    fromJson(data) {
        this.label = data.label;
        this.name = data.name;
        this.phone = data.phone;
        this.po = data.po;
        this.city = data.city;
        this.state = data.state;
        this.pin = data.pin
    }
}

export const personValidation = {
    fName: [{
        type: 'length',
        length: 3
    }, 'required'],
    lName: ['required'],
    phone: ['required', {
        type: 'pattern',
        msg: 'Enter a valid phone number',
        regex: /^[7896]\d{9}$/,
    }],
    
    
    // address1: [],
    // address2: [],
    // city: [],
    // pincode: ['required', {
    //     type: 'pattern',
    //     regex: /^[1-9][0-9]{5}$/,
    //     msg: 'This is not a valid pincode'
    // }],
    // pincode: [],
    // state: [],
}