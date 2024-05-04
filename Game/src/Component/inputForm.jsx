import React from 'react';
import Swal from 'sweetalert2';

const InputForm = () => {
    const handleInput = async () => {
        const { value: username } = await Swal.fire({
            title: "Enter your username",
            input: "text",
            inputLabel: "Username",
            inputPlaceholder: "Enter your username"
        });
        if (username) {
            Swal.fire(`Entered username: ${username}`);
        }
    };

    return (
        <button onClick={handleInput}>Input Email</button>
    );
};

export default InputForm;
