
export const validateForm = (email,password) => {

  const errors = {};

  if (!email) {

    errors.email = 'Email alanı boş bırakılamaz';

  } else if (!/\S+@\S+\.\S+/.test(email)) {

    errors.email = 'Geçerli bir email girin';

  }

  if (!password) {

    errors.password = 'Şifre alanı boş bırakılamaz';

  } else if (password.length < 6) {

    errors.password = 'Şifre en az 6 karakter olmalıdır';

  }

  return errors;

};
