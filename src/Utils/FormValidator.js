import { useState } from "react"


export const useForm = (form, init) => {
    const [state, setState] = useState(() => {
        let data = {};
        console.log(init);
        Object.entries(form).forEach((entry) => {
            data[entry[0]] = "";
        });
        return data;
    });
    const [errors, setErrors] = useState(() => {
        let data = {};
        Object.entries(form).forEach((entry) => {
            data[entry[0]] = "";
        });
        return data;
    });

    const validate = () => {
        let newErr = {};
        Object.entries(state).forEach((entry) => {
            let key = entry[0];
            if (form[key] !== '') {
                if (form[key].includes('required') && !state[key]) {
                    newErr[key] = "This field cannot be empty";
                } else {
                    form[key].filter((type) => (type !== 'required'))
                    .forEach(validator => {
                        switch (validator.type) {
                            case 'length':
                                if (validator.length > state[key].length) {
                                    newErr[key] = validator.msg ?? `More than ${validator.length} characters needed`;
                                }
                                break;
                            case 'pattern':
                                if (!state[key].match(validator.regex)) {
                                    newErr[key] = validator.msg ?? "This is not valid";
                                }
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
        });
        setErrors(newErr);
        console.log(newErr);
        return Object.entries(newErr).length === 0;
    }

    return [state, setState, validate, errors];
}