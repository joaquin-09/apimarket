// src/screens/PaginaAgregar.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Input } from '@rneui/themed';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, ProductoFormState } from '../types';
import { apiFetch } from '../services/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'PaginaAgregar'>;

const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const REGEX_ENTERO = /^\d+$/;
const REGEX_PRECIO = /^\d+(\.\d{1,2})?$/;

const estadoInicial: ProductoFormState = {
  nombre: '', descripcion: '', precioCosto: '', precioVenta: '', cantidad: '', fotografia: '',
};

const PaginaAgregar = ({ navigation }: Props): JSX.Element => {
  const [producto, setProducto] = useState<ProductoFormState>(estadoInicial);
  const [guardando, setGuardando] = useState<boolean>(false);

  // Actualiza un solo campo del formulario sin mutar el estado original
  const actualizarCampo = (campo: keyof ProductoFormState, valor: string): void => {
    setProducto((prev) => ({ ...prev, [campo]: valor }));
  };

  const guardar = async (): Promise<void> => {
    if (!REGEX_NOMBRE.test(producto.nombre)) {
      Alert.alert('Error', 'Nombre inválido — solo letras y espacios');
      return;
    }
    if (!REGEX_ENTERO.test(producto.cantidad)) {
      Alert.alert('Error', 'La cantidad debe ser un número entero');
      return;
    }
    if (!REGEX_PRECIO.test(producto.precioCosto) || !REGEX_PRECIO.test(producto.precioVenta)) {
      Alert.alert('Error', 'Los precios deben tener máximo dos decimales');
      return;
    }

    setGuardando(true);
    try {
      await apiFetch<{ message: string; id: number }>('/productos', {
        method: 'POST',
        body: JSON.stringify({
          name: producto.nombre,
          description: producto.descripcion,
          price_cost: parseFloat(producto.precioCosto),
          price_sale: parseFloat(producto.precioVenta),
          quantity: parseInt(producto.cantidad, 10),
          image: producto.fotografia,
        }),
      });
      Alert.alert('Éxito', 'Producto agregado', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error de red';
      Alert.alert('Error al agregar', mensaje);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Input label="Nombre" value={producto.nombre} onChangeText={(t) => actualizarCampo('nombre', t)} />
      <Input label="Descripción" value={producto.descripcion} onChangeText={(t) => actualizarCampo('descripcion', t)} />
      <Input label="Precio de costo" keyboardType="decimal-pad" value={producto.precioCosto}
        onChangeText={(t) => actualizarCampo('precioCosto', t)} />
      <Input label="Precio de venta" keyboardType="decimal-pad" value={producto.precioVenta}
        onChangeText={(t) => actualizarCampo('precioVenta', t)} />
      <Input label="Cantidad" keyboardType="number-pad" value={producto.cantidad}
        onChangeText={(t) => actualizarCampo('cantidad', t)} />
      <Input label="URL de fotografía" value={producto.fotografia} onChangeText={(t) => actualizarCampo('fotografia', t)} />

      <TouchableOpacity style={styles.button} onPress={guardar} disabled={guardando}>
        {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar producto</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: colors.bg },
  button: { height: 50, backgroundColor: colors.primary, borderRadius: 10, justifyContent: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700', textAlign: 'center' },
});

export default PaginaAgregar;