const RULES: Record<string, { pattern: RegExp; message: string }> = {
  first_name: {
    pattern: /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯёЁ-]*$/u,
    message: 'Латиница или кириллица, первая заглавная, без пробелов и цифр, допустим дефис',
  },
  second_name: {
    pattern: /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯёЁ-]*$/u,
    message: 'Латиница или кириллица, первая заглавная, без пробелов и цифр, допустим дефис',
  },
  login: {
    pattern: /^(?!\d+$)[a-zA-Z0-9_-]{3,20}$/,
    message: '3-20 символов, латиница, может содержать цифры, дефис и подчёркивание',
  },
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/,
    message: 'Некорректный email',
  },
  password: {
    pattern: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
    message: '8-40 символов, минимум одна заглавная буква и одна цифра',
  },
  phone: {
    pattern: /^\+?\d{10,15}$/,
    message: '10-15 символов, цифры, может начинаться с плюса',
  },
  message: {
    pattern: /\S/,
    message: 'Сообщение не должно быть пустым',
  },
};

export function validateField(
  name: string,
  value: string,
  form?: HTMLFormElement,
): string | null {
  if (name === 'password_confirm') {
    const password =
      form?.querySelector<HTMLInputElement>('input[name="password"]')?.value ?? '';
    if (value !== password) return 'Пароли не совпадают';
    const rule = RULES['password'];
    return rule && !rule.pattern.test(value) ? rule.message : null;
  }

  const rule = RULES[name];
  if (!rule) return null;
  return rule.pattern.test(value) ? null : rule.message;
}

function showFieldError(input: HTMLInputElement, message: string) {
  const wrapper = input.closest('.input-field');
  if (!wrapper) return;

  wrapper.classList.add('input-field--error');
  let errorEl = wrapper.querySelector('.input-field__error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'input-field__error';
    wrapper.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

function clearFieldError(input: HTMLInputElement) {
  const wrapper = input.closest('.input-field');
  if (!wrapper) return;

  wrapper.classList.remove('input-field--error');
  const errorEl = wrapper.querySelector('.input-field__error');
  if (errorEl) errorEl.remove();
}

export function validateForm(form: HTMLFormElement): {
  isValid: boolean;
  data: Record<string, string>;
} {
  const inputs = form.querySelectorAll<HTMLInputElement>('input[name]');
  let isValid = true;
  const data: Record<string, string> = {};

  inputs.forEach((input) => {
    const error = validateField(input.name, input.value, form);
    if (error) {
      showFieldError(input, error);
      isValid = false;
    } else {
      clearFieldError(input);
    }
    data[input.name] = input.value;
  });

  return { isValid, data };
}

export function attachBlurValidation(container: Element) {
  container
    .querySelectorAll<HTMLInputElement>('input[name]')
    .forEach((input) => {
      input.addEventListener('focus', () => clearFieldError(input));

      input.addEventListener('blur', () => {
        const form = input.closest('form') as HTMLFormElement | null;
        const error = validateField(input.name, input.value, form ?? undefined);
        if (error) {
          showFieldError(input, error);
        }
      });
    });
}
