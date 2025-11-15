import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Producto({ producto, indexCategoria, onActualizarProductos }) {
  return (
    <View style={styles.productoContainer}>
      <Text>{producto.nombre} - ${producto.precio.toFixed(2)}</Text>

      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <Button
          title="Editar"
          onPress={() => onActualizarProductos(indexCategoria, [], 'editar', { nombre: producto.nombre, precio: producto.precio }, producto.id)}
        />
        <View style={{ width: 10 }} />
        <Button
          title="Borrar"
          color="red"
          onPress={() => onActualizarProductos(indexCategoria, [], 'borrar', producto, producto.id)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productoContainer: {
    width: '100%',
    padding: 8,
    marginVertical: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
});
