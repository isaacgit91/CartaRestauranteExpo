import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Header from './componentes/Header/Header';
import Body from './componentes/Body/Body';
import Footer from './componentes/Footer/Footer';

const API_BASE = "https://jlorenzo.ddns.net/carta_restaurante";
const USUARIO_ID = 4683;

// Contexto para reemplazar prompt()
const PromptContext = createContext();
export function usePrompt() {
  return useContext(PromptContext);
}

export default function App() {
  const [carta, setCarta] = useState([]);

  // Prompt state
  const [promptVisible, setPromptVisible] = useState(false);
  const [promptTitle, setPromptTitle] = useState("");
  const [promptValue, setPromptValue] = useState("");
  const [promptResolver, setPromptResolver] = useState(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  // Cargar categorías y productos
  const cargarCategorias = async () => {
    try {
      const res = await fetch(`${API_BASE}/categorias/?usuario_id=${USUARIO_ID}`);
      const data = await res.json();
      const lista = data.data || [];

      const categoriasConProductos = await Promise.all(
        lista.map(async (cat) => {
          const resProd = await fetch(`${API_BASE}/productos/${cat.id}?usuario_id=${USUARIO_ID}`);
          const dataProd = await resProd.json();
          const productos = dataProd.data || [];

          return {
            id: cat.id,
            categoria: cat.nombre,
            productos: productos.map((p) => ({
              id: p.id,
              nombre: p.nombre,
              precio: parseFloat(p.precio),
            })),
          };
        })
      );

      setCarta(categoriasConProductos);
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con la API.");
    }
  };

  // Prompt
  const showPrompt = (title, defaultValue = "") => {
    return new Promise((resolve) => {
      setPromptTitle(title);
      setPromptValue(defaultValue);
      setPromptResolver(() => resolve);
      setPromptVisible(true);
    });
  };

  const closePrompt = (value) => {
    setPromptVisible(false);
    if (promptResolver) promptResolver(value);
    setPromptResolver(null);
  };

  // Categorías
  const agregarCategoria = async () => {
    const nombre = await showPrompt("Nombre de la nueva categoría:");
    if (!nombre) return;

    await fetch(`${API_BASE}/categorias/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id: USUARIO_ID, nombre }),
    });

    cargarCategorias();
  };

  const editarCategoria = async (index) => {
    const cat = carta[index];
    const nuevoNombre = await showPrompt("Nuevo nombre:", cat.categoria);
    if (!nuevoNombre) return;

    await fetch(`${API_BASE}/categorias/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id: USUARIO_ID, nombre: nuevoNombre, orden: 1 }),
    });

    cargarCategorias();
  };

  const borrarCategoria = (index) => {
    const cat = carta[index];

    if (cat.productos.length > 0) {
      Alert.alert("Aviso", "Primero borra los productos de esta categoría.");
      return;
    }

    Alert.alert("Confirmar", "¿Seguro que quieres borrar esta categoría?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Borrar",
        style: "destructive",
        onPress: async () => {
          await fetch(`${API_BASE}/categorias/${cat.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: USUARIO_ID }),
          });
          cargarCategorias();
        },
      },
    ]);
  };

  // Productos
  const actualizarProductos = async (indexCategoria, _, accion, producto, idProd) => {
    const cat = carta[indexCategoria];

    if (accion === "agregar") {
      const nombre = await showPrompt("Nombre del producto:");
      if (!nombre) return;
      const precioStr = await showPrompt("Precio del producto:");
      const precio = parseFloat(precioStr) || 0;

      await fetch(`${API_BASE}/productos/${cat.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: USUARIO_ID, nombre, precio, orden: 1 }),
      });
    }

    if (accion === "editar") {
      const nombre = await showPrompt("Nuevo nombre del producto:", producto.nombre);
      if (!nombre) return;
      const precioStr = await showPrompt("Nuevo precio del producto:", producto.precio.toString());
      const precio = parseFloat(precioStr) || producto.precio;

      await fetch(`${API_BASE}/productos/${idProd}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: USUARIO_ID, nombre, precio }),
      });
    }

    if (accion === "borrar") {
      await fetch(`${API_BASE}/productos/${idProd}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: USUARIO_ID }),
      });
    }

    cargarCategorias();
  };

  return (
    <PromptContext.Provider value={{ showPrompt }}>
      <ImageBackground
        source={require("./assets/beans.jpg")}
        resizeMode="cover"
        style={styles.background}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.titulo}>Camper Café</Text>
            </View>

            <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.botonAgregarCategoria} onPress={agregarCategoria}>
                <Text style={styles.textoBoton}>Añadir categoría</Text>
              </TouchableOpacity>
            </View>

            <Body
              carta={carta}
              editarCategoria={editarCategoria}
              borrarCategoria={borrarCategoria}
              actualizarProductos={actualizarProductos}
            />

            <Footer />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Modal Prompt */}
        <Modal transparent visible={promptVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>{promptTitle}</Text>
              <TextInput
                value={promptValue}
                onChangeText={setPromptValue}
                style={styles.input}
                autoFocus
              />
              <View style={styles.row}>
                <TouchableOpacity onPress={() => closePrompt(null)}>
                  <Text style={styles.btn}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => closePrompt(promptValue)}>
                  <Text style={styles.btn}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </PromptContext.Provider>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  scrollContainer: { padding: 20, alignItems: 'center', paddingBottom: 50 },
  headerContainer: { marginBottom: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  btnContainer: { marginVertical: 12, width: '70%' },
  botonAgregarCategoria: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  textoBoton: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalBox: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { fontSize: 16, padding: 10, color: '#0077cc', fontWeight: 'bold' },
});
