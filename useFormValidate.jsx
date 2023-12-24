import { useState } from 'react'
import PropTypes from 'prop-types'

const useFormValidate = (customErrorMessages = {
  is_required: 'Campo obligatorio',
  is_type_money: 'Debe ser un valor numérico válido para dinero',
  min_length: 'El campo debe tener al menos {minLength} caracteres',
  max_length: 'El campo no debe exceder los {maxLength} caracteres',
  fields_not_match: 'Los campos no coinciden',
  invalid_email: 'Ingrese un correo electrónico válido',
  invalid_date: 'Ingrese una fecha válida',
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
   * @param {object} value - Nuevo valor del campo.
   */
  const updateInput = (name, value = {}) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value
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
   * Valida un campo según las reglas especificadas.
   *
   * @param {string} name - Nombre del campo.
   * @param {any} value - Valor del campo a validar.
   * @param {object} rules - Reglas de validación.
   * @returns {boolean} - `true` si la validación es exitosa, `false` en caso contrario.
   */
  const validate = (name, value, rules) => {
    if (rules?.required && !value) {
      setError(name,rules.errorLabel || customErrorMessages.is_required)
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
    const formData = {}
    const isValid = Object.keys(inputs).every((name) => {
      const { rules, value } = inputs[name] || {}
      formData[name] = value
      return validate(name, value, rules)
    })

    if (isValid) {
      onSubmit(formData)
    }
  }

  /**
   * Obtiene las propiedades del campo, incluido el valor, el estado de error y la función de cambio.
   *
   * @param {string} name - Nombre del campo.
   * @param {object} rules - Reglas del campo.
   * @param {string} anotherValue - Valor alternativo para el campo.
   * @returns {object} - Propiedades del campo.
   */
  const getFieldProps = (name, rules = {}, anotherValue) => {
    if (!(name in inputs) || JSON.stringify(inputs[name]?.rules) !== JSON.stringify(rules)) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: { rules, value: '' }
      }))
    }

    return {
      value: inputs[name]?.value || '',
      error: getFieldError(name),
      onBlur: () => {
        if (rules?.onBlur) {
          validate(name, inputs[name]?.value, rules);
        }
      },
      onChange: (e, value) => {
        return rules.money
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
    getFieldError
  }
}

// PropTypes
useFormValidate.propTypes = {
  customErrorMessages: PropTypes.shape({
    is_required: PropTypes.string,
    is_type_money: PropTypes.string,
    min_length: PropTypes.string,
    max_length: PropTypes.string,
    fields_not_match: PropTypes.string,
    invalid_email: PropTypes.string,
    invalid_date: PropTypes.string,
    custom_validation: PropTypes.string
  })
}

export default useFormValidate