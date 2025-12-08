import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import api from "../src/api/api";

export default function Home() {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransacoes = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.get("/transacoes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransacoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransacoes();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Logado com sucesso!</Text>
      {loading ? <Text>Carregando...</Text> : <Text>Transações: {transacoes.length}</Text>}
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
}