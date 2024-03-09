import React from 'react';

function FormBuilder(props) {
    const { field, data } = props;
    const { id, label } = data;

    const renderWidget = (widgetData) => {
        const { widget, id } = widgetData;
        switch (widget) {
            case "text-input":
                return <input type="text" id={id} />;
            case "toggle-button":
                return <input type="checkbox" id={id} />;
            default:
                return null;
        }
    }

    switch (field) {
        case "text":
        case "text-input":
            return (
                <div key={id} style={{ marginBottom: '10px' }}>
                    <label>{label}</label>
                    <input type="text" style={{ marginLeft: '10px' }}/>
                </div>
            );
        case "date-time":
            return (
                <div key={id} style={{ marginBottom: '10px' }}>
                    <label>{label}</label>
                    <input type="datetime-local" style={{ marginLeft: '10px' }}/>
                </div>
            );
        case "aadhar":
            return (
                <div key={id} style={{ marginBottom: '10px' }}>
                    <label>{label}</label>
                    <input type="text" style={{ marginLeft: '10px' }}/>
                </div>
            );
        case "phone":
            return (
                <div key={id} style={{ marginBottom: '10px' }}>
                    <label>{label}</label>
                    <input type="tel" style={{ marginLeft: '10px' }}/>
                </div>
            );
        case "table":
            return (
                <div key={id} style={{ marginBottom: '10px' }}>
                    <label>{label}</label>
                    <table style={{ width: '100%', marginTop: '10px' }}>
                        <thead>
                            <tr>
                                {data.columns.map(({ label }, index) =>
                                    <th key={index}>{label}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.rows.map((row, index) =>
                                <tr key={index}>
                                    {data.columns.map((_, columnIndex) =>
                                        <td key={columnIndex}>
                                            {renderWidget(row)}
                                        </td>
                                    )}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            );
        case "file":
        case "image":
            return (
                <div key={id} style={{ marginBottom: '10px' }}>
                    <label>{label}</label>
                    <img src={data.value} alt={label} style={{ marginLeft: '10px' }}/>
                </div>
            );
        case "toggle-input":
            return (
                <div key={id} style={{ marginBottom: '10px' }}>
                    <label>{label}</label>
                    <input type="checkbox" style={{ marginLeft: '10px' }}/>
                </div>
            );
        case "signature":
            return (
                <div key={id} style={{ marginBottom: '10px' }}>
                    <label>{label}</label>
                    <input type="text" style={{ marginLeft: '10px' }}/>
                </div>
            );
        case "email":
            return (
                <div key={id} style={{ marginBottom: '10px' }}>
                    <label>{label}</label>
                    <input type="email" style={{ marginLeft: '10px' }}/>
                </div>
            );
        case "dropdown":
            return (
                <div key={id} style={{ marginBottom: '10px' }}>
                    <label>{label}</label>
                    <select style={{ marginLeft: '10px' }}>
                        {data.options.map((option, index) => 
                            <option key={index} value={option.value}>{option.label}</option>
                        )}
                    </select>
                </div>
            );
        case "address":
            return (
                <div key={id} style={{ marginBottom: '10px' }}>
                    <label>{label}</label>
                    <textarea style={{ marginLeft: '10px' }}/>
                </div>
            );
        case "file-upload":
            return (
                <div key={id} style={{ marginBottom: '10px' }}>
                    <label>{label}</label>
                    <input type="file" style={{ marginLeft: '10px' }}/>
                </div>
            );
        case "signature-image":
            return (
                <div key={id} style={{ marginBottom: '10px' }}>
                    <label>{label}</label>
                    <img src={data.value} alt="Signature" style={{ marginLeft: '10px' }}/>
                </div>
            );
        default:
            return null;
    }
}

export default FormBuilder;
