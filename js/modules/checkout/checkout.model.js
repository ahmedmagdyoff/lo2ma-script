export function validateForm(formData) {
    let isValid = true;
    const errors = {};
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city"];
    requiredFields.forEach(field => {
        if (!formData.get(field).trim()) {
            errors[field] = "This field is required";
            isValid = false;
        }
    });
    const email = formData.get("email").trim();
    if (email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
        errors.email = "Please enter a valid email";
        isValid = false;
    }
    return { isValid, errors };
}
export async function submitOrder(orderData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const orderId = "LS-" + Math.random().toString(36).substring(2, 9).toUpperCase();
            resolve(orderId);
        }, 500);
    });
}