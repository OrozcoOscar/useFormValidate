import { useCallback, useEffect, useState } from 'react'
/**
 * @typedef {Object} Rule
 * @property {boolean} [required] - Indicates if the field is required.
 * @property {boolean} [money] - Indicates if the field represents a money value.
 * @property {number} [min] - Minimum allowed value for the field.
 * @property {number} [max] - Maximum allowed value for the field.
 * @property {number} [maxLength] - Maximum allowed length for the field.
 * @property {number} [minLength] - Minimum allowed length for the field.
 * @property {string} [isEqual] - Name of the field to compare for equality.
 * @property {boolean} [email] - Indicates if the field must contain a valid email.
 * @property {boolean} [phone] - Indicates if the field must contain a valid phone number.
 * @property {boolean} [date] - Indicates if the field must contain a valid date.
 * @property {(value: any, inputs: Object) => (boolean|string)} [validate] - Custom validation function.
 * @property {string} [errorLabel] - Custom error label.
 * @property {boolean} [url] - Indicates if the field must contain a valid URL.
 * @property {boolean} [checkbox] - Indicates if the field must be a checkbox.
 * @property {boolean} [radio] - Indicates if the field must be a radio.
 * @property {boolean} [file] - Indicates if the field must be a file.
 * @property {boolean} [validateOnChange] - Indicates if the field must be validated on change.
*/

/**
 * @typedef {Object} Field
 * @property {Rule} [rules] - Reglas de validación para el campo.
 * @property {any} value - Valor actual del campo.
 */

/**
 * @typedef {Object} Inputs
 * @property {Object.<string, Field>} - Mapa de nombres de campo a objetos de campo.
 */

/**
 * @typedef {Object} Errors
 * @property {Object.<string, string>} - Mapa de nombres de campo a mensajes de error.
 */

/**
 * @typedef {Object} UseFormValidateOptions
 * @property {Object} [customErrorMessages] - Mensajes de error personalizados.
 * @property {string} [customErrorMessages.is_required] - Mensaje para campo obligatorio.
 * @property {string} [customErrorMessages.is_type_money] - Mensaje para valor de dinero no válido.
 * @property {string} [customErrorMessages.min_length] - Mensaje para longitud mínima no cumplida.
 * @property {string} [customErrorMessages.max_length] - Mensaje para longitud máxima excedida.
 * @property {string} [customErrorMessages.fields_not_match] - Mensaje para campos no coincidentes.
 * @property {string} [customErrorMessages.invalid_email] - Mensaje para correo electrónico no válido.
 * @property {string} [customErrorMessages.invalid_phone] - Mensaje para número de teléfono no válido.
 * @property {string} [customErrorMessages.invalid_date] - Mensaje para fecha no válida.
 * @property {string} [customErrorMessages.custom_validation] - Mensaje para validación personalizada.
 */

/**
 * @typedef {Object} FormattedValue
 * @property {string} value - Valor formateado.
 * @property {boolean} error - Estado de error.
 * @property {() => void} onBlur - Manejador del evento onBlur.
 * @property {(e: React.ChangeEvent<HTMLInputElement>, value?: any) => void} onChange - Manejador del evento onChange.
 */

