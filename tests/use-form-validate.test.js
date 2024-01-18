import { renderHook, act } from '@testing-library/react';
import useFormValidate from '../useFormValidate';

describe('useFormValidate', () => {
    test('validates required fields', () => {
      const { result } = renderHook(() => useFormValidate());
  
      // Trigger validation with empty values for required fields
      act(() => {
        result.current.validate('username', '', { required: true });
        result.current.validate('password', '', { required: true });
        result.current.validate('email', '', { required: true, email: true });
      });
  
      // Assert error messages for required fields
      expect(result.current.getFieldError('username')).toBe('Campo obligatorio');
      expect(result.current.getFieldError('password')).toBe('Campo obligatorio');
      expect(result.current.getFieldError('email')).toBe('Campo obligatorio');
    });
  
    test('validates email format', () => {
      const { result } = renderHook(() => useFormValidate());
  
      // Trigger validation with invalid email format
      act(() => {
        result.current.validate('email', 'invalidEmail', { email: true });
      });
  
      // Assert error message for invalid email format
      expect(result.current.getFieldError('email')).toBe('Ingrese un correo electrónico válido');
    });
  
    test('validates password length', () => {
      const { result } = renderHook(() => useFormValidate());
  
      // Trigger validation with a short password
      act(() => {
        result.current.validate('password', 'short', { minLength: 6 });
      });
  
      // Assert error message for password length
      expect(result.current.getFieldError('password')).toBe('El campo debe tener al menos 6 caracteres');
    });

    test('validates phone number format', () => {
      const { result } = renderHook(() => useFormValidate());
  
      // Trigger validation with an invalid phone number format
      act(() => {
        result.current.validate('phoneNumber', '1234', { phone: true });
      });
      // Assert error message for invalid phone number format
      expect(result.current.getFieldError('phoneNumber')).toBe('Ingrese un numero telefónico válido');
    });
    
    test('resetForm should reset inputs and errors', () => {
      // Arrange
      const { result } = renderHook(() => useFormValidate());
  
      // Act: Realiza algunas interacciones, como llenar campos y establecer errores
      act(() => {
        result.current.updateInput('field1', { value: 'someValue', rules: {} });
        result.current.setError('field2', 'Some error message');
      });
  
      // Assert: Verifica que los inputs y errores se hayan configurado correctamente antes de resetear
      expect(result.current.inputs).toEqual({
        field1: { value: 'someValue', rules: {} },
      });
      expect(result.current.errors).toEqual({
        field2: 'Some error message',
      });
  
      // Act: Resetea el formulario
      act(() => {
        result.current.resetForm();
      });
  
      // Assert: Verifica que los inputs y errores se hayan restablecido después del reset
      expect(result.current.inputs).toEqual({});
      expect(result.current.errors).toEqual({});
    });
  
});
