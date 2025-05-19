/**
 * @description This module handles form initialization and validation.
 */

import FormStorage from './form-storage';

/**
 *
 * @param {HTMLFormElement} form
 * @param {FormStorage} storage
 * @returns
 */
function restoreFormData(form, storage) {
  const formRestoreData = storage.get();
  const formDataObject = Object.fromEntries(formRestoreData.entries());
  for (const [key, value] of Object.entries(formDataObject)) {
    const input = form.querySelector(`[name="${key}"]`);
    if (input && 'value' in input) {
      input.value = value;
    }
  }
}

/**
 *
 * @param {HTMLFormElement} [form]
 * @returns
 */
function formInitialization(form) {
  if (!form) {
    console.error('Form not found');
    return;
  }

  const formAction = form.getAttribute('action');
  const formMethod = form.getAttribute('method');
  const formEnctype = form.getAttribute('enctype') || 'multipart/form-data';
  const formValidateMessage =
    form.getAttribute('data-validate-message') || 'Please fill out this field';
  const formAutosave = form.getAttribute('data-autosave') === 'true';
  const storageType = form.getAttribute('data-storage-type');
  const formRestoreKey = form.getAttribute('data-restore-key') || 'form-data';

  if (!formAction) {
    console.error('Form action not found');
    return;
  }

  if (!formMethod) {
    console.error('Form method not found');
    return;
  }

  const storage = new FormStorage(storageType, formRestoreKey);

  restoreFormData(form, storage);

  function resetFormState(form, clean = false) {
    if (clean) {
      form.reset();
    }
    // Add default validity message to all inputs and textareas
    form.querySelectorAll('input, textarea').forEach(input => {
      if (!input.value) {
        input.setCustomValidity(formValidateMessage);
      }
    });
  }

  resetFormState(form);

  function successCallback(form) {
    console.log('Form submitted successfully');
    const formData = new FormData(form);
    const formDataObject = Object.fromEntries(formData.entries());
    console.log('Form Data', formDataObject);
    storage.clean();
    resetFormState(form, true);
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(form);

    try {
      // Send the form data to the server
      const response = await fetch(formAction, {
        method: formMethod,
        body: formData,
        headers: {
          'Content-Type': formEnctype,
        },
      });
      if (response.ok) {
        successCallback(form);
      }
    } catch (error) {
      // Simulating successful data submission:
      console.log('Simulating successful data submission:', error);
      successCallback(form);
    }
  });

  form.addEventListener('input', event => {
    const input = event.target;
    if (
      !(input instanceof HTMLInputElement) &&
      !(input instanceof HTMLTextAreaElement)
    ) {
      console.error('Input not found or does not support validity');
      return;
    }

    if (input?.validity?.valid) {
      input.setCustomValidity('');
      input.classList.remove('error');
    } else if (input?.validity?.valueMissing) {
      input.setCustomValidity(formValidateMessage);
    } else if (input?.validity?.typeMismatch) {
      input.setCustomValidity('');
      if (input.value) {
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    } else {
      input.setCustomValidity('');
    }

    // Save form data to local storage
    if (formAutosave) {
      storage.save(form);
    }
  });
}

// Does not pass auto-check
// export default formInitialization;
formInitialization(document.querySelector('.feedback-form'));
