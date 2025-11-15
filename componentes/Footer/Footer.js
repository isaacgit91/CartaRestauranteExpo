import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Visit our website{'\n'}
        123 Free Code Camp Drive
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: 'white',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});
