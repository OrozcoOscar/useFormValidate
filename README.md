## React useFormValidate Hook

Este hook de React proporciona funcionalidades para gestionar el estado y la validación de formularios de manera sencilla.

### Instalación

Puedes instalar el hook utilizando npm:

```bash
npm install --save use-form-validate
```

### Uso

```jsx
import React from 'react';
import {useFormValidate} from 'use-form-validate';

const MyFormComponent = () => {
  const {
    inputs,
    handleChange,
    errors,
    setError,
    clearError,
    validate,
    handleSubmit,
    getFieldProps,
    getFieldError,
    resetForm
  } = useFormValidate();

  const onSubmit = (formData) => {
    // Lógica para manejar el envío del formulario
    console.log('Formulario enviado:', formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="fieldName">Campo de Ejemplo:</label>
        <input
          type="text"
          id="fieldName"
          {...getFieldProps('fieldName', { required: true })}
        />
        <span style={{ color: 'red' }}>{getFieldError('fieldName')}</span>
      </div>

      {/* Agrega más campos del formulario según tus necesidades */}

      <div>
        <button type="submit">Enviar</button>
      </div>
    </form>
  );
};

export default MyFormComponent;
```

### Funcionalidades

- **`handleChange(name, value):`** Actualiza el valor de un campo en el estado.
- **`updateInput(name, updatedProperties):`** Actualiza propiedades específicas de un campo en el estado.
- **`removeInput(name):`** Elimina un campo del estado.
- **`setError(name, message):`** Establece un mensaje de error para un campo específico.
- **`clearError(name):`** Limpia el mensaje de error para un campo específico.
- **`validate(name, value, rules):`** Realiza la validación de un campo según reglas específicas.
- **`handleSubmit(onSubmit):`** Maneja la lógica de envío del formulario, ejecuta la validación y llama a la función `onSubmit` si el formulario es válido.
- **`getFieldProps(name, rules, anotherValue):`** Proporciona props para un campo específico, incluido el valor, el manejo de cambios y el estado de error.
- **`resetForm():`** Permite reiniciar el formulario.

## Funcionalidades y Reglas de Validación

El `useFormValidate` hook proporciona varias funcionalidades para facilitar la gestión de formularios, junto con reglas de validación personalizadas. Aquí hay un resumen de las reglas de validación disponibles:

### Reglas de Validación

- **`errorBoolean:`** Si el input trabaja con `error` pero es de tipo booleano.
  ```jsx
  getFieldProps('fieldName', { errorBoolean: true })
  ```
- **`required:`** Campo obligatorio.
  ```jsx
  getFieldProps('fieldName', { required: true })
  ```

- **`minLength:`** Mínimo número de caracteres permitidos.
  ```jsx
  getFieldProps('fieldName', { minLength: 5 })
  ```

- **`maxLength:`** Máximo número de caracteres permitidos.
  ```jsx
  getFieldProps('fieldName', { maxLength: 10 })
  ```

- **`money:`** Valor debe ser un formato de dinero válido.
  ```jsx
  getFieldProps('amount', { money: true })
  ```

- **`phone:`** Valor debe ser un formato de numero válido.
  ```jsx
  getFieldProps('telephone', { phone: true })
  ```

- **`isEqual:`** Igualdad con otro campo.
  ```jsx
  getFieldProps('password', { isEqual: 'confirmPassword' })
  ```

- **`email:`** Debe ser un correo electrónico válido.
  ```jsx
  getFieldProps('email', { email: true })
  ```

- **`date:`** Debe ser una fecha válida.
  ```jsx
  getFieldProps('eventDate', { date: true })
  ```
- **`onBlur:`** Ejecuta la validación cuando pierde el foco.
  ```jsx
  getFieldProps('fieldName', { onBlur: true })
  ```
- **`validate:`** Validación personalizada con una función.
  ```jsx
  getFieldProps('customField', {
    validate: (value, allInputs) => {
      // Lógica de validación personalizada
      return true; // Devuelve `true` si la validación es exitosa, un mensaje de error si falla.
    }
  })
  ```
- **`errorLabel:`** Permite modificar el mensaje de error.
  ```jsx
  getFieldProps('fieldName', { required:true, errorLabel: "Verifica el campo antes de continuar" })
  ```

### Ejemplo Completo

```jsx
const {
  inputs,
  handleChange,
  errors,
  setError,
  clearError,
  validate,
  handleSubmit,
  getFieldProps,
  getFieldError,
} = useFormValidate();

// ...

<input
  type="text"
  id="fieldName"
  {...getFieldProps('fieldName', { required: true, minLength: 3, maxLength: 10 })}
/>
<span style={{ color: 'red' }}>{getFieldError('fieldName')}</span>
```
Con estas reglas, puedes personalizar la validación de cada campo de acuerdo con tus requisitos específicos. ¡Experimenta con ellas y ajusta según sea necesario para tu aplicación!


### Personalización de Mensajes de Error

Puedes personalizar los mensajes de error pasando un objeto al hook. Los mensajes pueden incluir marcadores de posición, como `{minLength}`, `{maxLength}`, o `{customMessage}`, que se reemplazarán con los valores correspondientes durante la validación.

```jsx
const customErrorMessages = {
  is_required: 'Este campo es obligatorio',
  is_type_money: 'Por favor, ingrese un valor numérico válido para dinero',
  min_length: 'El campo debe tener al menos {minLength} caracteres',
  max_length: 'El campo no debe exceder los {maxLength} caracteres',
  fields_not_match: 'Los campos no coinciden',
  invalid_email: 'Ingrese un correo electrónico válido, por favor',
  invalid_date: 'Ingrese una fecha válida, por favor',
  custom_validation: 'Error de validación personalizada: {customMessage}',
};

const {
  // ... otras props del hook
} = useFormValidate(customErrorMessages);
```

### Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún error o tienes sugerencias para mejorar este hook, no dudes en abrir un problema o enviar un pull request.

### Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
