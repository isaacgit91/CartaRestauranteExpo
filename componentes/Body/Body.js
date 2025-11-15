import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Body({ carta, editarCategoria, borrarCategoria, actualizarProductos }) {
  return (
    <View style={styles.container}>
      {carta.map((cat, indexCat) => (
        <View key={cat.id} style={styles.categoriaBox}>
          <Text style={styles.categoriaNombre}>{cat.categoria}</Text>

          {/* Botones de categoría */}
          <View style={styles.botonesCategoria}>
            <TouchableOpacity style={styles.boton} onPress={() => editarCategoria(indexCat)}>
              <Text style={styles.textoBoton}>Editar categoría</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.boton, styles.borrar]} onPress={() => borrarCategoria(indexCat)}>
              <Text style={styles.textoBoton}>Borrar categoría</Text>
            </TouchableOpacity>
          </View>

          {/* Productos */}
          {cat.productos.map((prod, indexProd) => (
            <View key={prod.id} style={styles.productoBox}>
              <Text style={styles.productoTexto}>{prod.nombre} - ${prod.precio.toFixed(2)}</Text>

              {/* Botones de producto */}
              <View style={styles.botonesProducto}>
                <TouchableOpacity
                  style={styles.botonProducto}
                  onPress={() => actualizarProductos(indexCat, null, 'editar', prod, prod.id)}
                >
                  <Text style={styles.textoBotonProducto}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botonProducto, styles.borrarProducto]}
                  onPress={() => actualizarProductos(indexCat, null, 'borrar', prod, prod.id)}
                >
                  <Text style={styles.textoBotonProducto}>Borrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Botón para añadir producto */}
          <TouchableOpacity
            style={[styles.boton, styles.agregarProducto]}
            onPress={() => actualizarProductos(indexCat, null, 'agregar', { nombre: '', precio: 0 }, null)}
          >
            <Text style={styles.textoBoton}>Añadir producto</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  categoriaBox: { backgroundColor: 'rgba(255,255,255,0.8)', padding: 12, borderRadius: 8, marginBottom: 12 },
  categoriaNombre: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  botonesCategoria: { flexDirection: 'row', marginBottom: 8 },
  boton: { backgroundColor: '#a52a2a', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginRight: 8 },
  borrar: { backgroundColor: '#ff4444' },
  textoBoton: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  productoBox: { paddingVertical: 4, paddingHorizontal: 6, marginBottom: 6, backgroundColor: 'rgba(200,200,200,0.3)', borderRadius: 6 },
  productoTexto: { fontSize: 16, marginBottom: 4 },
  botonesProducto: { flexDirection: 'row' },
  botonProducto: { backgroundColor: '#0077cc', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, marginRight: 6 },
  borrarProducto: { backgroundColor: '#cc0000' },
  textoBotonProducto: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  agregarProducto: { backgroundColor: '#4CAF50', marginTop: 6 },
});
