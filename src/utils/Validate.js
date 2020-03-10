export const VALID = 0;
export const EMPTY = -1;
export const INVALID_EMAIL = -2;
export const INVALID_PASSWORD = -3;
export const INVALID_PHONE = -4;
export const INVALID_NUMBER = -5;
export const INVALID_VAT = -6;

export const PASSWORD_NOT_MATCH = -7;

export const MSG_VALID = " is valid!";
export const MSG_EMPTY = " should not be empty!";
export const MSG_INVALID_EMAIL = " is not valid!";
export const MSG_INVALID_PASSWORD = " should be 7 characters at least!";
export const MSG_INVALID_PHONE = " is not valid!";
export const MSG_INVALID_NUMBER = " is not valid!";
export const MSG_INVALID_VAT = " should be 11 characters!";
export const MSG_PASSWORD_NOT_MATCH = "Password not match!";

export const checkEmpty = value => {
	if (!value.trim().length) {
		return { code: EMPTY, msg: MSG_EMPTY };
	}

	return { code: VALID, msg: MSG_VALID };
};

export const checkVAT = value => {
	if (!value.trim().length) {
		return { code: EMPTY, msg: MSG_EMPTY };
	}

	if (value.trim().length !== 11) {
		return { code: INVALID_VAT, msg: MSG_INVALID_VAT };
	}

	return { code: VALID, msg: MSG_VALID };
};

export const checkPassword = value => {
	if (!value.trim().length) {
		return { code: EMPTY, msg: MSG_EMPTY };
	}
	if (value.length < 7) {
		return { code: INVALID_PASSWORD, msg: MSG_INVALID_PASSWORD };
	}

	return { code: VALID, msg: MSG_VALID };
};

export const checkConfirmPassword = (password, confirm) => {
	if (password !== confirm) {
		return { code: PASSWORD_NOT_MATCH, msg: MSG_PASSWORD_NOT_MATCH };
	}

	return { code: VALID, msg: MSG_VALID };
};

export const checkEmail = value => {
	if (!value.trim().length) {
		return { code: EMPTY, msg: MSG_EMPTY };
	}
	if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g.test(value)) {
		return { code: VALID, msg: MSG_VALID };
	}

	return { code: INVALID_EMAIL, msg: MSG_INVALID_EMAIL };
};

export const applyToInput = (input, code) => {
	if (code === VALID) {
		input.style.border = 0;
	} else {
		input.style.border = "1px solid red";
	}
};
