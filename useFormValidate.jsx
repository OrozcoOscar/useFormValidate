import { useState } from 'react'
/**
 * @typedef {Object} Rule
 * @property {boolean} [required] - Indicates if the field is required.
 * @property {boolean} [money] - Indicates if the field represents a money value.
 * @property {number} [minLength] - Minimum allowed length for the field.
 * @property {string} [isEqual] - Name of the field to compare for equality.
 * @property {boolean} [email] - Indicates if the field must contain a valid email.
 * @property {boolean} [phone] - Indicates if the field must contain a valid phone number.
 * @property {boolean} [date] - Indicates if the field must contain a valid date.
 * @property {(value: any, inputs: Object) => (boolean|string)} [validate] - Custom validation function.
 * @property {string} [errorLabel] - Custom error label.
 * @property {boolean} [url] - Indicates if the field must contain a valid URL.
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
  is_required: 'Campo obligatorio',
  is_type_money: 'Debe ser un valor numérico válido para dinero',
  min_length: 'El campo debe tener al menos {minLength} caracteres',
  max_length: 'El campo no debe exceder los {maxLength} caracteres',
  fields_not_match: 'Los campos no coinciden',
  invalid_email: 'Ingrese un correo electrónico válido',
  invalid_phone: 'Ingrese un numero telefónico válido',
  invalid_date: 'Ingrese una fecha válida',
  invalid_url: 'Ingrese una url válida',
  custom_validation: 'Error de validación personalizada'
}) => {
  const [inputs, setInputs] = useState({})
  const [errors, setErrors] = useState({})

  /**
   * Maneja el cambio de un campo en el estado de inputs.
   *
   * @param {string} name - Nombre del campo.
   * @param {any} value - Nuevo valor del campo.
   */
  const handleChange = (name, value) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: { ...prevInputs[name], value }
    }))
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
  const setError = (name, message) => {
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
  const validate = (name, value, rules) => {
    if(typeof value !== 'string'){
      throw new Error("El campo value debe ser un string")
    }
    if (rules?.required && (!value || value.trim() === '')) {
      setError(name, rules.errorLabel || customErrorMessages.is_required);
      return false;
    }
    if (rules?.url && !isValidUrl(value)) {
      setError(name, rules.errorLabel || customErrorMessages.invalid_url);
      return false;
    }
    if(rules?.phone && (value.length < 6 || value.length > 15)){
      setError(name,rules.errorLabel || customErrorMessages.invalid_phone)
      return false
    }

    if (rules?.money && !validateMoney(value)) {
      setError(name,rules.errorLabel || customErrorMessages.is_type_money)
      return false
    }

    if (rules?.minLength && value.length < rules.minLength) {
      setError(name,rules.errorLabel || customErrorMessages.min_length.replace('{minLength}', rules.minLength))
      return false
    }

    if (rules?.maxLength && value.length > rules.maxLength) {
      setError(name,rules.errorLabel || customErrorMessages.max_length.replace('{maxLength}', rules.maxLength))
      return false
    }

    if (rules?.isEqual && value !== inputs[rules.isEqual]?.value) {
      setError(name,rules.errorLabel || customErrorMessages.fields_not_match)
      return false
    }

    if (rules?.email && !validateEmail(value)) {
      setError(name,rules.errorLabel || customErrorMessages.invalid_email)
      return false
    }

    if (rules?.date && !isValidDate(value)) {
      setError(name,rules.errorLabel || customErrorMessages.invalid_date)
      return false
    }

    if (rules?.validate && typeof rules?.validate === 'function') {
      const validationResult = rules.validate(value, inputs)
      if (validationResult !== true) {
        if(typeof validationResult === 'boolean'){
          setError(name,rules.errorLabel || customErrorMessages.custom_validation)
        }else{
          setError(name,validationResult)
        }
        
        return false
      }
    }

    clearError(name)
    return true
  }
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
    if(!onSubmit || typeof onSubmit !== "function"){
      throw new Error("La funcion handleSubmit espera como parametro una funcion.")
    }
    const formData = {}
    const isValid = Object.keys(inputs).every((name) => {
      const { rules, value } = inputs[name] || {}
      formData[name] = value || ''
      return validate(name, formData[name], rules)
    })

    if (isValid) {
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
   * Obtiene las propiedades del campo, incluido el valor, el estado de error y la función de cambio.
   *
   * @param {string} name - Nombre del campo.
   * @param {object} rules - Reglas del campo.
   * @param {string} anotherValue - Valor alternativo para el campo.
   * @param {string} defaultValue - Valor por defecto para el campo.
   * @returns {object} - Propiedades del campo.
   */
  const getFieldProps = (name, rules = {}, anotherValue,defaultValue) => {
    if (!(name in inputs) || JSON.stringify(inputs[name]?.rules) !== JSON.stringify(rules)) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: { rules, value: rules?.value ||defaultValue|| '' }
      }))
    }
    let others={}
    if(inputs[name]){
      others={
        ...([rules?.helperText]?{[rules?.helperText]:getFieldError(name)}:{}),
        value: inputs[name]?.value || '',
        error: inputs[name]?.rules?.errorBoolean?Boolean(errors[name]):getFieldError(name),
      }
    }
    return {
      name:name,
      ...others,
      onBlur: () => {
        if (rules?.onBlur) {
          validate(name, inputs[name]?.value||"", rules);
        }
      },
      onChange: (e, value) => {
        return  rules?.phone
        ? handlePhoneChange(name, e?.target?.value|| (anotherValue ? value[anotherValue] : value))
        : rules.money
          ? handleMoneyChange(name, e?.target?.value || (anotherValue ? value[anotherValue] : value))
          : handleChange(name, e?.target?.value || (anotherValue ? value[anotherValue] : value))
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
    resetForm
  }
}


export default useFormValidate