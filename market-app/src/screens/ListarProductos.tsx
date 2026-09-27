// src/screens/ListarProductos.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Producto } from '../types';
import { apiFetch } from '../services/api';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ListarProductos'>;

const ListarProductos = ({ navigation }: Props): JSX.Element => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [refrescando, setRefrescando] = useState<boolean>(false);

  const cargarProductos = useCallback(async (): Promise<void> => {
    try {
      const data = await apiFetch<Producto[]>('/productos');
      setProductos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, []);

  // Recarga cada vez que la pantalla recibe foco (ej. al volver de "Agregar")
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', cargarProductos);
    return unsubscribe;
  }, [navigation, cargarProductos]);

  const renderItem = ({ item }: { item: Producto }): JSX.Element => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PaginaDetalle', { id: item.id })}>
      <Image style={styles.imagen} source={{ uri: item.fotografia }} />
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.precio}>${Number(item.precio_venta).toFixed(2)}</Text>
        <View style={[styles.badge, { backgroundColor: item.cantidad > 0 ? '#edfaf3' : '#fdf0ee' }]}>
          <Text style={{ color: item.cantidad > 0 ? colors.success : colors.danger, fontSize: 11, fontWeight: '700' }}>
            {item.cantidad > 0 ? `${item.cantidad} en stock` : 'Agotado'}
          </Text>
        </View>
      </View>
      <FontAwesome name="chevron-right" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.total}>{productos.length} producto(s)</Text>
      <FlatList<Producto>
        data={productos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={() => { setRefrescando(true); cargarProductos(); }} />
        }
        contentContainerStyle={{ paddingBottom: 90 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PaginaAgregar')}>
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 14 },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  total: { fontSize: 14, color: colors.textMuted, marginBottom: 10, fontWeight: '600' },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 12, padding: 10, marginBottom: 10, gap: 12,
    shadowColor: '#003f7f', shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
  },
  imagen: { width: 64, height: 64, borderRadius: 8 },
  info: { flex: 1, gap: 3 },
  nombre: { fontSize: 15, fontWeight: '700', color: colors.text },
  precio: { fontSize: 15, fontWeight: '800', color: colors.primary },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  fab: {
    position: 'absolute', bottom: 20, right: 20, width: 58, height: 58, borderRadius: 29,
    backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, elevation: 4,
  },
});

export default ListarProductos;