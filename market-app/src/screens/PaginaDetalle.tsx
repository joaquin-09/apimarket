// src/screens/PaginaDetalle.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Input } from '@rneui/themed';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Producto } from '../types';
import { apiFetch } from '../services/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'PaginaDetalle'>;

const REGEX_PRECIO = /^\d+(\.\d{1,2})?$/;
const REGEX_ENTERO = /^\d+$/;

const PaginaDetalle = ({ route, navigation }: Props): JSX.Element => {
  const { id } = route.params; // TypeScript garantiza que id es number

  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [guardando, setGuardando] = useState<boolean>(false);

  useEffect(() => {
    apiFetch<Producto>(`/productos/${id}`)
      .then(setProducto)
      .catch((error) => Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo cargar'))
      .finally(() => setCargando(false));
  }, [id]);

  const actualizarCampo = <K extends keyof Producto>(campo: K, valor: Producto[K]): void => {
    setProducto((prev) => (prev ? { ...prev, [campo]: valor } : prev));
  };

  const actualizar = async (): Promise<void> => {
    if (!producto) return;
    if (!REGEX_ENTERO.test(String(producto.cantidad))) {
      Alert.alert('Error', 'Cantidad inválida');
      return;
    }
    if (!REGEX_PRECIO.test(String(producto.precio_costo)) || !REGEX_PRECIO.test(String(producto.precio_venta))) {
      Alert.alert('Error', 'Precio inválido');
      return;
    }
    setGuardando(true);
    try {
      await apiFetch<{ message: string }>(`/productos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(producto),
      });
      Alert.alert('Actualizado', 'Producto actualizado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo actualizar');
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = (): void => {
    Alert.alert('Eliminar producto', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await apiFetch<{ message: string }>(`/productos/${id}`, { method: 'DELETE' });
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo eliminar');
          }
        },
      },
    ]);
  };

  if (cargando || !producto) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image style={styles.imagen} source={{ uri: producto.fotografia }} />

      <Input label="Nombre" value={producto.nombre} onChangeText={(t) => actualizarCampo('nombre', t)} />
      <Input label="Descripción" value={producto.descripcion} onChangeText={(t) => actualizarCampo('descripcion', t)} />
      <Input label="Precio de costo" value={String(producto.precio_costo)}
        onChangeText={(t) => actualizarCampo('precio_costo', Number(t))} keyboardType="decimal-pad" />
      <Input label="Precio de venta" value={String(producto.precio_venta)}
        onChangeText={(t) => actualizarCampo('precio_venta', Number(t))} keyboardType="decimal-pad" />
      <Input label="Cantidad" value={String(producto.cantidad)}
        onChangeText={(t) => actualizarCampo('cantidad', Number(t))} keyboardType="number-pad" />

      <View style={styles.acciones}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={actualizar} disabled={guardando}>
          {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Actualizar</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.danger }]} onPress={eliminar}>
          <Text style={styles.btnText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: colors.bg },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagen: { width: 120, height: 120, borderRadius: 12, alignSelf: 'center', marginBottom: 16 },
  acciones: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: { flex: 1, height: 46, borderRadius: 10, justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});

export default PaginaDetalle;