import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api/api";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");

      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      const { token } = response.data;

      await AsyncStorage.setItem("token", token);

      navigation.navigate("Home");
    } catch (e) {
      setError("Credenciais inválidas ou erro na API");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
