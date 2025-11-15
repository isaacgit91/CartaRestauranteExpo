import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Producto from '../Producto/Producto';

export default function Carta({ categoria, productos, indexCategoria, onEditarCategoria, onBorrarCategoria, onActualizarProductos }) {
  return (
    <View style={styles.cartaContainer}>
      <Text style={styles.categoriaTitulo}>{categoria}</Text>
      {/* Botones de categoría */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
        <Button title="Editar categoría" onPress={onEditarCategoria} />
        <Button title="Borrar categoría" onPress={onBorrarCategoria} />
        <Button
          title="Añadir producto"
          onPress={() => onActualizarProductos(indexCategoria, [], 'agregar', { nombre: 'Nuevo producto', precio: 0 }, null)}
        />
      </View>
      {/* Productos */}
      {productos.map((p) => (
        <Producto
          key={p.id}
          producto={p}
          indexCategoria={indexCategoria}
          onActualizarProductos={onActualizarProductos}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  cartaContainer: {
    width: '90%',
    backgroundColor: '#deb887',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  categoriaTitulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});