/**
 * Hook para validar formularios.
 *
 * @param {UseFormValidateOptions} [customErrorMessages] - Opciones para mensajes de error personalizados.
 * @returns {{
*   inputs: Inputs,
*   updateInput: (name: string, value?: Field) => void,
*   removeInput: (name: string) => void,
*   handleChange: (name: string, value: any) => void,
*   setError: (name: string, message: string) => void,
*   clearError: (name: string) => void,
*   validate: (name: string, value: any, rules?: Rule) => boolean,
*   validateEmail: (email: string) => boolean,
*   isValidDate: (dateString: string) => boolean,
*   validateMoney: (value: string) => boolean,
*   formatMoneyInput: (value?: string) => string,
*   handleMoneyChange: (name: string, value: string) => void,
*   handleSubmit: (onSubmit: (formData: any) => void) => (e: React.FormEvent) => void,
*   getFieldProps: (name: string, rules?: Rule, anotherValue?: string) => FormattedValue,
*   getFieldError: (name: string) => string
*   resetForm: () => void
* }}
*/
const useFormValidate = (customErrorMessages = {
  is_type_file: 'Debe seleccionar un archivo',
  is_type_checkbox: 'Debe seleccionar al menos una opción',
  is_type_radio: 'Debe seleccionar una opción',
  is_required: 'Campo obligatorio',
  is_type_money: 'Debe ser un valor numérico válido para dinero',
  min_length: 'El campo debe tener al menos {minLength} caracteres',
  max_length: 'El campo no debe exceder los {maxLength} caracteres',
  min: 'El campo debe tener al menos {min}',
  max: 'El campo no debe exceder los {max}',
  fields_not_match: 'Los campos no coinciden',
  invalid_email: 'Ingrese un correo electrónico válido',
  invalid_phone: 'Ingrese un numero telefónico válido',
  invalid_date: 'Ingrese una fecha válida',
  invalid_url: 'Ingrese una url válida',
  custom_validation: 'Error de validación personalizada'
}) => {
  const [inputs, setInputs] = useState({})
  const [errors, setErrors] = useState({})
  const [currentInputChange, setCurrentInputChange] = useState()


  /**
   * Maneja el cambio de un campo en el estado de inputs.
   *
   * @param {string} name - Nombre del campo.
   * @param {any} value - Nuevo valor del campo.
   * @param {object} others - Otros valores a actualizar en el campo.
   */
  const handleChange = (name, value, others = {}) => {

    setInputs((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [name]: { ...prevInputs[name], value, ...others }
      };
      return updatedInputs;
    });
    setCurrentInputChange(name)
  }


  /**
   * Actualiza un campo en el estado de inputs.
   *
   * @param {string} name - Nombre del campo.
   * @param {string} value - Nuevo valor del campo.
   */
  const updateInput = (name, value = "") => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: { ...prevInputs[name], value }
    }))
  }

  /**
   * Elimina un campo del estado de inputs.
   *
   * @param {string} name - Nombre del campo a eliminar.
   */
  const removeInput = (name) => {
    setInputs((prevInputs) => {
      delete prevInputs[name]
      return prevInputs
    })
  }

  /**
   * Establece un mensaje de error para un campo específico.
   *
   * @param {string} name - Nombre del campo.
   * @param {string} message - Mensaje de error.
   */
  const setError = (name, message = '') => {
    setErrors((prevErrors) => ({ ...prevErrors, [name]: message }))
  }

  /**
   * Limpia el mensaje de error para un campo específico.
   *
   * @param {string} name - Nombre del campo.
   */
  const clearError = (name) => {
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }))
  }

  /**
   * Reinicia un formulario.
   *
   */
  const resetForm = () => {
    setInputs({});
    setErrors({});
  };
  /**
   * Valida un campo según las reglas especificadas.
   *
   * @param {string} name - Nombre del campo.
   * @param {any} value - Valor del campo a validar.
   * @param {object} rules - Reglas de validación.
   * @returns {boolean} - `true` si la validación es exitosa, `false` en caso contrario.
   */
  const validate = useCallback((name, value, rules) => {
    if (value === undefined || value === null) {
      throw new Error("El campo value es requerido para validar el campo.")
    }
    if (rules?.required && rules?.url && !isValidUrl(value)) {
      setError(name, rules.errorLabel || customErrorMessages.invalid_url);
      return false;
    }
    if (rules?.required && rules?.phone && (value.length < 6 || value.length > 15)) {
      setError(name, rules.errorLabel || customErrorMessages.invalid_phone)
      return false
    }

    if (rules?.required && rules?.money && !validateMoney(value)) {
      setError(name, rules.errorLabel || customErrorMessages.is_type_money)
      return false
    }
    if (rules?.required && value < rules.min) {
      setError(name, rules.errorLabel || customErrorMessages.min.replace('{min}', rules.min))
      return false
    }

    if (rules?.required && value > rules.max) {
      setError(name, rules.errorLabel || customErrorMessages.max.replace('{max}', rules.max))
      return false
    }
    if (rules?.required && rules?.minLength && value.length < rules.minLength) {
      setError(name, rules.errorLabel || customErrorMessages.min_length.replace('{minLength}', rules.minLength))
      return false
    }

    if (rules?.required && rules?.maxLength && value.length > rules.maxLength) {
      setError(name, rules.errorLabel || customErrorMessages.max_length.replace('{maxLength}', rules.maxLength))
      return false
    }

    if (rules?.required && rules?.isEqual && value !== inputs[rules.isEqual]?.value) {
      setError(name, rules.errorLabel || customErrorMessages.fields_not_match)
      return false
    }

    if (rules?.required && rules?.email && !validateEmail(value)) {
      setError(name, rules.errorLabel || customErrorMessages.invalid_email)
      return false
    }

    if (rules?.required && rules?.date && !isValidDate(value)) {
      setError(name, rules.errorLabel || customErrorMessages.invalid_date)
      return false
    }

    if (rules?.validate && typeof rules?.validate === 'function') {
      const validationResult = rules.validate(value, inputs)
      if (validationResult !== true) {
        if (typeof validationResult === 'boolean') {
          setError(name, rules.errorLabel || customErrorMessages.custom_validation)
        } else {
          setError(name, validationResult)
        }

        return false
      }
    }
    if (rules?.required && rules?.checkbox && !value) {
      setError(name, rules.errorLabel || customErrorMessages.is_type_checkbox)
      return false
    }
    if (rules?.required && rules?.radio && !value) {
      setError(name, rules.errorLabel || customErrorMessages.is_type_radio)
      return false
    }
    if (rules?.required && rules?.file && (value === "" || (typeof value === 'object' && value.length === 0))) {
      setError(name, rules.errorLabel || customErrorMessages.is_type_file)
      return false
    }

    if (rules?.required && (!value || value.trim() === '')) {
      setError(name, rules.errorLabel || customErrorMessages.is_required);
      return false;
    }



    clearError(name)
    return true
  }, [inputs, customErrorMessages])
  /**
   * Valida si una url es valida.
   *
   * @param {string} url - The URL to validate.
   * @returns {boolean} - `true` if the URL is valid, `false` otherwise.
   */
  const isValidUrl = (url) => {
    // Regular expression for a simple URL validation
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  /**
   * Valida si un correo electrónico es válido.
   *
   * @param {string} email - Correo electrónico a validar.
   * @returns {boolean} - `true` si es un correo electrónico válido, `false` en caso contrario.
   */
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email)

  /**
   * Valida si una cadena es una fecha válida.
   *
   * @param {string} dateString - Cadena que representa una fecha.
   * @returns {boolean} - `true` si la cadena es una fecha válida, `false` en caso contrario.
   */
  const isValidDate = (dateString) => !isNaN(new Date(dateString).getTime())

  /**
   * Valida si un valor es un formato de dinero válido.
   *
   * @param {string} value - Valor a validar.
   * @returns {boolean} - `true` si es un valor de dinero válido, `false` en caso contrario.
   */
  const validateMoney = (value) => /^\d{1,3}(\.\d{3})*(,\d{1,2})?$/.test(value)

  /**
   * Formatea un valor de entrada en formato de dinero.
   *
   * @param {string} value - Valor a formatear.
   * @returns {string} - Valor formateado en formato de dinero.
   */
  const formatMoneyInput = (value = '') => {
    const numericValue = value.replace(/[^0-9,]/g, '')
    const parts = numericValue.split(',')

    // Handle the integer part (thousands separator)
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    return parts.join(',')
  }

  /**
   * Maneja el cambio de un campo de dinero, formateando el valor.
   *
   * @param {string} name - Nombre del campo.
   * @param {string} value - Nuevo valor del campo.
   */
  const handleMoneyChange = (name, value) => {
    const formattedValue = formatMoneyInput(value)
    handleChange(name, formattedValue)
  }

  /**
   * Maneja la presentación del formulario al enviarlo.
   *
   * @param {function} onSubmit - Función a ejecutar al enviar el formulario.
   * @returns {function} - Función de manejo del envío del formulario.
   */
  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault()
    if (!onSubmit || typeof onSubmit !== "function") {
      throw new Error("La funcion handleSubmit espera como parametro una funcion.")
    }
    const formData = {}
    const isValid = Object.keys(inputs).every((name) => {
      const { rules, value, values } = inputs[name] || {}
      formData[name] = value || values || ''
      return validate(name, formData[name], rules)
    })

    if (isValid) {
      //quitar puntos si es tipo money
      Object.keys(formData).forEach((key) => {
        if (inputs[key]?.rules?.money) {
          formData[key] = formData[key].replace(/\./g, '')
        }
      })
      onSubmit(formData)
    }
  }
  /**
   * Formatea un valor de entrada en formato de teléfono.
   *
   * @param {string} value - Valor a formatear.
   * @returns {string} - Valor formateado en formato de teléfono.
   */
  const formatPhoneInput = (value = '') => {
    // Elimina caracteres no numéricos
    const numericValue = value.replace(/[^0-9,+]/g, '');

    // Aplica el formato deseado (por ejemplo, '+0 123-456-7890' o '123-456-7890')
    const match = numericValue.match(/^(\+\d{1,3}|)\s?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      // Si hay un código de país, incluirlo en el formato
      const countryCode = match[1] ? `${match[1]} ` : '';
      return `${countryCode}${match[2]}-${match[3]}-${match[4]}`;
    }

    // Devuelve el valor sin formato si no coincide con el patrón esperado
    return numericValue;
  };


  /**
   * Maneja el cambio de un campo de teléfono, formateando el valor.
   *
   * @param {string} name - Nombre del campo.
   * @param {string} value - Nuevo valor del campo.
   */
  const handlePhoneChange = (name, value) => {
    const formattedValue = formatPhoneInput(value);
    handleChange(name, formattedValue);
  };

  /**
  * Permite gestionar el cambio de un campo 
  * @param {string} name - Nombre del campo.
  * @param {object} e - Evento de cambio.
  * @param {any} value - Valor del campo.
  * @param {object} rules - Reglas del campo.
  */
  const onChange = (name, e, value, anotherValue, rules) => {

    const newValue = e?.target?.value || (anotherValue ? value[anotherValue] : value)

    if (rules?.file) {
      const files = e?.target?.files;
      if (files && files.length > 0) {
        const filePromises = Array.from(files).map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                dataURL: reader.result,
                fileName: file.name,
                fileSize: file.size,
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        });

        Promise.all(filePromises)
          .then((fileData) => {
            handleChange(name, "", { values: fileData });
          })
          .catch((error) => {
            console.error('Error reading file:', error);
          });
      } else {
        handleChange(name, "", { values: [] });
      }
    } else if (rules?.checkbox) {
      handleChange(name, '' + e?.target?.checked);
    } else if (rules?.radio) {
      handleChange(name, rules.value || e?.target?.value || '' + e.target.checked);
    } else {
      if (rules?.phone) {
        handlePhoneChange(name, newValue);
      } else if (rules?.money) {
        handleMoneyChange(name, newValue);
      } else {
        handleChange(name, newValue);
      }
    }

  }
  /**
   * Obtiene las propiedades del campo, incluido el valor, el estado de error y la función de cambio.
   *
   * @param {string} name - Nombre del campo.
   * @param {object} rules - Reglas del campo.
   * @param {string} anotherValue - Valor alternativo para el campo.
   * @param {string} defaultValue - Valor por defecto para el campo.
   * @returns {object} - Propiedades del campo.
   */
  const getFieldProps = (name, rules = {}, anotherValue, defaultValue) => {
    if (!(name in inputs)) {
      let isEqualInput = JSON.stringify(inputs[name]?.rules) === JSON.stringify(rules)
      let changeProps = {}
      if (rules?.file) {
        changeProps = {
          values: []
        }
      }
    if (!isEqualInput) {
        setInputs((prevInputs) => ({
          ...prevInputs,
          [name]: {
            rules,
            value: rules?.value || defaultValue || '',
            ...changeProps
          }
        }))
      }

    }
    let others = {}
    if (inputs[name]) {
      others = {
        ...([rules?.helperText] ? { [rules?.helperText]: getFieldError(name) } : {}),
        value: inputs[name]?.value || '',
        ...(rules?.file ? { value: undefined } : {}),
        error: inputs[name]?.rules?.errorBoolean ? Boolean(errors[name]) : getFieldError(name),
      }
    }
    return {
      name: name,
      ...others,
      onBlur: () => {
        if (rules?.onBlur) {
          validate(name, inputs[name]?.value || "", rules);
        }
      },
      onChange: (e, value) => {
        return onChange(name, e, value, anotherValue, rules)
      }
    }
  }

  /**
   * Obtiene el mensaje de error para un campo específico.
   *
   * @param {string} name - Nombre del campo.
   * @returns {string} - Mensaje de error para el campo.
   */
  const getFieldError = (name) => errors[name] || ''



  useEffect(() => {
    if (inputs[currentInputChange]?.rules.validateOnChange) {
      validate(currentInputChange, inputs[currentInputChange].value, inputs[currentInputChange].rules);
      setCurrentInputChange()
    }
  }, [currentInputChange]);
  return {
    inputs,
    updateInput,
    errors,
    removeInput,
    handleChange,
    setError,
    clearError,
    validate,
    handleSubmit,
    getFieldProps,
    getFieldError,
    resetForm,
    customErrorMessages
  }
}


export default useFormValidate