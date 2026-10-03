const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

const validateTicket = (ticket) => {
  if (!ticket.title || ticket.title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }
  if (!ticket.description || ticket.description.trim().length === 0) {
    return { valid: false, error: 'Description is required' };
  }
  if (ticket.title.length > 255) {
    return { valid: false, error: 'Title must be less than 255 characters' };
  }
  return { valid: true };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateTicket
};
