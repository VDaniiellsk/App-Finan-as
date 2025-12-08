import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/api/api";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      await AsyncStorage.setItem("token", response.data.token);

      router.push("Home"); // ← NAVEGAÇÃO CORRETA NO EXPO ROUTER
    } catch (e) {
      console.log(e);
      setError("Credenciais inválidas ou erro na API");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        keyboardType="email-address"
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        returnKeyType="next"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        returnKeyType="go"
        onSubmitEditing={handleLogin}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
