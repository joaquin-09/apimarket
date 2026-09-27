// src/screens/PantallaRegistro.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Input } from '@rneui/themed';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { apiFetch } from '../services/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Registro'>;

// Tipo de unión — cada campo del formulario puede tener un mensaje de error o ninguno
type CampoError = string | null;

const PantallaRegistro = ({ navigation }: Props): JSX.Element => {
  const [nombre, setNombre] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [clave, setClave] = useState<string>('');
  const [confirmar, setConfirmar] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);

  const [errores, setErrores] = useState<Record<'nombre' | 'correo' | 'clave' | 'confirmar', CampoError>>({
    nombre: null, correo: null, clave: null, confirmar: null,
  });

  const validarCorreo = (valor: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

  const validarFormulario = (): boolean => {
    const nuevosErrores: typeof errores = {
      nombre: nombre.trim().length < 2 ? 'El nombre es muy corto' : null,
      correo: !validarCorreo(correo) ? 'Correo inválido' : null,
      clave: clave.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : null,
      confirmar: confirmar !== clave ? 'Las contraseñas no coinciden' : null,
    };
    setErrores(nuevosErrores);
    return Object.values(nuevosErrores).every((e) => e === null);
  };

  const registrar = async (): Promise<void> => {
    if (!validarFormulario()) return;
    setCargando(true);
    try {
      await apiFetch<{ message: string; id: number }>('/usuarios/registro', {
        method: 'POST',
        body: JSON.stringify({ nombre, correo, clave }),
      });
      Alert.alert('Cuenta creada', 'Ahora puedes iniciar sesión', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error de red';
      Alert.alert('No se pudo registrar', mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <Input label="Nombre" value={nombre} onChangeText={setNombre} errorMessage={errores.nombre ?? undefined} />
      <Input label="Correo" value={correo} onChangeText={setCorreo} autoCapitalize="none"
        keyboardType="email-address" errorMessage={errores.correo ?? undefined} />
      <Input label="Contraseña" value={clave} onChangeText={setClave} secureTextEntry
        errorMessage={errores.clave ?? undefined} />
      <Input label="Confirmar contraseña" value={confirmar} onChangeText={setConfirmar} secureTextEntry
        errorMessage={errores.confirmar ?? undefined} />

      <TouchableOpacity style={styles.button} onPress={registrar} disabled={cargando}>
        {cargando ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrarme</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Ya tengo cuenta — Iniciar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', backgroundColor: colors.bg },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', color: colors.primaryDark, marginBottom: 22 },
  button: { height: 50, backgroundColor: colors.success, borderRadius: 10, justifyContent: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700', textAlign: 'center' },
  link: { textAlign: 'center', color: colors.primary, marginTop: 18, fontWeight: '600' },
});

export default PantallaRegistro;