export function validateForm(formData) {
    let isValid = true;
    const errors = {};
    const fields = ["firstName", "lastName", "email", "phone", "address", "city"];
    fields.forEach(field => {
        const value = formData.get(field);
        if (!value || value.toString().trim() === "") {
            errors[field] = "This field is required";
            isValid = false;
        }
    });
    const email = formData.get("email");
    if (email && email.toString().trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toString().trim())) {
        errors.email = "Please enter a valid email";
        isValid = false;
    }
    return { isValid, errors };
}
export function submitOrder(orderData) {
    return "LS-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}