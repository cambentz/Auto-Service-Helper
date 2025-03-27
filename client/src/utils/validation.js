export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isRequired = (value) => {
    return value.trim() !== '';
};

export const isMatching = (value1, value2) => {
    return value1 === value2;
};